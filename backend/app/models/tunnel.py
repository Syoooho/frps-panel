from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.core.database import Base

class Tunnel(Base):
    __tablename__ = "tunnels"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)
    local_ip = Column(String(50), default="127.0.0.1")
    local_port = Column(Integer, nullable=False)
    remote_port = Column(Integer, nullable=True, index=True)
    custom_domain = Column(String(255), nullable=True, index=True)
    subdomain = Column(String(100), nullable=True)
    custom_http_port = Column(Integer, nullable=True)
    custom_https_port = Column(Integer, nullable=True)
    use_encryption = Column(Boolean, default=False)
    use_compression = Column(Boolean, default=False)
    status = Column(String(20), default="inactive", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, nullable=True)
