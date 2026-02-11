import asyncio
import sys
from typing import Any, List, Optional
from uuid import UUID

from mcp.server.fastmcp import FastMCP
from sqlmodel import Session, create_engine, select

# Adjust path to import from parallel directories
sys.path.insert(0, 'src')

from core.config import settings
from models.task import Task, Priority
from models.user import User
from models.chat import Conversation, Message

# Initialize FastMCP Server
mcp = FastMCP("TodoPro MCP Server")

# Database connection
engine = create_engine(settings.DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

@mcp.tool()
def list_tasks(user_id: str, limit: int = 10, status: str = "all") -> List[dict]:
    """
    List tasks for a specific user.
    
    Args:
        user_id: The UUID of the user.
        limit: Max number of tasks to return (default 10).
        status: Filter by status ('completed', 'pending', 'all').
    """
    with Session(engine) as session:
        stmt = select(Task).where(Task.user_id == UUID(user_id))
        
        if status == "completed":
            stmt = stmt.where(Task.is_completed == True)
        elif status == "pending":
            stmt = stmt.where(Task.is_completed == False)
            
        stmt = stmt.order_by(Task.created_at.desc()).limit(limit)
        tasks = session.exec(stmt).all()
        
        return [task.model_dump() for task in tasks]

@mcp.tool()
def add_task(user_id: str, title: str, description: Optional[str] = None, priority: str = "medium") -> dict:
    """
    Create a new task.
    
    Args:
        user_id: The UUID of the user.
        title: Title of the task.
        description: Optional details.
        priority: 'low', 'medium', or 'high'.
    """
    with Session(engine) as session:
        # Validate priority
        try:
            prio_enum = Priority(priority.lower())
        except ValueError:
            prio_enum = Priority.MEDIUM

        # Ensure user exists (for testing/agent safety)
        user = session.get(User, UUID(user_id))
        if not user:
            print(f"DEBUG: Creating missing user {user_id}")
            user = User(id=UUID(user_id), email=f"agent_user_{user_id[:8]}@example.com", hashed_password="mock_password")
            session.add(user)
            session.commit()
            session.refresh(user)

        task = Task(
            user_id=UUID(user_id),
            title=title,
            description=description,
            priority=prio_enum
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return task.model_dump()

@mcp.tool()
def update_task_status(task_id: str, is_completed: bool) -> str:
    """
    Mark a task as completed or pending.
    
    Args:
        task_id: The UUID or Title of the task.
        is_completed: True for completed, False for pending.
    """
    print(f"DEBUG: Updating task {task_id} status to {is_completed}")
    with Session(engine) as session:
        try:
            # Try UUID first
            try:
                task_uuid = UUID(task_id)
                task = session.get(Task, task_uuid)
            except (ValueError, AttributeError):
                # Fallback to Title search
                stmt = select(Task).where(Task.title.ilike(task_id)).order_by(Task.created_at.desc())
                task = session.exec(stmt).first()

            if not task:
                print(f"DEBUG: Task {task_id} not found")
                return f"Task '{task_id}' not found"
            
            task.is_completed = is_completed
            session.add(task)
            session.commit()
            print(f"DEBUG: Task {task.id} updated successfully")
            return f"Task '{task.title}' marked as {'completed' if is_completed else 'pending'}"
        except Exception as e:
            print(f"DEBUG: Error updating task {task_id}: {e}")
            return f"Error: {str(e)}"

@mcp.tool()
def update_task(
    task_id: str, 
    title: Optional[str] = None, 
    description: Optional[str] = None, 
    priority: Optional[str] = None,
    is_completed: Optional[bool] = None
) -> str:
    """
    Update an existing task's details.
    
    Args:
        task_id: The UUID or Title of the task.
        title: New title (optional).
        description: New description (optional).
        priority: 'low', 'medium', or 'high' (optional).
        is_completed: Boolean status (optional).
    """
    with Session(engine) as session:
        # Try UUID first
        try:
            task_uuid = UUID(task_id)
            task = session.get(Task, task_uuid)
        except (ValueError, AttributeError):
            # Fallback to Title search
            stmt = select(Task).where(Task.title.ilike(task_id)).order_by(Task.created_at.desc())
            task = session.exec(stmt).first()

        if not task:
            return f"Task '{task_id}' not found"
        
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if priority is not None:
            try:
                task.priority = Priority(priority.lower())
            except ValueError:
                pass
        if is_completed is not None:
            task.is_completed = is_completed
            
        session.add(task)
        session.commit()
        return f"Task '{task.title}' updated successfully"

@mcp.tool()
def delete_task(task_id: str) -> str:
    """
    Delete a task by ID or Title.
    
    Args:
        task_id: The UUID or Title of the task.
    """
    with Session(engine) as session:
        # Try UUID first
        try:
            task_uuid = UUID(task_id)
            task = session.get(Task, task_uuid)
        except (ValueError, AttributeError):
            # Fallback to Title search
            stmt = select(Task).where(Task.title.ilike(task_id)).order_by(Task.created_at.desc())
            task = session.exec(stmt).first()

        if not task:
            return f"Task '{task_id}' not found"
        
        title = task.title
        session.delete(task)
        session.commit()
        return f"Task '{title}' deleted successfully"

@mcp.tool()
def delete_all_tasks(user_id: str) -> str:
    """
    Delete all tasks for a specific user.
    
    Args:
        user_id: The UUID of the user.
    """
    with Session(engine) as session:
        stmt = select(Task).where(Task.user_id == UUID(user_id))
        tasks = session.exec(stmt).all()
        count = len(tasks)
        for task in tasks:
            session.delete(task)
        session.commit()
        return f"Successfully deleted all {count} tasks."

@mcp.tool()
def search_tasks(user_id: str, query: str) -> List[dict]:
    """
    Search for tasks by title or description (case-insensitive).
    
    Args:
        user_id: The UUID of the user.
        query: The search text.
    """
    with Session(engine) as session:
        search_query = f"%{query}%"
        stmt = select(Task).where(Task.user_id == UUID(user_id))
        stmt = stmt.where(Task.title.ilike(search_query) | Task.description.ilike(search_query))
        tasks = session.exec(stmt).all()
        return [task.model_dump() for task in tasks]

if __name__ == "__main__":
    # Run the MCP server
    mcp.run()
