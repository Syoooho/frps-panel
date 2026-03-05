#!/bin/bash

# FRP 配置检查和修复脚本

set -e

echo "=== FRP 配置检查和修复 ==="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

FRP_CONFIG="/opt/frp/frps.toml"
FRP_CONFIG_BACKUP="/opt/frp/frps.toml.backup.$(date +%Y%m%d_%H%M%S)"

# 检查配置文件是否存在
if [ ! -f "$FRP_CONFIG" ]; then
    echo "错误: 找不到配置文件: $FRP_CONFIG"
    exit 1
fi

# 备份原配置
cp "$FRP_CONFIG" "$FRP_CONFIG_BACKUP"
echo "✓ 已备份原配置到: $FRP_CONFIG_BACKUP"

# 显示当前配置
echo ""
echo "当前配置内容:"
echo "----------------------------------------"
cat "$FRP_CONFIG"
echo "----------------------------------------"
echo ""

# 检查是否需要修复
NEED_FIX=0

# 检查 Dashboard 地址
if grep -q 'webServer.addr.*=.*"127.0.0.1"' "$FRP_CONFIG"; then
    echo "⚠ 发现问题: Dashboard 监听在 127.0.0.1,外网无法访问"
    NEED_FIX=1
elif ! grep -q 'webServer.addr' "$FRP_CONFIG"; then
    echo "⚠ 发现问题: 未配置 Dashboard 地址"
    NEED_FIX=1
fi

# 检查日志配置
if ! grep -q 'log.to' "$FRP_CONFIG"; then
    echo "⚠ 发现问题: 未配置日志文件路径"
    NEED_FIX=1
fi

if ! grep -q 'log.level' "$FRP_CONFIG"; then
    echo "⚠ 发现问题: 未配置日志级别"
    NEED_FIX=1
fi

if [ $NEED_FIX -eq 0 ]; then
    echo "✓ 配置检查通过,无需修复"
    exit 0
fi

echo ""
read -p "是否自动修复配置? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消修复"
    exit 0
fi

# 创建日志目录
mkdir -p /var/log/frp
echo "✓ 已创建日志目录"

# 修复配置
echo "正在修复配置..."

# 修复 Dashboard 地址
if grep -q 'webServer.addr' "$FRP_CONFIG"; then
    sed -i 's/webServer.addr.*=.*"127.0.0.1"/webServer.addr = "0.0.0.0"/' "$FRP_CONFIG"
    echo "✓ 已修复 Dashboard 监听地址为 0.0.0.0"
else
    # 如果没有 webServer 配置,添加完整配置
    if ! grep -q '\[webServer\]' "$FRP_CONFIG" && ! grep -q 'webServer\.' "$FRP_CONFIG"; then
        cat >> "$FRP_CONFIG" << 'EOF'

# Dashboard 配置
webServer.addr = "0.0.0.0"
webServer.port = 7200
webServer.user = "admin"
webServer.password = "admin"
EOF
        echo "✓ 已添加 Dashboard 配置"
    fi
fi

# 添加或修复日志配置
if ! grep -q 'log.to' "$FRP_CONFIG"; then
    if grep -q '\[log\]' "$FRP_CONFIG"; then
        sed -i '/\[log\]/a to = "/var/log/frp/frps-app.log"' "$FRP_CONFIG"
    elif grep -q 'log\.' "$FRP_CONFIG"; then
        sed -i '/log\./i log.to = "/var/log/frp/frps-app.log"' "$FRP_CONFIG"
    else
        cat >> "$FRP_CONFIG" << 'EOF'

# 日志配置
log.to = "/var/log/frp/frps-app.log"
log.level = "info"
log.maxDays = 7
EOF
    fi
    echo "✓ 已添加日志文件配置"
fi

if ! grep -q 'log.level' "$FRP_CONFIG"; then
    if grep -q 'log.to' "$FRP_CONFIG"; then
        sed -i '/log.to/a log.level = "info"' "$FRP_CONFIG"
    fi
    echo "✓ 已添加日志级别配置"
fi

if ! grep -q 'log.maxDays' "$FRP_CONFIG"; then
    if grep -q 'log.level' "$FRP_CONFIG"; then
        sed -i '/log.level/a log.maxDays = 7' "$FRP_CONFIG"
    fi
    echo "✓ 已添加日志保留天数配置"
fi

echo ""
echo "修复后的配置:"
echo "----------------------------------------"
cat "$FRP_CONFIG"
echo "----------------------------------------"
echo ""

# 重启服务
echo "正在重启 FRP 服务..."
systemctl restart frps

sleep 2

# 检查服务状态
if systemctl is-active --quiet frps; then
    echo "✓ FRP 服务重启成功"
    echo ""
    
    # 检查端口监听
    echo "端口监听情况:"
    ss -tlnp | grep frps || echo "未找到监听端口"
    echo ""
    
    # 显示日志
    echo "最近的日志:"
    echo "----------------------------------------"
    if [ -f /var/log/frp/frps-app.log ]; then
        tail -n 20 /var/log/frp/frps-app.log
    else
        journalctl -u frps -n 20 --no-pager
    fi
    echo "----------------------------------------"
    echo ""
    
    echo "测试命令:"
    echo "  本地测试: curl http://127.0.0.1:7200/"
    echo "  外网测试: curl http://$(curl -s ifconfig.me):7200/"
    echo ""
    echo "如果外网无法访问,请检查:"
    echo "  1. 防火墙: firewall-cmd --list-ports"
    echo "  2. 安全组: 阿里云控制台检查 7200 端口是否开放"
else
    echo "✗ FRP 服务启动失败"
    echo ""
    journalctl -u frps -n 50 --no-pager
    exit 1
fi
