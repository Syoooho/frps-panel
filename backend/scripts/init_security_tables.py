"""初始化安全相关数据表"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import engine, Base
from app.models.login_log import LoginLog, LoginAttempt
from app.models.audit_log import AuditLog

def init_security_tables():
    """创建安全相关的数据表"""
    print("开始创建安全相关数据表...")
    
    # 创建表
    Base.metadata.create_all(bind=engine)
    
    print("✅ 安全数据表创建完成")
    print("  - login_logs: 登录日志表")
    print("  - login_attempts: 登录尝试记录表")
    print("  - audit_logs: 操作审计日志表")

if __name__ == "__main__":
    init_security_tables()
