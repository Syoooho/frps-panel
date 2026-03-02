"""系统监控服务"""
import psutil
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.tunnel import Tunnel
from app.models.subscription import Subscription
from datetime import datetime, timedelta
from typing import Dict, Any


class MonitorService:
    """系统监控服务"""
    
    @staticmethod
    def get_system_stats() -> Dict[str, Any]:
        """
        获取系统资源统计
        
        Returns:
            系统资源信息
        """
        # CPU 使用率
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # 内存使用情况
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        
        # 磁盘使用情况
        disk = psutil.disk_usage('/')
        disk_percent = disk.percent
        
        return {
            "cpu_percent": cpu_percent,
            "memory_percent": memory_percent,
            "disk_percent": disk_percent
        }
    
    @staticmethod
    def get_tunnel_stats(db: Session) -> Dict[str, Any]:
        """
        获取隧道统计
        
        Args:
            db: 数据库会话
            
        Returns:
            隧道统计信息
        """
        # 总隧道数
        total = db.query(Tunnel).count()
        
        # 在线隧道数
        online = db.query(Tunnel).filter(Tunnel.status == "online").count()
        
        # 离线隧道数
        offline = db.query(Tunnel).filter(Tunnel.status == "offline").count()
        
        # 按类型统计
        by_type = db.query(
            Tunnel.type,
            func.count(Tunnel.id)
        ).group_by(Tunnel.type).all()
        
        type_stats = {t: count for t, count in by_type}
        
        return {
            "total": total,
            "online": online,
            "offline": offline,
            "by_type": type_stats
        }
    
    @staticmethod
    def get_user_stats(db: Session) -> Dict[str, Any]:
        """
        获取用户统计
        
        Args:
            db: 数据库会话
            
        Returns:
            用户统计信息
        """
        # 总用户数
        total = db.query(User).count()
        
        # 活跃用户数（有有效订阅）
        active = db.query(User).join(Subscription).filter(
            Subscription.end_date > datetime.utcnow()
        ).count()
        
        # 今日新增用户
        today = datetime.utcnow().date()
        today_new = db.query(User).filter(
            func.date(User.created_at) == today
        ).count()
        
        # 本周新增用户
        week_ago = datetime.utcnow() - timedelta(days=7)
        week_new = db.query(User).filter(
            User.created_at >= week_ago
        ).count()
        
        return {
            "total": total,
            "active": active,
            "new_today": today_new
        }
    
    @staticmethod
    def get_subscription_stats(db: Session) -> Dict[str, Any]:
        """
        获取订阅统计
        
        Args:
            db: 数据库会话
            
        Returns:
            订阅统计信息
        """
        # 总订阅数
        total = db.query(Subscription).count()
        
        # 有效订阅数
        active = db.query(Subscription).filter(
            Subscription.end_date > datetime.utcnow()
        ).count()
        
        # 过期订阅数
        expired = db.query(Subscription).filter(
            Subscription.end_date <= datetime.utcnow()
        ).count()
        
        # 按类型统计
        by_type = db.query(
            Subscription.plan_type,
            func.count(Subscription.id)
        ).group_by(Subscription.plan_type).all()
        
        type_stats = {t: count for t, count in by_type}
        
        # 即将过期（7天内）
        week_later = datetime.utcnow() + timedelta(days=7)
        expiring_soon = db.query(Subscription).filter(
            Subscription.end_date > datetime.utcnow(),
            Subscription.end_date <= week_later
        ).count()
        
        return {
            "total": total,
            "active": active,
            "expired": expired,
            "expiring_soon": expiring_soon,
            "by_type": type_stats
        }
