from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
import enum

if TYPE_CHECKING:
    from .user import User


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )

    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationship: Many conversations belong to one user
    owner: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": "Message.timestamp"}
    )


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )

    conversation_id: UUID = Field(
        foreign_key="conversations.id",
        index=True,
        nullable=False
    )

    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationship: Many messages belong to one conversation
    conversation: Conversation = Relationship(back_populates="messages")
