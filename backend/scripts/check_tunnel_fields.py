"""检查隧道表是否有加密和压缩字段"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import engine
from sqlalchemy import inspect

def check_tunnel_fields():
    inspector = inspect(engine)
    columns = inspector.get_columns('tunnels')
    
    print("隧道表的所有字段：")
    for col in columns:
        print(f"  - {col['name']}: {col['type']}")
    
    # 检查是否有加密和压缩字段
    column_names = [col['name'] for col in columns]
    
    print("\n检查结果：")
    if 'use_encryption' in column_names:
        print("✅ use_encryption 字段存在")
    else:
        print("❌ use_encryption 字段不存在")
    
    if 'use_compression' in column_names:
        print("✅ use_compression 字段存在")
    else:
        print("❌ use_compression 字段不存在")
    
    if 'custom_http_port' in column_names:
        print("✅ custom_http_port 字段存在")
    else:
        print("❌ custom_http_port 字段不存在")
    
    if 'custom_https_port' in column_names:
        print("✅ custom_https_port 字段存在")
    else:
        print("❌ custom_https_port 字段不存在")

if __name__ == "__main__":
    check_tunnel_fields()
