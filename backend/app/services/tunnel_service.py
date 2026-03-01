from sqlalchemy.orm import Session
from app.models.tunnel import Tunnel
from app.models.subscription import Subscription
from app.schemas.tunnel import TunnelCreate, TunnelUpdate
from fastapi import HTTPException, status
from datetime import datetime

class TunnelService:
    @staticmethod
    def get_user_tunnels(db: Session, user_id: int):
        return db.query(Tunnel).filter(Tunnel.user_id == user_id).all()
    
    @staticmethod
    def get_tunnel(db: Session, tunnel_id: int, user_id: int):
        tunnel = db.query(Tunnel).filter(
            Tunnel.id == tunnel_id,
            Tunnel.user_id == user_id
        ).first()
        if not tunnel:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="隧道不存在")
        return tunnel
    
    @staticmethod
    def create_tunnel(db: Session, tunnel_data: TunnelCreate, user_id: int):
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.is_active == True
        ).first()
        
        if not subscription:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="请先激活订阅")
        
        tunnel_count = db.query(Tunnel).filter(Tunnel.user_id == user_id).count()
        if tunnel_count >= subscription.max_tunnels:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="已达到隧道数量上限")
        
        tunnel = Tunnel(
            user_id=user_id,
            name=tunnel_data.name,
            type=tunnel_data.type,
            local_ip=tunnel_data.local_ip,
            local_port=tunnel_data.local_port,
            remote_port=tunnel_data.remote_port,
            custom_domain=tunnel_data.custom_domain,
            subdomain=tunnel_data.subdomain,
            status="inactive"
        )
        db.add(tunnel)
        db.commit()
        db.refresh(tunnel)
        return tunnel
    
    @staticmethod
    def update_tunnel(db: Session, tunnel_id: int, user_id: int, tunnel_data: TunnelUpdate):
        tunnel = TunnelService.get_tunnel(db, tunnel_id, user_id)
        
        update_data = tunnel_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tunnel, key, value)
        
        db.commit()
        db.refresh(tunnel)
        return tunnel
    
    @staticmethod
    def delete_tunnel(db: Session, tunnel_id: int, user_id: int):
        tunnel = TunnelService.get_tunnel(db, tunnel_id, user_id)
        db.delete(tunnel)
        db.commit()
        return {"message": "隧道已删除"}
