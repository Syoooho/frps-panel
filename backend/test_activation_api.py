import requests

BASE_URL = "http://localhost:8000/api/v1"

# 1. 登录获取 token
print("1. 登录...")
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "test@example.com",
    "password": "test1234"
})
print(f"登录状态: {login_response.status_code}")
token = login_response.json()["access_token"]
print(f"Token: {token[:20]}...")

headers = {"Authorization": f"Bearer {token}"}

# 2. 测试激活码 API
print("\n2. 测试激活码...")
activate_response = requests.post(
    f"{BASE_URL}/activation/activate",
    json={"code": "MONTHLY-TEST-0001"},
    headers=headers
)
print(f"激活状态: {activate_response.status_code}")
print(f"响应: {activate_response.text}")
