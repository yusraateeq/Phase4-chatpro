# from langchain_openai import ChatOpenAI
# from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
# from sqlmodel import Session
# from uuid import UUID
# from ai.tools.task_tools import AddTaskTool, UpdateTaskTool, ListTasksTool, DeleteTaskTool
# from core.config import settings
# import asyncio

# class TodoAgent:
#     def __init__(self, session: Session, user_id: UUID):
#         self.session = session
#         self.user_id = user_id
#         self.llm = ChatOpenAI(
#             api_key=settings.OPENAI_API_KEY,
#             base_url=settings.OPENAI_API_BASE,
#             model=settings.OPENAI_MODEL,
#             max_tokens=settings.OPENAI_MAX_TOKENS,
#             temperature=0
#         )
        
#         self.tools = {
#             "add_task": AddTaskTool(session=session, user_id=user_id),
#             "update_task": UpdateTaskTool(session=session, user_id=user_id),
#             "list_tasks": ListTasksTool(session=session, user_id=user_id),
#             "delete_task": DeleteTaskTool(session=session, user_id=user_id)
#         }
        
#         self.system_prompt = """You are a professional task management assistant. 
# You help users manage their todo list by creating, updating, listing, and deleting tasks.

# When users ask you to do something with their tasks, respond naturally and helpfully.
# For simple greetings or questions, just respond conversationally without using tools."""

#     async def run(self, input_text: str, chat_history: list = None):
#         # Convert chat history from dict format to LangChain message objects
#         messages = [SystemMessage(content=self.system_prompt)]
        
#         if chat_history:
#             for msg in chat_history:
#                 if msg.get("role") == "user":
#                     messages.append(HumanMessage(content=msg["content"]))
#                 elif msg.get("role") == "assistant":
#                     messages.append(AIMessage(content=msg["content"]))
        
#         # Add the current user message
#         messages.append(HumanMessage(content=input_text))

#         # DEBUG LOGGING
#         import logging
#         logging.error(f"DEBUG: Messages count: {len(messages)}")
#         for i, m in enumerate(messages):
#             logging.error(f"DEBUG: Msg {i}: Type={type(m)}, Content={repr(m.content)}")

        
        
#         try:
#             # WORKAROUND: Convert messages to dicts to avoid Pydantic v1/v2 conflicts
#             # The error 'str object has no attribute model_dump' implies internal confusion in langchain-openai
#             safe_messages = []
#             for m in messages:
#                 # If it's already a dict or str, keep it
#                 if isinstance(m, (dict, str)):
#                     safe_messages.append(m)
#                     continue
                
#                 # Try new Pydantic v2 method
#                 if hasattr(m, 'model_dump'):
#                     safe_messages.append(m.model_dump())
#                 # Try old Pydantic v1 method
#                 elif hasattr(m, 'dict'):
#                     safe_messages.append(m.dict())
#                 else:
#                     # Fallback
#                     safe_messages.append(m)

#             # Use synchronous invoke in a thread pool to avoid async serialization issues
#             loop = asyncio.get_event_loop()
#             response = await loop.run_in_executor(None, self.llm.invoke, safe_messages)
#             return response.content
#         except Exception as e:
#             import traceback
#             import logging
#             logging.error(f"Agent error: {str(e)}")
#             logging.error(f"Traceback: {traceback.format_exc()}")
#             return f"I'm sorry, I encountered an error: {str(e)}. Please try rephrasing your request."










from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from sqlmodel import Session
from uuid import UUID
from ai.tools.task_tools import (
    AddTaskTool,
    UpdateTaskTool,
    ListTasksTool,
    DeleteTaskTool
)
from core.config import settings
import logging


class TodoAgent:
    def __init__(self, session: Session, user_id: UUID):
        self.session = session
        self.user_id = user_id

        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_API_BASE,
            model=settings.OPENAI_MODEL,
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=0
        )

        self.tools = {
            "add_task": AddTaskTool(session=session, user_id=user_id),
            "update_task": UpdateTaskTool(session=session, user_id=user_id),
            "list_tasks": ListTasksTool(session=session, user_id=user_id),
            "delete_task": DeleteTaskTool(session=session, user_id=user_id)
        }

        self.system_prompt = """You are a professional task management assistant.
You help users manage their todo list by creating, updating, listing, and deleting tasks.

For greetings or casual questions, respond conversationally.
For task-related requests, respond clearly and helpfully.
"""

    async def run(self, input_text: str, chat_history: list | None = None) -> str:
        """
        Executes the AI agent and returns assistant reply as STRING
        """

        messages = [SystemMessage(content=self.system_prompt)]

        if chat_history:
            for msg in chat_history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=input_text))

        try:
            response = await self.llm.ainvoke(messages)
            return response.content

        except Exception as e:
            logging.error("Agent execution failed")
            logging.exception(e)
            return "Sorry, I couldn't process your request right now."
