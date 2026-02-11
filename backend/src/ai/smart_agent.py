import json
import logging
from typing import Any, List, Optional
from uuid import UUID

from openai import AsyncOpenAI
from sqlmodel import Session

from core.config import settings
from ai.mcp_server import list_tasks, add_task, update_task_status, search_tasks, delete_all_tasks

# Configure logging
logger = logging.getLogger(__name__)

import enum
from datetime import datetime

class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, enum.Enum):
            return obj.value
        return super().default(obj)

class SmartAgent:
    def __init__(self, session: Session, user_id: UUID):
        self.session = session
        self.user_id = str(user_id)
        
        # Initialize OpenAI Client
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_API_BASE
        )
        self.model = settings.OPENAI_MODEL

        # Define available tools (Manual MCP mapping for in-process usage)
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List my tasks, optionally filtering by status (completed/pending).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "limit": {"type": "integer", "description": "Number of tasks to return"},
                            "status": {"type": "string", "enum": ["all", "completed", "pending"]}
                        },
                        "required": []
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task to my todo list.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "The task title"},
                            "description": {"type": "string", "description": "Optional details"},
                            "priority": {"type": "string", "enum": ["low", "medium", "high"]}
                        },
                        "required": ["title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task_status",
                    "description": "Mark a task as completed or pending.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "string", "description": "The UUID or the exact Title of the task"},
                            "is_completed": {"type": "boolean", "description": "True for completed, False for pending"}
                        },
                        "required": ["task_id", "is_completed"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_tasks",
                    "description": "Search for tasks by keyword.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search text"}
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Edit an existing task (title, description, priority, etc).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "string", "description": "The UUID or the exact Title of the task"},
                            "title": {"type": "string", "description": "New title"},
                            "description": {"type": "string", "description": "New description"},
                            "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                            "is_completed": {"type": "boolean"}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Remove a single task from the list.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {"type": "string", "description": "The UUID or the exact Title of the task to delete"}
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_all_tasks",
                    "description": "Remove EVERY task in my todo list.",
                    "parameters": {
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                }
            }
        ]

    async def run(self, user_message: str, chat_history: List[dict] = None) -> str:
        """
        Run the agent loop with model fallback for 429 errors.
        """
        try:
            messages = [
                {"role": "system", "content": "You are a helpful Todo AI assistant. You can manage tasks directly (Add, List, Update, Delete). You can also delete ALL tasks if requested. Perform requested actions immediately if the user is clear. If a UUID is not available, you can use the exact Task Title instead. Only ask for confirmation or clarify if the request is truly ambiguous."}
            ]
            
            if chat_history:
                for msg in chat_history:
                    messages.append(msg)
            
            messages.append({"role": "user", "content": user_message})

            logger.info(f"SmartAgent calling LLM with {len(messages)} messages")
            
            # First Call
            response_message = await self._call_llm(messages, tools=self.tools)
            
            logger.info(f"SmartAgent got response: {type(response_message)}")
            
            # If no tool calls, just return the text
            if not response_message.tool_calls:
                return response_message.content or "I didn't understand that."
            
            # Handle Tool Calls
            messages.append(response_message) # Extend conversation with assistant's intent
            
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                tool_output = await self._execute_tool(function_name, arguments)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": json.dumps(tool_output, cls=EnhancedJSONEncoder)
                })
            
            # Second Call (Get final answer based on tool outputs)
            final_response = await self._call_llm(messages)
            return final_response.content

        except Exception as e:
            logger.error(f"SmartAgent Error: {str(e)}", exc_info=True)
            # Return a user-friendly error message instead of raising
            return f"Sorry, I encountered an error processing your request: {str(e)[:100]}"

    async def _call_llm(self, messages: List[dict], tools: Optional[List[dict]] = None):
        """Helper to call LLM with fallback for 429 errors."""
        models = [
            self.model,
            "gemini-2.0-flash",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-latest",
            "gemini-flash-latest",
        ]
        
        last_error = None
        for model_name in models:
            try:
                logger.info(f"Calling LLM with model: {model_name}")
                kwargs = {
                    "model": model_name,
                    "messages": messages,
                }
                if tools:
                    kwargs["tools"] = tools
                    kwargs["tool_choice"] = "auto"
                
                response = await self.client.chat.completions.create(**kwargs)
                
                # Extract the message from response
                if not response or not response.choices:
                    logger.warning(f"Empty response from {model_name}")
                    continue
                
                message = response.choices[0].message
                
                # Ensure message has the expected structure
                if not message:
                    logger.warning(f"No message in response from {model_name}")
                    continue
                    
                return message
                
            except Exception as e:
                last_error = e
                error_str = str(e).lower()
                # If it's a rate limit (429), not found (404), or other transient provider error, try next model
                transient_errors = ["429", "rate_limit", "404", "not found", "502", "503", "timeout", "connection", "model not found"]
                if any(err in error_str for err in transient_errors):
                    logger.warning(f"Model {model_name} failed with transient error: {e}, trying next...")
                    continue
                # For other errors, log and try next model instead of re-raising immediately
                logger.error(f"Model {model_name} failed with error: {e}, trying next...")
                continue
        
        # If all models failed, raise the last error with context
        logger.error(f"All models failed. Last error: {last_error}")
        raise Exception(f"All LLM models failed. Last error: {str(last_error)}")

    async def _execute_tool(self, name: str, args: dict) -> Any:
        """Execute the mapped internal functions mimicking MCP behavior."""
        logger.info(f"Executing tool {name} with args {args}")
        
        # Inject user_id automatically since we are in the backend context
        if "user_id" not in args:
            args["user_id"] = self.user_id

        try:
            if name == "list_tasks":
                # Filter out 'user_id' if function doesn't need it (our MCP definitions do need it)
                return list_tasks(**args)
            elif name == "add_task":
                return add_task(**args)
            elif name == "update_task_status":
                # update_task_status signature is (task_id, is_completed) - no user_id needed
                if "user_id" in args: del args["user_id"] 
                return update_task_status(**args)
            elif name == "search_tasks":
                return search_tasks(**args)
            elif name == "update_task":
                if "user_id" in args: del args["user_id"]
                from ai.mcp_server import update_task
                return update_task(**args)
            elif name == "delete_task":
                if "user_id" in args: del args["user_id"]
                from ai.mcp_server import delete_task
                return delete_task(**args)
            elif name == "delete_all_tasks":
                from ai.mcp_server import delete_all_tasks
                return delete_all_tasks(**args)
            else:
                return {"error": "Unknown tool"}
        except Exception as e:
            return {"error": str(e)}
