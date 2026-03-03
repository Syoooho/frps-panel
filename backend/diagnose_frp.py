"""
FRP 连接诊断脚本
检查所有可能导致连接失败的问题
"""
import requests
import json
import sys
from datetime import datetime

# 配置
SERVER_HOST = "47.108.190.33"
BACKEND_PORT = 8000
PLUGIN_PORT = 7200
FRP_PORT = 7000

# 测试用户信息
TEST_EMAIL = "admin@example.com"
TEST_PASSWORD = "admin123"

def print_section(title):
    """打印分节标题"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_backend_health():
    """测试后端服务健康状态"""
    print_section("1. 后端服务健康检查")
    
    try:
        url = f"http://{SERVER_HOST}:{BACKEND_PORT}/api/v1/health"
        print(f"请求: GET {url}")
        response = requests.get(url, timeout=5)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 后端服务不可达: {e}")
        return False

def test_user_login():
    """测试用户登录并获取 token"""
    print_section("2. 用户登录测试")
    
    try:
        url = f"http://{SERVER_HOST}:{BACKEND_PORT}/api/v1/auth/login"
        data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        print(f"请求: POST {url}")
        print(f"数据: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=5)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 登录成功")
            print(f"Access Token: {result.get('access_token', '')[:50]}...")
            return result.get('access_token')
        else:
            print(f"❌ 登录失败: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 登录请求失败: {e}")
        return None

def test_user_info(access_token):
    """测试获取用户信息"""
    print_section("3. 用户信息测试")
    
    try:
        url = f"http://{SERVER_HOST}:{BACKEND_PORT}/api/v1/auth/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        print(f"请求: GET {url}")
        
        response = requests.get(url, headers=headers, timeout=5)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print(f"✅ 用户信息获取成功")
            print(f"邮箱: {user.get('email')}")
            print(f"FRP Token: {user.get('frp_token', 'N/A')}")
            print(f"是否激活: {user.get('is_active')}")
            return user
        else:
            print(f"❌ 获取用户信息失败: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return None

def test_plugin_health():
    """测试插件服务健康状态"""
    print_section("4. FRP 插件健康检查")
    
    try:
        url = f"http://{SERVER_HOST}:{PLUGIN_PORT}/health"
        print(f"请求: GET {url}")
        response = requests.get(url, timeout=5)
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 插件服务不可达: {e}")
        print(f"提示: 请检查 frps-panel 插件是否正在运行")
        return False

def test_frp_login(user_email, frp_token):
    """测试 FRP 登录验证"""
    print_section("5. FRP 登录验证测试")
    
    try:
        url = f"http://{SERVER_HOST}:{BACKEND_PORT}/api/v1/frp/handler"
        data = {
            "op": "Login",
            "content": {
                "version": "0.67.0",
                "hostname": "test-client",
                "os": "linux",
                "arch": "amd64",
                "user": user_email,
                "timestamp": int(datetime.now().timestamp()),
                "privilege_key": "",
                "run_id": "test-run-id",
                "pool_count": 0,
                "metas": {
                    "token": frp_token
                }
            }
        }
        
        print(f"请求: POST {url}")
        print(f"数据: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=5)
        print(f"状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), indent=2)}")
        
        result = response.json()
        if not result.get("reject", False):
            print(f"✅ FRP 登录验证通过")
            return True
        else:
            print(f"❌ FRP 登录验证失败: {result.get('reject_reason')}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return False

def test_frp_server():
    """测试 FRP 服务器端口"""
    print_section("6. FRP 服务器端口检查")
    
    import socket
    
    try:
        print(f"尝试连接: {SERVER_HOST}:{FRP_PORT}")
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((SERVER_HOST, FRP_PORT))
        sock.close()
        
        if result == 0:
            print(f"✅ FRP 服务器端口 {FRP_PORT} 可访问")
            return True
        else:
            print(f"❌ FRP 服务器端口 {FRP_PORT} 不可访问")
            print(f"提示: 请检查 frps 是否正在运行，防火墙是否开放端口")
            return False
    except Exception as e:
        print(f"❌ 端口检查失败: {e}")
        return False

def test_subscription(access_token):
    """测试订阅状态"""
    print_section("7. 订阅状态检查")
    
    try:
        url = f"http://{SERVER_HOST}:{BACKEND_PORT}/api/v1/subscriptions/current"
        headers = {"Authorization": f"Bearer {access_token}"}
        print(f"请求: GET {url}")
        
        response = requests.get(url, headers=headers, timeout=5)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            sub = response.json()
            print(f"✅ 订阅信息获取成功")
            print(f"订阅类型: {sub.get('type')}")
            print(f"最大隧道数: {sub.get('max_tunnels')}")
            print(f"结束日期: {sub.get('end_date')}")
            print(f"是否有效: {sub.get('is_active')}")
            return sub
        else:
            print(f"❌ 获取订阅信息失败: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return None

def main():
    """主函数"""
    print("\n" + "🔍 FRP 连接诊断工具")
    print(f"服务器: {SERVER_HOST}")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    
    # 1. 后端健康检查
    results['backend'] = test_backend_health()
    if not results['backend']:
        print("\n❌ 后端服务不可用，无法继续测试")
        sys.exit(1)
    
    # 2. 用户登录
    access_token = test_user_login()
    if not access_token:
        print("\n❌ 用户登录失败，无法继续测试")
        sys.exit(1)
    
    # 3. 获取用户信息
    user = test_user_info(access_token)
    if not user:
        print("\n❌ 无法获取用户信息，无法继续测试")
        sys.exit(1)
    
    frp_token = user.get('frp_token')
    if not frp_token:
        print("\n❌ 用户没有 FRP Token，无法继续测试")
        sys.exit(1)
    
    # 4. 插件健康检查
    results['plugin'] = test_plugin_health()
    
    # 5. FRP 登录验证
    results['frp_login'] = test_frp_login(user['email'], frp_token)
    
    # 6. FRP 服务器端口检查
    results['frp_server'] = test_frp_server()
    
    # 7. 订阅状态检查
    subscription = test_subscription(access_token)
    results['subscription'] = subscription is not None and subscription.get('is_active', False)
    
    # 总结
    print_section("诊断总结")
    print(f"后端服务: {'✅ 正常' if results['backend'] else '❌ 异常'}")
    print(f"插件服务: {'✅ 正常' if results['plugin'] else '❌ 异常'}")
    print(f"FRP 登录: {'✅ 正常' if results['frp_login'] else '❌ 异常'}")
    print(f"FRP 服务器: {'✅ 正常' if results['frp_server'] else '❌ 异常'}")
    print(f"订阅状态: {'✅ 有效' if results['subscription'] else '❌ 无效'}")
    
    all_ok = all(results.values())
    if all_ok:
        print("\n✅ 所有检查通过！FRP 连接应该可以正常工作")
        print("\n建议:")
        print("1. 使用生成的 frpc 配置文件进行连接")
        print("2. 检查 frpc 客户端日志查看详细错误信息")
        print("3. 确保本地服务正在运行并监听指定端口")
    else:
        print("\n❌ 发现问题，请根据上述检查结果进行修复")
        print("\n常见问题:")
        if not results.get('plugin'):
            print("- FRP 插件未运行: 使用 python backend/start_all.py 启动")
        if not results.get('frp_server'):
            print("- FRP 服务器未运行或端口未开放: 检查 frps 进程和防火墙")
        if not results.get('frp_login'):
            print("- FRP 登录验证失败: 检查用户 Token 和订阅状态")
        if not results.get('subscription'):
            print("- 订阅无效: 使用兑换码激活订阅")

if __name__ == "__main__":
    main()
