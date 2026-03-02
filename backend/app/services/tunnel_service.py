from sqlalchemy.orm import Session
from app.models.tunnel import Tunnel
from app.models.subscription import Subscription
from app.schemas.tunnel import TunnelCreate, TunnelUpdate
from fastapi import HTTPException, status
from datetime import datetime

class TunnelService:
    @staticmethod
    def _check_port_conflict(db: Session, tunnel_type: str, remote_port: int, exclude_tunnel_id: int = None):
        """检查端口是否冲突"""
        query = db.query(Tunnel).filter(
            Tunnel.type.in_(['tcp', 'udp']),
            Tunnel.remote_port == remote_port
        )
        if exclude_tunnel_id:
            query = query.filter(Tunnel.id != exclude_tunnel_id)
        
        existing = query.first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"端口 {remote_port} 已被使用"
            )
    
    @staticmethod
    def _allocate_port(db: Session):
        """自动分配可用端口"""
        used_ports = set()
        existing_tunnels = db.query(Tunnel).filter(
            Tunnel.type.in_(['tcp', 'udp']),
            Tunnel.remote_port.isnot(None)
        ).all()
        for t in existing_tunnels:
            used_ports.add(t.remote_port)
        
        for port in range(10000, 65535):
            if port not in used_ports:
                return port
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="无可用端口"
        )
    
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
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"已达到隧道数量上限（{tunnel_count}/{subscription.max_tunnels}）"
            )
        
        # 为 TCP/UDP 类型处理远程端口
        remote_port = tunnel_data.remote_port
        if tunnel_data.type in ['tcp', 'udp']:
            if remote_port:
                # 检查端口是否冲突
                TunnelService._check_port_conflict(db, tunnel_data.type, remote_port)
            else:
                # 自动分配端口
                remote_port = TunnelService._allocate_port(db)
        
        tunnel = Tunnel(
            user_id=user_id,
            name=tunnel_data.name,
            type=tunnel_data.type,
            local_ip=tunnel_data.local_ip,
            local_port=tunnel_data.local_port,
            remote_port=remote_port,
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
        
        # 如果更新了远程端口，检查冲突
        if 'remote_port' in update_data and update_data['remote_port']:
            if tunnel.type in ['tcp', 'udp']:
                TunnelService._check_port_conflict(
                    db, 
                    tunnel.type, 
                    update_data['remote_port'],
                    exclude_tunnel_id=tunnel_id
                )
        
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
