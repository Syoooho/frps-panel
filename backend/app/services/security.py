from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.login_log import LoginLog, LoginAttempt
from app.models.audit_log import AuditLog
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class SecurityService:
    """安全服务类"""
    
    # 配置常量
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION_MINUTES = 15
    
    @staticmethod
    def check_login_attempts(db: Session, email: str, ip_address: str) -> tuple[bool, Optional[datetime]]:
        """
        检查登录尝试次数
        返回: (是否被锁定, 锁定到期时间)
        """
        attempt = db.query(LoginAttempt).filter(
            LoginAttempt.email == email
        ).first()
        
        if not attempt:
            return False, None
        
        # 检查是否在锁定期内
        if attempt.locked_until and attempt.locked_until > datetime.utcnow():
            return True, attempt.locked_until
        
        # 锁定期已过，重置计数
        if attempt.locked_until and attempt.locked_until <= datetime.utcnow():
            attempt.failed_count = 0
            attempt.locked_until = None
            db.commit()
            return False, None
        
        return False, None

    
    @staticmethod
    def record_login_attempt(
        db: Session,
        email: str,
        ip_address: str,
        success: bool,
        user_id: Optional[int] = None,
        user_agent: Optional[str] = None,
        failure_reason: Optional[str] = None
    ):
        """记录登录尝试"""
        # 记录登录日志
        log = LoginLog(
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            failure_reason=failure_reason
        )
        db.add(log)
        
        if not success:
            # 更新失败计数
            attempt = db.query(LoginAttempt).filter(
                LoginAttempt.email == email
            ).first()
            
            if not attempt:
                attempt = LoginAttempt(
                    email=email,
                    ip_address=ip_address,
                    failed_count=1
                )
                db.add(attempt)
            else:
                attempt.failed_count += 1
                attempt.ip_address = ip_address
                attempt.last_attempt = datetime.utcnow()
                
                # 达到最大尝试次数，锁定账号
                if attempt.failed_count >= SecurityService.MAX_LOGIN_ATTEMPTS:
                    attempt.locked_until = datetime.utcnow() + timedelta(
                        minutes=SecurityService.LOCKOUT_DURATION_MINUTES
                    )
                    logger.warning(f"账号 {email} 因登录失败次数过多被锁定到 {attempt.locked_until}")
        else:
            # 登录成功，重置失败计数
            attempt = db.query(LoginAttempt).filter(
                LoginAttempt.email == email
            ).first()
            if attempt:
                attempt.failed_count = 0
                attempt.locked_until = None
        
        db.commit()
    
    @staticmethod
    def record_audit_log(
        db: Session,
        user_id: int,
        action: str,
        ip_address: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[int] = None,
        details: Optional[str] = None,
        user_agent: Optional[str] = None,
        success: bool = True
    ):
        """记录操作审计日志"""
        log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success
        )
        db.add(log)
        db.commit()
        
        logger.info(f"审计日志: 用户 {user_id} 执行 {action} 操作")
