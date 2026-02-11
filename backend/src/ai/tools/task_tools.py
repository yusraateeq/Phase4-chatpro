from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select, or_, and_
from models.user import User
from models.task import Task, Priority, RecurringInterval
from uuid import UUID
from datetime import datetime
import enum


class AddTaskInput(BaseModel):
    title: str = Field(description="The title of the task")
    description: Optional[str] = Field(description="The description of the task")
    due_date: Optional[str] = Field(description="Due date in ISO format (YYYY-MM-DDTHH:MM:SSTZ)")
    priority: Optional[Priority] = Field(default=Priority.MEDIUM, description="Task priority: 'low', 'medium', 'high'")
    tags: Optional[str] = Field(description="Comma-separated tags for the task")
    is_recurring: Optional[bool] = Field(default=False, description="Whether the task is recurring")
    recurring_interval: Optional[RecurringInterval] = Field(description="Recurring interval: 'daily', 'weekly', 'monthly'")


class AddTaskTool(BaseTool):
    name: str = "add_task"
    description: str = "Add a new task with optional priority, tags, due date, and recurring settings."
    args_schema: type[BaseModel] = AddTaskInput
    session: Any = Field(exclude=True)
    user_id: UUID = Field(exclude=True)

    def _run(self, title: str, description: Optional[str] = None, due_date: Optional[str] = None,
             priority: Priority = Priority.MEDIUM, tags: Optional[str] = None,
             is_recurring: bool = False, recurring_interval: Optional[RecurringInterval] = None) -> str:
        try:
            parsed_due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00")) if due_date else None
            
            new_task = Task(
                title=title,
                description=description,
                user_id=self.user_id,
                priority=priority,
                tags=tags,
                due_date=parsed_due_date,
                is_recurring=is_recurring,
                recurring_interval=recurring_interval,
                next_due_date=parsed_due_date if is_recurring and parsed_due_date else None
            )
            
            self.session.add(new_task)
            self.session.commit()
            self.session.refresh(new_task)
            
            return f"Task '{title}' (ID: {new_task.id}) added successfully."
        except Exception as e:
            return f"Error adding task: {str(e)}"


class UpdateTaskInput(BaseModel):
    task_id: str = Field(description="The UUID of the task to update")
    title: Optional[str] = Field(description="New title")
    description: Optional[str] = Field(description="New description")
    due_date: Optional[str] = Field(description="New due date in ISO format")
    is_completed: Optional[bool] = Field(description="Completion status")
    priority: Optional[Priority] = Field(description="New priority")
    tags: Optional[str] = Field(description="New tags")


class UpdateTaskTool(BaseTool):
    name: str = "update_task"
    description: str = "Update any field of an existing task."
    args_schema: type[BaseModel] = UpdateTaskInput
    session: Any = Field(exclude=True)
    user_id: UUID = Field(exclude=True)

    def _run(self, task_id: str, **kwargs) -> str:
        try:
            uuid_id = UUID(task_id)
            task = self.session.exec(select(Task).where(Task.id == uuid_id, Task.user_id == self.user_id)).first()
            if not task:
                return f"Task {task_id} not found."
            
            for key, value in kwargs.items():
                if value is not None:
                    if key == "due_date":
                        value = datetime.fromisoformat(value.replace("Z", "+00:00"))
                    setattr(task, key, value)
            
            self.session.add(task)
            self.session.commit()
            return f"Task '{task.title}' updated."
        except Exception as e:
            return f"Error: {str(e)}"


class ListTasksInput(BaseModel):
    status: Optional[str] = Field(description="Filter by status: 'all', 'pending', 'completed'")
    priority: Optional[Priority] = Field(description="Filter by priority")
    search: Optional[str] = Field(description="Keyword to search in title/description/tags")
    sort_by: Optional[str] = Field(default="created_at", description="Sort by: 'due_date', 'priority', 'created_at', 'title'")
    order: Optional[str] = Field(default="desc", description="Sort order: 'asc', 'desc'")


class ListTasksTool(BaseTool):
    name: str = "list_tasks"
    description: str = "List, search, filter, and sort tasks."
    args_schema: type[BaseModel] = ListTasksInput
    session: Any = Field(exclude=True)
    user_id: UUID = Field(exclude=True)

    def _run(self, status: str = "all", priority: Optional[Priority] = None,
             search: Optional[str] = None, sort_by: str = "created_at", order: str = "desc") -> str:
        try:
            stmt = select(Task).where(Task.user_id == self.user_id)
            
            if status == "pending": stmt = stmt.where(Task.is_completed == False)
            elif status == "completed": stmt = stmt.where(Task.is_completed == True)
            
            if priority: stmt = stmt.where(Task.priority == priority)
            
            if search:
                s = f"%{search}%"
                stmt = stmt.where(or_(Task.title.ilike(s), Task.description.ilike(s), Task.tags.ilike(s)))
            
            # Sorting logic
            attr = getattr(Task, sort_by if hasattr(Task, sort_by) else "created_at")
            stmt = stmt.order_by(attr.desc() if order == "desc" else attr.asc())
            
            tasks = self.session.exec(stmt).all()
            if not tasks: return "No tasks found."
            
            res = []
            for t in tasks:
                s = "✅" if t.is_completed else "⭕"
                p = f"[{t.priority.upper()}]"
                d = f" (due: {t.due_date.date()})" if t.due_date else ""
                tg = f" #{t.tags}" if t.tags else ""
                res.append(f"{s} {p} {t.title}{d}{tg} (ID: {t.id})")
            
            return "\n".join(res)
        except Exception as e:
            return f"Error: {str(e)}"


class DeleteTaskTool(BaseTool):
    name: str = "delete_task"
    description: str = "Delete a task. Ask for confirmation before calling this tool if the user hasn't explicitly confirmed."
    args_schema: type[BaseModel] = UpdateTaskInput # Reusing Schema for task_id
    session: Any = Field(exclude=True)
    user_id: UUID = Field(exclude=True)

    def _run(self, task_id: str) -> str:
        try:
            uuid_id = UUID(task_id)
            task = self.session.exec(select(Task).where(Task.id == uuid_id, Task.user_id == self.user_id)).first()
            if not task: return f"Task {task_id} not found."
            self.session.delete(task)
            self.session.commit()
            return f"Task '{task.title}' deleted."
        except Exception as e:
            return f"Error: {str(e)}"