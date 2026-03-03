#!/usr/bin/env python3
"""
测试线上注册 API
"""
import httpx
import json

# 线上 API 地址
BASE_URL = "http://47.108.190.33:8000/api/v1"

def test_register():
    """测试注册"""
    url = f"{BASE_URL}/auth/register"
    
    # 测试数据
    data = {
        "email": "test123@example.com",
        "password": "test123456"
    }
    
    print(f"请求 URL: {url}")
    print(f"请求数据: {json.dumps(data, indent=2)}")
    
    try:
        response = httpx.post(url, json=data, timeout=10.0)
        print(f"\n状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            print("\n✅ 注册成功！")
            result = response.json()
            print(f"用户信息: {json.dumps(result.get('user'), indent=2)}")
        else:
            print(f"\n❌ 注册失败！")
            try:
                error = response.json()
                print(f"错误详情: {json.dumps(error, indent=2)}")
            except:
                print(f"错误内容: {response.text}")
    except Exception as e:
        print(f"\n❌ 请求异常: {e}")

def test_health():
    """测试健康检查"""
    url = f"{BASE_URL.replace('/api/v1', '')}/health"
    print(f"\n测试健康检查: {url}")
    try:
        response = httpx.get(url, timeout=10.0)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("线上注册 API 测试")
    print("=" * 60)
    
    test_health()
    print("\n" + "=" * 60)
    test_register()
    print("=" * 60)
