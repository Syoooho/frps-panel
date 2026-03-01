"""测试 FRP API"""
import httpx
import json

BASE_URL = "http://localhost:8000"

def test_frp_login():
    """测试 FRP 登录验证"""
    print("\n=== 测试 FRP 登录验证 ===")
    
    # 正确的用户名和 token
    payload = {
        "op": "Login",
        "content": {
            "user": "test@example.com",
            "metas": {
                "token": "q0e2k9HULcYd9ZSeGZjotwBJfftV7K9HiAfMFw7aIxM"
            }
        }
    }
    
    response = httpx.post(f"{BASE_URL}/api/v1/frp/handler", json=payload)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    # 错误的 token
    payload["content"]["metas"]["token"] = "wrong_token"
    response = httpx.post(f"{BASE_URL}/api/v1/frp/handler", json=payload)
    print(f"\n错误 token 响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_frp_new_proxy():
    """测试 FRP 新建代理"""
    print("\n=== 测试 FRP 新建代理 ===")
    
    payload = {
        "op": "NewProxy",
        "content": {
            "user": "test@example.com",
            "proxy_info": {
                "proxy_name": "test-ssh",
                "proxy_type": "tcp",
                "remote_port": 6000
            }
        }
    }
    
    response = httpx.post(f"{BASE_URL}/api/v1/frp/handler", json=payload)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_frp_close_proxy():
    """测试 FRP 关闭代理"""
    print("\n=== 测试 FRP 关闭代理 ===")
    
    payload = {
        "op": "CloseProxy",
        "content": {
            "user": "test@example.com",
            "proxy_info": {
                "proxy_name": "test-ssh"
            }
        }
    }
    
    response = httpx.post(f"{BASE_URL}/api/v1/frp/handler", json=payload)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    try:
        test_frp_login()
        test_frp_new_proxy()
        test_frp_close_proxy()
        print("\n✅ 所有测试完成")
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
