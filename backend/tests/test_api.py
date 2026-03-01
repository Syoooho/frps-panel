import httpx
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_login():
    print("测试登录...")
    response = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "test@example.com",
        "password": "test1234"
    })
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 登录成功")
        print(f"Token: {data['access_token'][:50]}...")
        return data['access_token']
    else:
        print(f"❌ 登录失败: {response.text}")
        return None

def test_get_tunnels(token):
    print("\n测试获取隧道列表...")
    headers = {"Authorization": f"Bearer {token}"}
    response = httpx.get(f"{BASE_URL}/tunnels", headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        tunnels = response.json()
        print(f"✅ 获取成功，隧道数量: {len(tunnels)}")
        return tunnels
    else:
        print(f"❌ 获取失败: {response.text}")
        return None

def test_create_tunnel(token):
    print("\n测试创建隧道...")
    headers = {"Authorization": f"Bearer {token}"}
    response = httpx.post(f"{BASE_URL}/tunnels", headers=headers, json={
        "name": "测试隧道",
        "type": "tcp",
        "local_ip": "127.0.0.1",
        "local_port": 8080,
        "remote_port": 8080
    })
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        tunnel = response.json()
        print(f"✅ 创建成功，隧道ID: {tunnel['id']}")
        return tunnel
    else:
        print(f"❌ 创建失败: {response.text}")
        return None

def test_admin_stats(token):
    print("\n测试管理员统计...")
    headers = {"Authorization": f"Bearer {token}"}
    response = httpx.get(f"{BASE_URL}/admin/stats", headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        stats = response.json()
        print(f"✅ 获取成功")
        print(f"总用户数: {stats['total_users']}")
        print(f"总隧道数: {stats['total_tunnels']}")
        return stats
    else:
        print(f"❌ 获取失败: {response.text}")
        return None

if __name__ == "__main__":
    print("=" * 50)
    print("FRP SaaS Platform API 测试")
    print("=" * 50)
    
    token = test_login()
    if token:
        test_get_tunnels(token)
        test_create_tunnel(token)
    
    print("\n" + "=" * 50)
    print("测试管理员功能")
    print("=" * 50)
    
    admin_response = httpx.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    if admin_response.status_code == 200:
        admin_token = admin_response.json()['access_token']
        test_admin_stats(admin_token)
