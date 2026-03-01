from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_type = Column(String(20), nullable=False)
    port_quota = Column(Integer, nullable=False)
    used_ports = Column(Integer, default=0)
    start_date = Column(DateTime, nullable=False)
    expire_date = Column(DateTime, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="active", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
