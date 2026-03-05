"""更新数据库以支持隧道加密功能"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.core.database import engine

def update_database():
    """添加加密相关字段到隧道表"""
    print("开始更新数据库...")
    
    with engine.connect() as conn:
        # 检查字段是否已存在
        result = conn.execute(text("PRAGMA table_info(tunnels)"))
        columns = [row[1] for row in result]
        
        # 添加 use_encryption 字段
        if 'use_encryption' not in columns:
            print("添加 use_encryption 字段...")
            conn.execute(text("ALTER TABLE tunnels ADD COLUMN use_encryption BOOLEAN DEFAULT 0"))
            conn.commit()
            print("✅ use_encryption 字段已添加")
        else:
            print("⏭️  use_encryption 字段已存在")
        
        # 添加 use_compression 字段
        if 'use_compression' not in columns:
            print("添加 use_compression 字段...")
            conn.execute(text("ALTER TABLE tunnels ADD COLUMN use_compression BOOLEAN DEFAULT 0"))
            conn.commit()
            print("✅ use_compression 字段已添加")
        else:
            print("⏭️  use_compression 字段已存在")
    
    print("\n数据库更新完成！")

if __name__ == "__main__":
    update_database()
