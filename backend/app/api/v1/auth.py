from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, RegisterRequest, LoginResponse
from app.schemas.user import UserResponse
from app.services.auth_service import authenticate_user, create_user, create_tokens
from app.services.security import SecurityService
from app.models.user import User
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=LoginResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"注册失败: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, req: Request, db: Session = Depends(get_db)):
    # 获取客户端信息
    ip_address = req.client.host if req.client else "unknown"
    user_agent = req.headers.get("user-agent", "")
    
    # 检查登录尝试次数
    is_locked, locked_until = SecurityService.check_login_attempts(db, request.email, ip_address)
    if is_locked:
        SecurityService.record_login_attempt(
            db, request.email, ip_address, False, 
            user_agent=user_agent, failure_reason="账号已锁定"
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"登录失败次数过多，账号已锁定至 {locked_until.strftime('%Y-%m-%d %H:%M:%S')}"
        )
    
    # 验证用户
    try:
        user = authenticate_user(db, request.email, request.password)
    except HTTPException as e:
        # 记录登录失败
        SecurityService.record_login_attempt(
            db, request.email, ip_address, False,
            user_agent=user_agent, failure_reason=str(e.detail)
        )
        raise
    
    # 登录成功
    if not user.frp_token:
        user.generate_frp_token()
    user.last_login = datetime.utcnow()
    db.commit()
    
    # 记录登录成功
    SecurityService.record_login_attempt(
        db, request.email, ip_address, True,
        user_id=user.id, user_agent=user_agent
    )
    
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
