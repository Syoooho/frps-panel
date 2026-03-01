from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import user, tunnel, subscription, activation_code, system_config
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def init_db():
    user.Base.metadata.create_all(bind=engine)
    tunnel.Base.metadata.create_all(bind=engine)
    subscription.Base.metadata.create_all(bind=engine)
    activation_code.Base.metadata.create_all(bind=engine)
    system_config.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    admin_user = db.query(user.User).filter(user.User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = user.User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.generate_frp_token()
        db.add(admin_user)
        print("✅ 管理员账户已创建: admin@example.com / admin123")
    
    test_user = db.query(user.User).filter(user.User.email == "test@example.com").first()
    if not test_user:
        test_user = user.User(
            email="test@example.com",
            hashed_password=get_password_hash("test1234"),
            is_admin=False,
            is_active=True,
            created_at=datetime.utcnow()
        )
        test_user.generate_frp_token()
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        test_subscription = subscription.Subscription(
            user_id=test_user.id,
            plan_type="monthly",
            max_tunnels=10,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            is_active=True
        )
        db.add(test_subscription)
        print(f"✅ 测试用户已创建: test@example.com / test1234")
        print(f"   FRP Token: {test_user.frp_token}")
    
    test_codes = db.query(activation_code.ActivationCode).count()
    if test_codes == 0:
        for i in range(5):
            code = activation_code.ActivationCode(
                code=f"MONTHLY-TEST-{i:04d}",
                plan_type="monthly",
                is_used=False,
                created_at=datetime.utcnow()
            )
            db.add(code)
        
        for i in range(5):
            code = activation_code.ActivationCode(
                code=f"YEARLY-TEST-{i:04d}",
                plan_type="yearly",
                is_used=False,
                created_at=datetime.utcnow()
            )
            db.add(code)
        print("✅ 测试兑换码已创建")
    
    db.commit()
    db.close()
    print("✅ 数据库初始化完成")

if __name__ == "__main__":
    init_db()
