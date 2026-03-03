#!/usr/bin/env python3
"""
测试 FRP 登录验证
"""
import httpx
import json

# 测试数据
BASE_URL = "http://47.108.190.33:8000/api/v1"

def test_frp_login():
    """测试 FRP 登录"""
    url = f"{BASE_URL}/frp/handler"
    
    # 模拟 frps 发送的登录请求
    # 注意：这里需要使用实际的用户邮箱和 frp_token
    data = {
        "op": "Login",
        "content": {
            "user": "admin@example.com",
            "metas": {
                "token": "请替换为实际的frp_token"
            }
        }
    }
    
    print(f"请求 URL: {url}")
    print(f"请求数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    try:
        response = httpx.post(url, json=data, timeout=10.0)
        print(f"\n状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("reject"):
                print(f"\n❌ 登录被拒绝: {result.get('reject_reason')}")
            else:
                print("\n✅ 登录成功！")
        else:
            print(f"\n❌ 请求失败")
    except Exception as e:
        print(f"\n❌ 请求异常: {e}")

def get_user_info():
    """获取用户信息（包含 frp_token）"""
    url = f"{BASE_URL}/auth/login"
    
    data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    print("=" * 60)
    print("先登录获取 frp_token")
    print("=" * 60)
    
    try:
        response = httpx.post(url, json=data, timeout=10.0)
        if response.status_code == 200:
            result = response.json()
            user = result.get("user", {})
            print(f"\n用户信息:")
            print(f"  邮箱: {user.get('email')}")
            print(f"  FRP Token: {user.get('frp_token')}")
            return user.get('email'), user.get('frp_token')
        else:
            print(f"登录失败: {response.text}")
            return None, None
    except Exception as e:
        print(f"登录异常: {e}")
        return None, None

if __name__ == "__main__":
    print("=" * 60)
    print("FRP 登录验证测试")
    print("=" * 60)
    print()
    
    # 先获取用户信息
    email, frp_token = get_user_info()
    
    if email and frp_token:
        print("\n" + "=" * 60)
        print("测试 FRP 登录")
        print("=" * 60)
        
        # 使用获取到的信息测试 FRP 登录
        url = f"{BASE_URL}/frp/handler"
        data = {
            "op": "Login",
            "content": {
                "user": email,
                "metas": {
                    "token": frp_token
                }
            }
        }
        
        print(f"\n请求 URL: {url}")
        print(f"请求数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        try:
            response = httpx.post(url, json=data, timeout=10.0)
            print(f"\n状态码: {response.status_code}")
            print(f"响应内容: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("reject"):
                    print(f"\n❌ 登录被拒绝: {result.get('reject_reason')}")
                else:
                    print("\n✅ 登录成功！")
        except Exception as e:
            print(f"\n❌ 请求异常: {e}")
    
    print("\n" + "=" * 60)
