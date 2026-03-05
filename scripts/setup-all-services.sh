#!/bin/bash

# FRP 服务器和 Panel 插件统一部署脚本

set -e

echo "=========================================="
echo "  FRP 服务器 + Panel 插件 系统服务配置"
echo "=========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. 配置 FRP 服务器
echo "步骤 1/2: 配置 FRP 服务器..."
echo "----------------------------------------"
if [ -f "$SCRIPT_DIR/setup-frps-service.sh" ]; then
    bash "$SCRIPT_DIR/setup-frps-service.sh"
    echo ""
else
    echo "错误: 找不到 setup-frps-service.sh"
    exit 1
fi

# 等待 FRP 服务器完全启动
echo "等待 FRP 服务器启动..."
sleep 3

# 2. 配置 FRP Panel 插件
echo "步骤 2/2: 配置 FRP Panel 插件..."
echo "----------------------------------------"
if [ -f "$SCRIPT_DIR/setup-frps-panel-service.sh" ]; then
    bash "$SCRIPT_DIR/setup-frps-panel-service.sh"
    echo ""
else
    echo "错误: 找不到 setup-frps-panel-service.sh"
    exit 1
fi

# 显示最终状态
echo ""
echo "=========================================="
echo "  部署完成 - 服务状态总览"
echo "=========================================="
echo ""

echo "FRP 服务器状态:"
systemctl status frps.service --no-pager | head -n 5
echo ""

echo "FRP Panel 插件状态:"
systemctl status frps-panel.service --no-pager | head -n 5
echo ""

echo "=========================================="
echo "  快速管理命令"
echo "=========================================="
echo ""
echo "查看所有服务状态:"
echo "  systemctl status frps frps-panel"
echo ""
echo "重启所有服务:"
echo "  systemctl restart frps frps-panel"
echo ""
echo "查看系统日志:"
echo "  journalctl -u frps -u frps-panel -f"
echo ""
echo "查看应用日志:"
echo "  tail -f /var/log/frp/frps.log"
echo "  tail -f /var/log/frp/frps-panel.log"
echo ""
echo "查看错误日志:"
echo "  tail -f /var/log/frp/frps-error.log"
echo "  tail -f /var/log/frp/frps-panel-error.log"
echo ""
echo "查看所有日志:"
echo "  tail -f /var/log/frp/*.log"
echo ""
echo "停止所有服务:"
echo "  systemctl stop frps-panel frps"
echo ""
