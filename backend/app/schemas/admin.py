from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import datetime

class UserListResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    @field_serializer('created_at')
    def serialize_created_at(self, dt: datetime, _info):
        return dt.isoformat() if dt else None
    
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
