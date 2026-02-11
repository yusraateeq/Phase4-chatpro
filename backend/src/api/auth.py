"""
Authentication API endpoints.
Handles user registration, login, and logout.
"""
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from pydantic import BaseModel, EmailStr, Field
class UserProfile(BaseModel):
    """Response model for user profile."""
    id: str
    email: EmailStr
    is_active: bool
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "is_active": True,
                "full_name": "John Doe",
                "profile_picture": "https://example.com/photo.jpg"
            }
        }
    }


class UpdateProfileRequest(BaseModel):
    """Request model for updating user profile."""
    email: Optional[EmailStr] = Field(None, description="New email address")
    full_name: Optional[str] = Field(None, description="New full name")
    profile_picture: Optional[str] = Field(None, description="New profile picture URL")


from typing import Annotated, Optional

from core.database import get_session
from services.auth import AuthService
from api.dependencies import get_current_user
from models.user import User


router = APIRouter()


# Request/Response Models
class RegisterRequest(BaseModel):
    """Request model for user registration."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=100, description="User's password (min 8 characters)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }
    }


class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }
    }


class AuthResponse(BaseModel):
    """Response model for authentication endpoints."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: dict = Field(..., description="User information")

    model_config = {
        "json_schema_extra": {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "is_active": True
                }
            }
        }
    }


class LogoutResponse(BaseModel):
    """Response model for logout endpoint."""
    message: str = Field(..., description="Logout confirmation message")


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email and password. Returns user data and JWT token."
)
async def register(
    request: RegisterRequest,
    session: Annotated[Session, Depends(get_session)]
) -> AuthResponse:
    """
    Register a new user account.

    - **email**: Valid email address (must be unique)
    - **password**: Minimum 8 characters

    Returns JWT access token and user information.
    """
    user, access_token = AuthService.register_user(
        session=session,
        email=request.email,
        password=request.password
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": str(user.id),
            "email": user.email,
            "is_active": user.is_active
        }
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login user",
    description="Authenticate user with email and password. Returns JWT token on success."
)
async def login(
    request: LoginRequest,
    session: Annotated[Session, Depends(get_session)]
) -> AuthResponse:
    """
    Authenticate user and generate access token.

    - **email**: Registered email address
    - **password**: User's password

    Returns JWT access token and user information.
    """
    user, access_token = AuthService.login_user(
        session=session,
        email=request.email,
        password=request.password
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": str(user.id),
            "email": user.email,
            "is_active": user.is_active
        }
    )


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Logout user",
    description="Logout the authenticated user. Client should delete the stored JWT token."
)
async def logout(
    current_user: Annotated[User, Depends(get_current_user)]
) -> LogoutResponse:
    """
    Logout the authenticated user.

    Requires valid JWT token in Authorization header.
    Client should delete the stored token after receiving this response.
    """
    result = AuthService.logout_user()
    return LogoutResponse(**result)


@router.get(
    "/me",
    response_model=UserProfile,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns the profile information of the currently authenticated user."
)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)]
) -> UserProfile:
    """Get current user profile."""
    return UserProfile(
        id=str(current_user.id),
        email=current_user.email,
        is_active=current_user.is_active,
        full_name=current_user.full_name,
        profile_picture=current_user.profile_picture
    )


@router.patch(
    "/me",
    response_model=UserProfile,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
    description="Updates the profile information of the currently authenticated user."
)
async def update_me(
    request: UpdateProfileRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
) -> UserProfile:
    """Update current user profile."""
    if request.email:
        current_user.email = request.email
    if request.full_name is not None:
        current_user.full_name = request.full_name
    if request.profile_picture is not None:
        current_user.profile_picture = request.profile_picture
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return UserProfile(
        id=str(current_user.id),
        email=current_user.email,
        is_active=current_user.is_active,
        full_name=current_user.full_name,
        profile_picture=current_user.profile_picture
    )
