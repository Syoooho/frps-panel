#!/usr/bin/env python3
import sys
sys.path.append('backend')

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

def create_admin():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if admin:
            print(f"管理员账号已存在: {settings.ADMIN_EMAIL}")
            return
        
        admin = User(
            email=settings.ADMIN_EMAIL,
            password_hash=get_password_hash(settings.ADMIN_PASSWORD),
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print(f"管理员账号创建成功: {settings.ADMIN_EMAIL}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
