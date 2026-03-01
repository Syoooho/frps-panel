from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.services.admin_service import AdminService
from app.schemas.admin import UserListResponse, StatsResponse
from typing import List

router = APIRouter(dependencies=[Depends(get_current_admin)])

@router.get("/users", response_model=List[UserListResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return AdminService.get_all_users(db, skip, limit)

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return AdminService.delete_user(db, user_id)

@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    return AdminService.get_stats(db)
