from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription import SubscriptionResponse

router = APIRouter()

@router.get("/me", response_model=SubscriptionResponse)
async def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    if not subscription:
        return None
    return subscription
