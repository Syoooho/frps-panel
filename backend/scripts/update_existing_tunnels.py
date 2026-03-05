"""为现有隧道添加默认的加密和压缩字段值"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.models.tunnel import Tunnel

def update_existing_tunnels():
    db = SessionLocal()
    try:
        # 获取所有隧道
        tunnels = db.query(Tunnel).all()
        
        print(f"找到 {len(tunnels)} 个隧道")
        
        updated_count = 0
        for tunnel in tunnels:
            # 检查字段是否为 None，如果是则设置默认值
            if tunnel.use_encryption is None:
                tunnel.use_encryption = False
                updated_count += 1
            
            if tunnel.use_compression is None:
                tunnel.use_compression = False
                updated_count += 1
        
        if updated_count > 0:
            db.commit()
            print(f"✅ 更新了 {updated_count} 个字段")
        else:
            print("✅ 所有隧道字段都已正确设置")
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_existing_tunnels()
