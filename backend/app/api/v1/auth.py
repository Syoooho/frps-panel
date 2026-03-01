from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, LoginResponse
from app.schemas.user import UserResponse
from app.services.auth_service import authenticate_user, create_user, create_tokens
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=LoginResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user = create_user(db, request.email, request.password)
    if not user.frp_token:
        user.generate_frp_token()
        db.commit()
    tokens = create_tokens(user.id)
    return {
        **tokens,
        "user": {
            "id": user.id,
            "email": user.email,
            "frp_token": user.frp_token,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat()
        }
    }

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user.frp_token:
        user.generate_frp_token()
    user.last_login = datetime.utcnow()
    db.commit()
    tokens = create_tokens(user.id)
    return {
        **tokens,
        "user": {
            "id": user.id,
            "email": user.email,
            "frp_token": user.frp_token,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat()
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"success": True, "message": "登出成功"}
