from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, get_current_admin
from app.models.user import User
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription import (
    RedeemCodeRequest,
    ActivationCodeCreate,
    ActivationCodeResponse,
    ActivationCodeListResponse
)
from typing import List

router = APIRouter()

@router.post("/activate")
def activate_code(
    request: RedeemCodeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return SubscriptionService.activate_code(db, current_user.id, request.code)

@router.post("/generate", dependencies=[Depends(get_current_admin)])
def generate_codes(
    request: ActivationCodeCreate,
    db: Session = Depends(get_db)
):
    codes = SubscriptionService.generate_codes(db, request.plan_type, request.count)
    return {"codes": codes}

@router.get("/codes", response_model=ActivationCodeListResponse, dependencies=[Depends(get_current_admin)])
def list_codes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return SubscriptionService.get_all_codes(db, skip, limit)

@router.delete("/codes/{code_id}", dependencies=[Depends(get_current_admin)])
def delete_code(
    code_id: int,
    db: Session = Depends(get_db)
):
    return SubscriptionService.delete_code(db, code_id)
