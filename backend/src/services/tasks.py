"""
Tasks service layer.
Handles task CRUD operations with user isolation.
"""
from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import List
from uuid import UUID

from models.task import Task, Priority, RecurringInterval
from models.user import User
from datetime import datetime, timezone, timedelta


class TasksService:
    """Service class for task operations."""

    @staticmethod
    def get_user_tasks(session: Session, user_id: UUID) -> List[Task]:
        """
        Get all tasks for a specific user, ordered by creation date (newest first).

        Args:
            session: Database session
            user_id: User's UUID

        Returns:
            List of tasks belonging to the user
        """
        statement = (
            select(Task)
            .where(Task.user_id == user_id)
            .order_by(Task.created_at.desc())
        )
        tasks = session.exec(statement).all()
        return list(tasks)

    @staticmethod
    def get_task_by_id(session: Session, task_id: UUID, user_id: UUID) -> Task:
        """
        Get a specific task by ID, verifying ownership.

        Args:
            session: Database session
            task_id: Task's UUID
            user_id: User's UUID for ownership verification

        Returns:
            Task object

        Raises:
            HTTPException: 404 if task not found or doesn't belong to user
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return task

    @staticmethod
    def create_task(
        session: Session,
        user_id: UUID,
        title: str,
        description: str | None = None,
        priority: Priority = Priority.MEDIUM,
        tags: str | None = None,
        due_date: datetime | None = None,
        is_recurring: bool = False,
        recurring_interval: RecurringInterval | None = None
    ) -> Task:
        """
        Create a new task for a user.

        Args:
            session: Database session
            user_id: User's UUID
            title: Task title
            description: Optional task description

        Returns:
            Created task object

        Raises:
            HTTPException: 400 if validation fails
        """
        if not title or not title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty"
            )

        if len(title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be 200 characters or less"
            )

        if description and len(description) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be 2000 characters or less"
            )

        next_due_date = None
        if is_recurring and due_date:
            next_due_date = due_date

        task = Task(
            user_id=user_id,
            title=title.strip(),
            description=description.strip() if description else None,
            priority=priority,
            tags=tags,
            due_date=due_date,
            is_recurring=is_recurring,
            recurring_interval=recurring_interval,
            next_due_date=next_due_date,
            is_completed=False,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def update_task(
        session: Session,
        task_id: UUID,
        user_id: UUID,
        title: str | None = None,
        description: str | None = None,
        is_completed: bool | None = None,
        priority: Priority | None = None,
        tags: str | None = None,
        due_date: datetime | None = None,
        is_recurring: bool | None = None,
        recurring_interval: RecurringInterval | None = None
    ) -> Task:
        """
        Update an existing task.

        Args:
            session: Database session
            task_id: Task's UUID
            user_id: User's UUID for ownership verification
            title: Optional new title
            description: Optional new description
            is_completed: Optional new completion status

        Returns:
            Updated task object

        Raises:
            HTTPException: 404 if task not found, 400 if validation fails
        """
        task = TasksService.get_task_by_id(session, task_id, user_id)

        # Validate and update fields
        if title is not None:
            if not title.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title cannot be empty"
                )
            if len(title) > 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title must be 200 characters or less"
                )
            task.title = title.strip()

        if description is not None:
            if len(description) > 2000:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Description must be 2000 characters or less"
                )
            task.description = description.strip() if description else None

        if is_completed is not None:
            # Handle recurring tasks on completion
            if is_completed and not task.is_completed and task.is_recurring and task.next_due_date:
                # Calculate next due date
                if task.recurring_interval == RecurringInterval.DAILY:
                    task.next_due_date += timedelta(days=1)
                elif task.recurring_interval == RecurringInterval.WEEKLY:
                    task.next_due_date += timedelta(weeks=1)
                elif task.recurring_interval == RecurringInterval.MONTHLY:
                    # Approximation for monthly
                    task.next_due_date += timedelta(days=30)
                
                # Keep is_completed as False because it's rescheduled
                task.is_completed = False
            else:
                task.is_completed = is_completed

        if priority is not None:
            task.priority = priority
        
        if tags is not None:
            task.tags = tags
            
        if due_date is not None:
            task.due_date = due_date
            if task.is_recurring:
                task.next_due_date = due_date

        if is_recurring is not None:
            task.is_recurring = is_recurring
            if is_recurring and task.due_date:
                task.next_due_date = task.due_date
        
        if recurring_interval is not None:
            task.recurring_interval = recurring_interval

        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def toggle_task_completion(session: Session, task_id: UUID, user_id: UUID) -> Task:
        """
        Toggle a task's completion status.

        Args:
            session: Database session
            task_id: Task's UUID
            user_id: User's UUID for ownership verification

        Returns:
            Updated task object

        Raises:
            HTTPException: 404 if task not found
        """
        task = TasksService.get_task_by_id(session, task_id, user_id)

        task.is_completed = not task.is_completed
        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def delete_task(session: Session, task_id: UUID, user_id: UUID) -> None:
        """
        Delete a task.

        Args:
            session: Database session
            task_id: Task's UUID
            user_id: User's UUID for ownership verification

        Raises:
            HTTPException: 404 if task not found
        """
        task = TasksService.get_task_by_id(session, task_id, user_id)

        session.delete(task)
        session.commit()
