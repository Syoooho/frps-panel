#!/usr/bin/env python3
"""
同时启动后端、FRP 服务端和 FRP 插件
"""
import os
import sys
import subprocess
import signal
import time
from pathlib import Path

processes = []

def cleanup():
    """清理所有进程"""
    print("\n正在停止所有服务...")
    for proc in processes:
        try:
            proc.terminate()
            proc.wait(timeout=3)
        except:
            try:
                proc.kill()
            except:
                pass
    
    # 清理临时配置文件
    try:
        temp_config = Path(__file__).parent.parent / "frp-plugin" / "frps-panel-temp.toml"
        if temp_config.exists():
            temp_config.unlink()
    except:
        pass

def signal_handler(sig, frame):
    """处理退出信号"""
    cleanup()
    sys.exit(0)

def find_available_port(start_port=8000, max_attempts=10):
    """查找可用端口"""
    import socket
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', port))
                return port
        except OSError:
            continue
    return None

def find_frps():
    """查找 frps 可执行文件"""
    root_dir = Path(__file__).parent.parent
    possible_paths = []
    
    # 查找 frp_* 目录
    for item in root_dir.glob("frp_*"):
        if item.is_dir():
            if sys.platform == "win32":
                possible_paths.append(item / "frps.exe")
            else:
                possible_paths.append(item / "frps")
    
    # 其他常见位置
    if sys.platform == "win32":
        possible_paths.extend([
            root_dir / "frps.exe",
            root_dir / "frp" / "frps.exe",
        ])
    else:
        possible_paths.extend([
            root_dir / "frps",
            root_dir / "frp" / "frps",
        ])
    
    for path in possible_paths:
        if path.exists():
            return path
    return None

def get_frps_config():
    """获取 frps 配置文件路径"""
    root_dir = Path(__file__).parent.parent
    config_path = root_dir / "frp-plugin" / "config" / "frps.toml"
    return config_path if config_path.exists() else None

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    root_dir = Path(__file__).parent.parent
    backend_dir = Path(__file__).parent
    plugin_dir = root_dir / "frp-plugin"
    
    # 检查插件
    if sys.platform == "win32":
        plugin_exe = plugin_dir / "frps-panel-windows-amd64.exe"
    else:
        plugin_exe = plugin_dir / "frps-panel-linux-amd64"
    
    if not plugin_exe.exists():
        print(f"错误: 插件未构建 {plugin_exe}")
        print("请先运行: cd frp-plugin && make build-all")
        sys.exit(1)
    
    # 查找 frps
    frps_exe = find_frps()
    skip_frps = False
    
    if not frps_exe:
        print("警告: 未找到 frps 可执行文件")
        if sys.platform == "win32":
            print("提示: 请下载 Windows 版本的 frp")
            print("下载地址: https://github.com/fatedier/frp/releases")
        else:
            print("下载地址: https://github.com/fatedier/frp/releases")
        print("\n将跳过 frps 启动，仅启动后端和插件\n")
        skip_frps = True
    
    # 获取 frps 配置
    frps_config = None
    if not skip_frps:
        frps_config = get_frps_config()
        if not frps_config:
            print("警告: frps 配置文件不存在")
            print("将跳过 frps 启动\n")
            skip_frps = True
    
    service_count = 2 if skip_frps else 3
    
    # 查找可用端口
    backend_port = find_available_port(8000)
    if not backend_port:
        print("错误: 无法找到可用端口 (8000-8009)")
        sys.exit(1)
    
    plugin_port = find_available_port(7200)
    if not plugin_port:
        print("错误: 无法找到可用端口 (7200-7209)")
        sys.exit(1)
    
    print("=" * 70)
    print("FRP SaaS Platform - 启动服务")
    print("=" * 70)
    print()
    
    # 1. 启动后端
    print(f"[1/{service_count}] 启动后端服务...")
    backend_cmd = ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", str(backend_port)]
    backend_proc = subprocess.Popen(
        backend_cmd, 
        cwd=backend_dir
    )
    processes.append(backend_proc)
    print(f"      ✓ 后端 API: http://0.0.0.0:{backend_port}")
    print(f"      ✓ API 文档: http://0.0.0.0:{backend_port}/docs")
    time.sleep(3)  # 等待后端启动
    
    # 2. 启动 FRP 插件
    print(f"\n[2/{service_count}] 启动 FRP 插件...")
    
    # 创建临时配置文件，使用动态后端端口
    plugin_config_template = plugin_dir / "config" / "frps-panel.toml"
    plugin_config_temp = plugin_dir / "frps-panel-temp.toml"
    
    try:
        # 读取模板配置并替换后端 URL
        with open(plugin_config_template, 'r', encoding='utf-8') as f:
            config_content = f.read()
        
        # 替换后端 URL 和插件端口
        config_content = config_content.replace(
            'backend_url = "http://127.0.0.1:8000"',
            f'backend_url = "http://127.0.0.1:{backend_port}"'
        ).replace(
            'plugin_port = 7200',
            f'plugin_port = {plugin_port}'
        )
        
        # 写入临时配置
        with open(plugin_config_temp, 'w', encoding='utf-8') as f:
            f.write(config_content)
        
        print(f"      ✓ 配置文件: {plugin_config_temp}")
    except Exception as e:
        print(f"      ✗ 创建配置失败: {e}")
        cleanup()
        sys.exit(1)
    
    plugin_cmd = [str(plugin_exe.absolute()), "-c", str(plugin_config_temp.absolute())]
    plugin_proc = subprocess.Popen(
        plugin_cmd,
        cwd=plugin_dir
    )
    processes.append(plugin_proc)
    print(f"      ✓ 插件服务: http://127.0.0.1:{plugin_port}")
    print(f"      ✓ 后端地址: http://127.0.0.1:{backend_port}")
    time.sleep(2)  # 等待插件启动
    
    # 3. 启动 frps（如果可用）
    if not skip_frps:
        print(f"\n[3/{service_count}] 启动 FRP 服务端...")
        frps_cmd = [str(frps_exe), "-c", str(frps_config)]
        frps_proc = subprocess.Popen(
            frps_cmd,
            cwd=frps_exe.parent
        )
        processes.append(frps_proc)
        print("      ✓ FRP 服务: 0.0.0.0:7000")
    
    print()
    print("=" * 70)
    print("服务启动完成！")
    print("=" * 70)
    print()
    print("运行中的服务:")
    print(f"  • 后端 API:    http://localhost:{backend_port}")
    print(f"  • API 文档:    http://localhost:{backend_port}/docs")
    print(f"  • FRP 插件:    http://127.0.0.1:{plugin_port}")
    if not skip_frps:
        print("  • FRP 服务端:  0.0.0.0:7000")
    else:
        print("  • FRP 服务端:  [未启动 - 需要下载对应平台的 frps]")
    print()
    print("前端服务请单独启动:")
    print("  cd frontend && npm run dev")
    print()
    print("按 Ctrl+C 停止所有服务")
    print("=" * 70)
    print()
    
    # 等待进程
    try:
        while True:
            for i, proc in enumerate(processes):
                if proc.poll() is not None:
                    if skip_frps:
                        service_names = ["后端服务", "FRP 插件"]
                    else:
                        service_names = ["后端服务", "FRP 插件", "FRP 服务端"]
                    print(f"\n警告: {service_names[i]} 已停止 (退出码: {proc.returncode})")
                    cleanup()
                    sys.exit(1)
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()

if __name__ == "__main__":
    main()
