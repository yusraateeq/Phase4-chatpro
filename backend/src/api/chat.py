# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlmodel import Session, select
# from pydantic import BaseModel
# from typing import List, Annotated, Optional
# from uuid import UUID

# from core.database import get_session
# from api.dependencies import get_current_user
# from models.user import User
# from models.chat import Conversation, Message, MessageRole
# from ai.agent import TodoAgent

# router = APIRouter()

# class ChatRequest(BaseModel):
#     message: str
#     conversation_id: Optional[UUID] = None

# class ChatResponse(BaseModel):
#     message: str
#     conversation_id: UUID

# @router.post("", response_model=ChatResponse)
# async def chat(
#     request: ChatRequest,
#     current_user: Annotated[User, Depends(get_current_user)],
#     session: Annotated[Session, Depends(get_session)]
# ):
#     # 1. Get or create conversation
#     if request.conversation_id:
#         conversation = session.get(Conversation, request.conversation_id)
#         if not conversation or conversation.user_id != current_user.id:
#             raise HTTPException(status_code=404, detail="Conversation not found")
#     else:
#         conversation = Conversation(user_id=current_user.id)
#         session.add(conversation)
#         session.commit()
#         session.refresh(conversation)

#     # 2. Store user message
#     user_msg = Message(
#         conversation_id=conversation.id,
#         role=MessageRole.USER,
#         content=request.message
#     )
#     session.add(user_msg)
    
#     # 3. Load chat history for agent
#     history_stmt = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.timestamp)
#     history_msgs = session.exec(history_stmt).all()
    
#     # Format history for LangChain (simplistic version)
#     # Note: In a real app, you might want to limit this or use LangChain's memory classes
#     chat_history = []
#     # Skip the last message (the one we just added) to avoid redundancy if the agent doesn't expect it
#     for m in history_msgs[:-1]:
#         chat_history.append({"role": m.role.value, "content": m.content})

#     # 4. Run Agent
#     try:
#         agent = TodoAgent(session=session, user_id=current_user.id)
#         bot_response = await agent.run(request.message, chat_history)
#     except Exception as e:
#         import logging
#         logging.error(f"Error in chat agent: {str(e)}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"Agent initialization/execution error: {str(e)}"
#         )

#     # 5. Store bot message
#     bot_msg = Message(
#         conversation_id=conversation.id,
#         role=MessageRole.ASSISTANT,
#         content=bot_response
#     )
#     session.add(bot_msg)
#     session.commit()

#     return ChatResponse(message=bot_response, conversation_id=conversation.id)

# @router.get("/conversations", response_model=List[Conversation])
# async def get_conversations(
#     current_user: Annotated[User, Depends(get_current_user)],
#     session: Annotated[Session, Depends(get_session)]
# ):
#     stmt = select(Conversation).where(Conversation.user_id == current_user.id).order_by(Conversation.created_at.desc())
#     return session.exec(stmt).all()

# @router.get("/conversations/{conv_id}/messages", response_model=List[Message])
# async def get_messages(
#     conv_id: UUID,
#     current_user: Annotated[User, Depends(get_current_user)],
#     session: Annotated[Session, Depends(get_session)]
# ):
#     conv = session.get(Conversation, conv_id)
#     if not conv or conv.user_id != current_user.id:
#         raise HTTPException(status_code=404, detail="Conversation not found")
    
#     stmt = select(Message).where(Message.conversation_id == conv_id).order_by(Message.timestamp)
#     return session.exec(stmt).all()










from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Annotated, Optional
from uuid import UUID
import logging

from core.database import get_session
from api.dependencies import get_current_user
from models.user import User
from models.chat import Conversation, Message, MessageRole
# from ai.agent import TodoAgent (Removed in favor of SmartAgent)

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    message: str
    conversation_id: UUID


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    try:
        # 1. Conversation
        if request.conversation_id:
            conversation = session.get(Conversation, request.conversation_id)
            if not conversation or conversation.user_id != current_user.id:
                raise HTTPException(status_code=404, detail="Conversation not found")
        else:
            conversation = Conversation(user_id=current_user.id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # 2. Save user message
        user_msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.USER,
            content=request.message
        )
        session.add(user_msg)
        session.commit()

        # 3. Load history
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.timestamp)
        )
        messages = session.exec(stmt).all()

        chat_history = [
            {"role": m.role.value, "content": m.content}
            for m in messages[:-1]
        ]

        # 4. Run Agent (SmartAgent)
        try:
            from ai.smart_agent import SmartAgent
            agent = SmartAgent(session=session, user_id=current_user.id)
            bot_response = await agent.run(request.message, chat_history)
        except Exception as agent_error:
            logger.error(f"SmartAgent error: {str(agent_error)}", exc_info=True)
            # Fallback response if agent fails
            bot_response = f"I encountered an error: {str(agent_error)[:100]}. Please try again."

        # 5. Save assistant reply
        bot_msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.ASSISTANT,
            content=bot_response
        )
        session.add(bot_msg)
        session.commit()

        return ChatResponse(
            message=bot_response,
            conversation_id=conversation.id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/conversations", response_model=List[Conversation])
async def get_conversations(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    stmt = (
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
    )
    return session.exec(stmt).all()


@router.get("/conversations/{conv_id}/messages", response_model=List[Message])
async def get_messages(
    conv_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    conv = session.get(Conversation, conv_id)
    if not conv or conv.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")

    stmt = (
        select(Message)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.timestamp)
    )
    return session.exec(stmt).all()
