from pydantic import BaseModel

class SystemConfig(BaseModel):
    frp_server_addr: str
    frp_server_port: int

class SystemConfigUpdate(BaseModel):
    frp_server_addr: str
    frp_server_port: int
