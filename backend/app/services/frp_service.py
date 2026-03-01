"""FRP 插件服务"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.tunnel import Tunnel
from app.models.subscription import Subscription
from datetime import datetime
from typing import Optional, Tuple


class FRPService:
    """FRP 插件服务"""
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        根据邮箱获取用户
        
        Args:
            db: 数据库会话
            email: 邮箱
            
        Returns:
            用户对象或 None
        """
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def validate_user(db: Session, username: str, token: str) -> Tuple[bool, str, Optional[User]]:
        """
        验证用户
        
        Args:
            db: 数据库会话
            username: 用户名
            token: Token
            
        Returns:
            (是否通过, 拒绝原因, 用户对象)
        """
        # 根据邮箱查找用户
        user = db.query(User).filter(User.email == username).first()
        if not user:
            return False, "用户不存在", None
        
        # 检查用户是否激活
        if not user.is_active:
            return False, "用户已被禁用", None
        
        # 检查订阅是否有效
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id
        ).first()
        
        if not subscription:
            return False, "用户未订阅", None
        
        if subscription.end_date < datetime.utcnow():
            return False, "订阅已过期", None
        
        # 验证 frp_token
        if not user.frp_token:
            # 如果用户没有 token,自动生成一个
            user.generate_frp_token()
            db.commit()
        
        if token != user.frp_token:
            return False, "Token 无效", None
        
        return True, "", user
    
    @staticmethod
    def validate_proxy(
        db: Session,
        user: User,
        proxy_type: str,
        remote_port: Optional[int] = None,
        custom_domains: list = None,
        subdomain: str = ""
    ) -> Tuple[bool, str]:
        """
        验证代理配置
        
        Args:
            db: 数据库会话
            user: 用户对象
            proxy_type: 代理类型
            remote_port: 远程端口
            custom_domains: 自定义域名列表
            subdomain: 子域名
            
        Returns:
            (是否通过, 拒绝原因)
        """
        # 检查订阅
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user.id
        ).first()
        
        if not subscription:
            return False, "用户未订阅"
        
        if subscription.end_date < datetime.utcnow():
            return False, "订阅已过期"
        
        # 检查隧道数量
        tunnel_count = db.query(Tunnel).filter(
            Tunnel.user_id == user.id,
            Tunnel.status == "online"
        ).count()
        
        if tunnel_count >= subscription.max_tunnels:
            return False, f"隧道数量已达上限 ({subscription.max_tunnels})"
        
        # 检查端口限制 (TCP/UDP 类型)
        if proxy_type in ["tcp", "udp"] and remote_port:
            # 这里可以添加端口范围限制逻辑
            # 例如: 检查端口是否在允许的范围内
            pass
        
        # 检查域名限制 (HTTP/HTTPS 类型)
        if proxy_type in ["http", "https"]:
            if custom_domains:
                # 这里可以添加域名白名单检查逻辑
                pass
            if subdomain:
                # 这里可以添加子域名白名单检查逻辑
                pass
        
        return True, ""
    
    @staticmethod
    def register_tunnel(
        db: Session,
        user_id: int,
        proxy_name: str,
        proxy_type: str,
        remote_port: Optional[int] = None,
        custom_domains: list = None,
        subdomain: str = ""
    ) -> Optional[Tunnel]:
        """
        注册隧道(上线)
        
        Args:
            db: 数据库会话
            user_id: 用户 ID
            proxy_name: 代理名称
            proxy_type: 代理类型
            remote_port: 远程端口
            custom_domains: 自定义域名列表
            subdomain: 子域名
            
        Returns:
            隧道对象
        """
        # 查找或创建隧道
        tunnel = db.query(Tunnel).filter(
            Tunnel.user_id == user_id,
            Tunnel.name == proxy_name
        ).first()
        
        if tunnel:
            # 更新现有隧道
            tunnel.status = "online"
            tunnel.updated_at = datetime.utcnow()
        else:
            # 创建新隧道
            tunnel = Tunnel(
                user_id=user_id,
                name=proxy_name,
                type=proxy_type,
                local_ip="0.0.0.0",
                local_port=0,
                remote_port=remote_port or 0,
                custom_domain=custom_domains[0] if custom_domains else "",
                subdomain=subdomain,
                status="online"
            )
            db.add(tunnel)
        
        db.commit()
        db.refresh(tunnel)
        return tunnel
    
    @staticmethod
    def unregister_tunnel(db: Session, user_id: int, proxy_name: str) -> bool:
        """
        注销隧道(下线)
        
        Args:
            db: 数据库会话
            user_id: 用户 ID
            proxy_name: 代理名称
            
        Returns:
            是否成功
        """
        tunnel = db.query(Tunnel).filter(
            Tunnel.user_id == user_id,
            Tunnel.name == proxy_name
        ).first()
        
        if tunnel:
            tunnel.status = "offline"
            tunnel.updated_at = datetime.utcnow()
            db.commit()
            return True
        
        return False
