from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SubscriptionBase(BaseModel):
    plan_type: str
    max_tunnels: int

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    start_date: datetime
    end_date: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class ActivationCodeCreate(BaseModel):
    plan_type: str
    count: int = 1

class ActivationCodeResponse(BaseModel):
    id: int
    code: str
    plan_type: str
    is_used: bool
    used_by: Optional[int] = None
    used_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class RedeemCodeRequest(BaseModel):
    code: str
