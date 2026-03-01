from pydantic import BaseModel
from typing import Optional

class UserListResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    is_admin: bool
    created_at: str
    
    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_tunnels: int
    online_tunnels: int
    total_codes: int
    used_codes: int

class SystemConfigUpdate(BaseModel):
    key: str
    value: str
