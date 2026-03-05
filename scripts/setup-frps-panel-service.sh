#!/bin/bash

# FRP Panel 插件 systemd 服务配置脚本

set -e

echo "=== 配置 FRP Panel 插件为系统服务 ==="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 配置变量
PANEL_DIR="/opt/frps-panel-linux-amd64-2.0.0"
PANEL_BIN="$PANEL_DIR/frps-panel"
PANEL_CONFIG="$PANEL_DIR/frps-panel.toml"
SERVICE_FILE="/etc/systemd/system/frps-panel.service"

# 检查 frps-panel 是否存在
if [ ! -f "$PANEL_BIN" ]; then
    echo "错误: 找不到 frps-panel 可执行文件: $PANEL_BIN"
    exit 1
fi

# 检查配置文件是否存在
if [ ! -f "$PANEL_CONFIG" ]; then
    echo "错误: 找不到配置文件: $PANEL_CONFIG"
    exit 1
fi

# 赋予执行权限
chmod +x "$PANEL_BIN"
echo "✓ 已设置 frps-panel 执行权限"

# 创建日志目录
mkdir -p /var/log/frp
echo "✓ 已创建日志目录: /var/log/frp"

# 创建 systemd 服务文件
cat > "$SERVICE_FILE" << 'EOF'
[Unit]
Description=FRP Panel Plugin Service
After=network.target frps.service
Wants=network.target
Requires=frps.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/frps-panel-linux-amd64-2.0.0
Restart=on-failure
RestartSec=5s
ExecStart=/opt/frps-panel-linux-amd64-2.0.0/frps-panel -c /opt/frps-panel-linux-amd64-2.0.0/frps-panel.toml
ExecReload=/bin/kill -HUP $MAINPID
StandardOutput=append:/var/log/frp/frps-panel.log
StandardError=append:/var/log/frp/frps-panel-error.log
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

echo "✓ 已创建 systemd 服务文件: $SERVICE_FILE"

# 重新加载 systemd 配置
systemctl daemon-reload
echo "✓ 已重新加载 systemd 配置"

# 启用服务(开机自启)
systemctl enable frps-panel.service
echo "✓ 已启用 frps-panel 服务(开机自启)"

# 启动服务
systemctl start frps-panel.service
echo "✓ 已启动 frps-panel 服务"

# 等待服务启动
sleep 2

# 检查服务状态
if systemctl is-active --quiet frps-panel.service; then
    echo ""
    echo "=== FRP Panel 插件启动成功 ==="
    echo ""
    systemctl status frps-panel.service --no-pager
    echo ""
    echo "常用命令:"
    echo "  启动服务: systemctl start frps-panel"
    echo "  停止服务: systemctl stop frps-panel"
    echo "  重启服务: systemctl restart frps-panel"
    echo "  查看状态: systemctl status frps-panel"
    echo "  查看系统日志: journalctl -u frps-panel -f"
    echo "  查看应用日志: tail -f /var/log/frp/frps-panel.log"
    echo "  查看错误日志: tail -f /var/log/frp/frps-panel-error.log"
    echo "  禁用自启: systemctl disable frps-panel"
else
    echo ""
    echo "=== 服务启动失败,请查看日志 ==="
    echo ""
    journalctl -u frps-panel.service -n 50 --no-pager
    exit 1
fi
