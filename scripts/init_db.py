#!/usr/bin/env python3
import sys
sys.path.append('backend')

from app.core.database import engine, Base
from app.models.user import User
from app.models.subscription import Subscription
from app.models.activation_code import ActivationCode
from app.models.tunnel import Tunnel
from app.models.system_config import SystemConfig

def init_database():
    print("创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库初始化完成！")

if __name__ == "__main__":
    init_database()
