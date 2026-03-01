from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from app.models.activation_code import ActivationCode
from app.utils.code_generator import generate_activation_code
from fastapi import HTTPException, status
from datetime import datetime, timedelta

class SubscriptionService:
    @staticmethod
    def get_user_subscription(db: Session, user_id: int):
        return db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.is_active == True
        ).first()
    
    @staticmethod
    def activate_code(db: Session, user_id: int, code: str):
        activation_code = db.query(ActivationCode).filter(
            ActivationCode.code == code
        ).first()
        
        if not activation_code:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="兑换码不存在")
        
        if activation_code.is_used:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="兑换码已被使用")
        
        existing_subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.is_active == True
        ).first()
        
        max_tunnels = 10 if activation_code.plan_type == "monthly" else 100
        duration_days = 30 if activation_code.plan_type == "monthly" else 365
        
        if existing_subscription:
            existing_subscription.end_date = existing_subscription.end_date + timedelta(days=duration_days)
            existing_subscription.max_tunnels = max(existing_subscription.max_tunnels, max_tunnels)
        else:
            subscription = Subscription(
                user_id=user_id,
                plan_type=activation_code.plan_type,
                max_tunnels=max_tunnels,
                start_date=datetime.utcnow(),
                end_date=datetime.utcnow() + timedelta(days=duration_days),
                is_active=True
            )
            db.add(subscription)
        
        activation_code.is_used = True
        activation_code.used_by = user_id
        activation_code.used_at = datetime.utcnow()
        
        db.commit()
        return {"message": "激活成功"}
    
    @staticmethod
    def generate_codes(db: Session, plan_type: str, count: int):
        codes = []
        for _ in range(count):
            code = generate_activation_code()
            activation_code = ActivationCode(
                code=code,
                plan_type=plan_type,
                is_used=False
            )
            db.add(activation_code)
            codes.append(code)
        
        db.commit()
        return codes
    
    @staticmethod
    def get_all_codes(db: Session, skip: int = 0, limit: int = 100):
        return db.query(ActivationCode).offset(skip).limit(limit).all()
    
    @staticmethod
    def delete_code(db: Session, code_id: int):
        code = db.query(ActivationCode).filter(ActivationCode.id == code_id).first()
        if not code:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="兑换码不存在")
        
        db.delete(code)
        db.commit()
        return {"message": "兑换码已删除"}
