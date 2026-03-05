"""安全功能测试脚本"""
import requests
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_login_rate_limit():
    """测试登录限流功能"""
    print("\n=== 测试登录限流功能 ===\n")
    
    # 测试账号
    test_email = "security_test@example.com"
    wrong_password = "wrong_password"
    
    print(f"1. 尝试用错误密码登录 {test_email}...")
    
    # 连续失败登录 6 次
    for i in range(6):
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": test_email, "password": wrong_password}
        )
        print(f"   第 {i+1} 次尝试: {response.status_code}")
        
        if response.status_code == 429:
            print(f"   ✅ 账号已被锁定: {response.json()['detail']}")
            break
        elif response.status_code == 401:
            print(f"   ❌ 登录失败: {response.json()['detail']}")
        
        time.sleep(0.5)
    
    print("\n2. 尝试再次登录（应该被拒绝）...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": test_email, "password": wrong_password}
    )
    
    if response.status_code == 429:
        print(f"   ✅ 登录被拒绝: {response.json()['detail']}")
    else:
        print(f"   ❌ 测试失败: 应该返回 429 状态码")

def test_successful_login():
    """测试成功登录"""
    print("\n=== 测试成功登录 ===\n")
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@example.com", "password": "admin123"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ 登录成功")
        print(f"   用户: {data['user']['email']}")
        print(f"   Token: {data['access_token'][:20]}...")
    else:
        print(f"❌ 登录失败: {response.json()}")

if __name__ == "__main__":
    print("=" * 50)
    print("安全功能测试")
    print("=" * 50)
    
    test_successful_login()
    test_login_rate_limit()
    
    print("\n" + "=" * 50)
    print("测试完成")
    print("=" * 50)
