#!/bin/bash

# FRP 服务器 systemd 服务配置脚本

set -e

echo "=== 配置 FRP 服务器为系统服务 ==="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 配置变量
FRP_DIR="/opt/frp"
FRP_BIN="$FRP_DIR/frps"
FRP_CONFIG="$FRP_DIR/frps.toml"
SERVICE_FILE="/etc/systemd/system/frps.service"

# 检查 frps 是否存在
if [ ! -f "$FRP_BIN" ]; then
    echo "错误: 找不到 frps 可执行文件: $FRP_BIN"
    exit 1
fi

# 检查配置文件是否存在
if [ ! -f "$FRP_CONFIG" ]; then
    echo "错误: 找不到配置文件: $FRP_CONFIG"
    exit 1
fi

# 赋予执行权限
chmod +x "$FRP_BIN"
echo "✓ 已设置 frps 执行权限"

# 创建日志目录
mkdir -p /var/log/frp
echo "✓ 已创建日志目录: /var/log/frp"

# 创建 systemd 服务文件
cat > "$SERVICE_FILE" << 'EOF'
[Unit]
Description=FRP Server Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/opt/frp/frps -c /opt/frp/frps.toml
ExecReload=/bin/kill -HUP $MAINPID
StandardOutput=append:/var/log/frp/frps.log
StandardError=append:/var/log/frp/frps-error.log
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

echo "✓ 已创建 systemd 服务文件: $SERVICE_FILE"

# 重新加载 systemd 配置
systemctl daemon-reload
echo "✓ 已重新加载 systemd 配置"

# 启用服务(开机自启)
systemctl enable frps.service
echo "✓ 已启用 frps 服务(开机自启)"

# 启动服务
systemctl start frps.service
echo "✓ 已启动 frps 服务"

# 等待服务启动
sleep 2

# 检查服务状态
if systemctl is-active --quiet frps.service; then
    echo ""
    echo "=== FRP 服务器启动成功 ==="
    echo ""
    systemctl status frps.service --no-pager
    echo ""
    echo "常用命令:"
    echo "  启动服务: systemctl start frps"
    echo "  停止服务: systemctl stop frps"
    echo "  重启服务: systemctl restart frps"
    echo "  查看状态: systemctl status frps"
    echo "  查看系统日志: journalctl -u frps -f"
    echo "  查看应用日志: tail -f /var/log/frp/frps.log"
    echo "  查看错误日志: tail -f /var/log/frp/frps-error.log"
    echo "  禁用自启: systemctl disable frps"
else
    echo ""
    echo "=== 服务启动失败,请查看日志 ==="
    echo ""
    journalctl -u frps.service -n 50 --no-pager
    exit 1
fi
