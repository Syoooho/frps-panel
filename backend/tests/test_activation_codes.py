import httpx
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_activation_codes():
    print("=== 测试兑换码管理功能 ===\n")
    
    # 1. 管理员登录
    print("1. 管理员登录...")
    with httpx.Client() as client:
        login_response = client.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@example.com",
            "password": "admin123"
        })
        
        if login_response.status_code != 200:
            print(f"❌ 登录失败: {login_response.text}")
            return
        
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ 管理员登录成功\n")
        
        # 2. 生成兑换码
        print("2. 生成兑换码...")
        generate_response = client.post(
            f"{BASE_URL}/activation/generate",
            headers=headers,
            json={"plan_type": "monthly", "count": 3}
        )
        
        if generate_response.status_code != 200:
            print(f"❌ 生成失败: {generate_response.text}")
            return
        
        generated_codes = generate_response.json()["codes"]
        print(f"✅ 成功生成 {len(generated_codes)} 个兑换码")
        for code in generated_codes[:2]:
            print(f"   - {code}")
        print()
        
        # 3. 查询所有兑换码
        print("3. 查询所有兑换码...")
        list_response = client.get(
            f"{BASE_URL}/activation/codes",
            headers=headers,
            params={"skip": 0, "limit": 10}
        )
        
        if list_response.status_code != 200:
            print(f"❌ 查询失败: {list_response.text}")
            return
        
        result = list_response.json()
        codes = result['codes']
        total = result['total']
        print(f"✅ 查询成功，共 {total} 个兑换码（当前页 {len(codes)} 个）")
        print(f"   未使用: {sum(1 for c in codes if not c['is_used'])} 个")
        print(f"   已使用: {sum(1 for c in codes if c['is_used'])} 个\n")
        
        # 4. 测试分页功能
        print("4. 测试分页功能...")
        page2_response = client.get(
            f"{BASE_URL}/activation/codes",
            headers=headers,
            params={"skip": 10, "limit": 10}
        )
        
        if page2_response.status_code == 200:
            page2_result = page2_response.json()
            print(f"✅ 第2页查询成功，返回 {len(page2_result['codes'])} 个兑换码\n")
        
        # 5. 删除未使用的兑换码
        unused_codes = [c for c in codes if not c['is_used']]
        if len(unused_codes) > 1:
            code_to_delete = unused_codes[0]
            print(f"5. 删除兑换码 {code_to_delete['code']}...")
            delete_response = client.delete(
                f"{BASE_URL}/activation/codes/{code_to_delete['id']}",
                headers=headers
            )
            
            if delete_response.status_code == 200:
                print("✅ 删除成功\n")
            else:
                print(f"❌ 删除失败: {delete_response.text}\n")
        
        # 6. 测试用户激活兑换码
        print("6. 测试用户激活兑换码...")
        
        # 用户登录
        user_login = client.post(f"{BASE_URL}/auth/login", json={
            "email": "test@example.com",
            "password": "test1234"
        })
        
        if user_login.status_code != 200:
            print(f"❌ 用户登录失败: {user_login.text}")
            return
        
        user_token = user_login.json()["access_token"]
        user_headers = {"Authorization": f"Bearer {user_token}"}
        
        # 使用新生成的兑换码（使用第二个，因为第一个可能被删除了）
        if len(generated_codes) > 1:
            test_code = generated_codes[1]
            activate_response = client.post(
                f"{BASE_URL}/activation/activate",
                headers=user_headers,
                json={"code": test_code}
            )
            
            if activate_response.status_code == 200:
                print(f"✅ 激活成功: {test_code}")
                result = activate_response.json()
                print(f"   {result['message']}")
            else:
                print(f"❌ 激活失败: {activate_response.text}")
    
    print("\n=== 测试完成 ===")

if __name__ == "__main__":
    test_activation_codes()
