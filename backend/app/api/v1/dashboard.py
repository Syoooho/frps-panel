"""仪表板 API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.services.monitor_service import MonitorService
from app.models.user import User
from app.models.tunnel import Tunnel
from app.models.subscription import Subscription

router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取用户仪表板统计数据
    
    返回当前用户的隧道、订阅等统计信息
    """
    # 获取用户订阅信息
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    # 获取用户隧道统计
    total_tunnels = db.query(Tunnel).filter(
        Tunnel.user_id == current_user.id
    ).count()
    
    online_tunnels = db.query(Tunnel).filter(
        Tunnel.user_id == current_user.id,
        Tunnel.status == "online"
    ).count()
    
    offline_tunnels = db.query(Tunnel).filter(
        Tunnel.user_id == current_user.id,
        Tunnel.status == "offline"
    ).count()
    
    # 按类型统计
    tunnels = db.query(Tunnel).filter(
        Tunnel.user_id == current_user.id
    ).all()
    
    by_type = {}
    for tunnel in tunnels:
        by_type[tunnel.type] = by_type.get(tunnel.type, 0) + 1
    
    return {
        "subscription": {
            "plan_type": subscription.plan_type if subscription else None,
            "max_tunnels": subscription.max_tunnels if subscription else 0,
            "end_date": subscription.end_date.isoformat() if subscription else None,
            "is_active": subscription.end_date.timestamp() > 0 if subscription else False
        } if subscription else None,
        "tunnels": {
            "total": total_tunnels,
            "online": online_tunnels,
            "offline": offline_tunnels,
            "by_type": by_type,
            "usage_percent": round((total_tunnels / subscription.max_tunnels * 100) if subscription and subscription.max_tunnels > 0 else 0, 1)
        }
    }
