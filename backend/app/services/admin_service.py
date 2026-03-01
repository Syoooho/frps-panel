from sqlalchemy.orm import Session
from app.models.user import User
from app.models.tunnel import Tunnel
from app.models.activation_code import ActivationCode
from app.models.subscription import Subscription
from fastapi import HTTPException, status

class AdminService:
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
        
        if user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="不能删除管理员账户")
        
        db.query(Tunnel).filter(Tunnel.user_id == user_id).delete()
        db.query(Subscription).filter(Subscription.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        return {"message": "用户已删除"}
    
    @staticmethod
    def get_stats(db: Session):
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        total_tunnels = db.query(Tunnel).count()
        online_tunnels = db.query(Tunnel).filter(Tunnel.status == "active").count()
        total_codes = db.query(ActivationCode).count()
        used_codes = db.query(ActivationCode).filter(ActivationCode.is_used == True).count()
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_tunnels": total_tunnels,
            "online_tunnels": online_tunnels,
            "total_codes": total_codes,
            "used_codes": used_codes
        }
