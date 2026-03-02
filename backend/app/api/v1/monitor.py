"""系统监控 API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.services.monitor_service import MonitorService
from app.models.user import User

router = APIRouter()


@router.get("/system")
def get_system_stats(
    current_user: User = Depends(get_current_admin)
):
    """
    获取系统资源统计
    
    需要管理员权限
    """
    return MonitorService.get_system_stats()


@router.get("/tunnels")
def get_tunnel_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    获取隧道统计
    
    需要管理员权限
    """
    return MonitorService.get_tunnel_stats(db)


@router.get("/users")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    获取用户统计
    
    需要管理员权限
    """
    return MonitorService.get_user_stats(db)


@router.get("/subscriptions")
def get_subscription_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    获取订阅统计
    
    需要管理员权限
    """
    return MonitorService.get_subscription_stats(db)


@router.get("/overview")
def get_monitor_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    获取监控概览
    
    包含系统、隧道、用户、订阅的综合统计
    需要管理员权限
    """
    return {
        "system": MonitorService.get_system_stats(),
        "tunnels": MonitorService.get_tunnel_stats(db),
        "users": MonitorService.get_user_stats(db),
        "subscriptions": MonitorService.get_subscription_stats(db)
    }
