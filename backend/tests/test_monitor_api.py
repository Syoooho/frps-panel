"""测试监控 API"""
import httpx
import json

BASE_URL = "http://localhost:8000"

def get_admin_token():
    """获取管理员 Token"""
    response = httpx.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "admin123"}
    )
    return response.json()["access_token"]

def test_system_stats():
    """测试系统资源统计"""
    print("\n=== 测试系统资源统计 ===")
    token = get_admin_token()
    
    response = httpx.get(
        f"{BASE_URL}/api/v1/monitor/system",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_tunnel_stats():
    """测试隧道统计"""
    print("\n=== 测试隧道统计 ===")
    token = get_admin_token()
    
    response = httpx.get(
        f"{BASE_URL}/api/v1/monitor/tunnels",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_user_stats():
    """测试用户统计"""
    print("\n=== 测试用户统计 ===")
    token = get_admin_token()
    
    response = httpx.get(
        f"{BASE_URL}/api/v1/monitor/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_subscription_stats():
    """测试订阅统计"""
    print("\n=== 测试订阅统计 ===")
    token = get_admin_token()
    
    response = httpx.get(
        f"{BASE_URL}/api/v1/monitor/subscriptions",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_monitor_overview():
    """测试监控概览"""
    print("\n=== 测试监控概览 ===")
    token = get_admin_token()
    
    response = httpx.get(
        f"{BASE_URL}/api/v1/monitor/overview",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == "__main__":
    try:
        test_system_stats()
        test_tunnel_stats()
        test_user_stats()
        test_subscription_stats()
        test_monitor_overview()
        print("\n✅ 所有测试完成")
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
