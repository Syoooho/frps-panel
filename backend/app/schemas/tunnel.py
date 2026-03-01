from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TunnelBase(BaseModel):
    name: str
    type: str
    local_ip: str
    local_port: int
    remote_port: Optional[int] = None
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None

class TunnelCreate(TunnelBase):
    pass

class TunnelUpdate(BaseModel):
    name: Optional[str] = None
    local_ip: Optional[str] = None
    local_port: Optional[int] = None
    remote_port: Optional[int] = None
    custom_domain: Optional[str] = None
    subdomain: Optional[str] = None

class TunnelResponse(TunnelBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
