#!/bin/bash

# 安全配置部署脚本
# 一键部署 HTTPS + 安全增强配置

set -e

echo "=== FRP SaaS Platform 安全配置部署 ==="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 权限运行此脚本"
    echo "使用: sudo $0"
    exit 1
fi

# 配置变量
PROJECT_DIR="/opt/frps-panel"
NGINX_CONF="/etc/nginx/sites-available/frps-panel-security"
NGINX_ENABLED="/etc/nginx/sites-enabled/frps-panel-security"
OLD_NGINX_CONF="/etc/nginx/sites-enabled/frps-panel"

# 步骤 1: 生成 SSL 证书
echo "步骤 1/5: 生成 SSL 证书"
if [ ! -f "$PROJECT_DIR/ssl/server.crt" ]; then
    bash "$(dirname "$0")/generate-ssl-cert.sh"
else
    echo "SSL 证书已存在，跳过生成"
fi
echo ""

# 步骤 2: 备份现有配置
echo "步骤 2/5: 备份现有配置"
BACKUP_DIR="$PROJECT_DIR/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "$OLD_NGINX_CONF" ]; then
    cp "$OLD_NGINX_CONF" "$BACKUP_DIR/nginx.conf.bak"
    echo "已备份 Nginx 配置到: $BACKUP_DIR/nginx.conf.bak"
fi

if [ -f "$PROJECT_DIR/backend/.env" ]; then
    cp "$PROJECT_DIR/backend/.env" "$BACKUP_DIR/.env.bak"
    echo "已备份环境配置到: $BACKUP_DIR/.env.bak"
fi
echo ""

# 步骤 3: 部署 Nginx 安全配置
echo "步骤 3/5: 部署 Nginx 安全配置"
cp "$(dirname "$0")/nginx-security.conf" "$NGINX_CONF"

# 禁用旧配置
if [ -L "$OLD_NGINX_CONF" ]; then
    rm "$OLD_NGINX_CONF"
    echo "已禁用旧的 Nginx 配置"
fi

# 启用新配置
ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
echo "已启用新的安全配置"
echo ""

# 步骤 4: 修改后端监听地址
echo "步骤 4/5: 修改后端监听地址"
if [ -f "$PROJECT_DIR/backend/.env" ]; then
    # 修改 HOST 为 127.0.0.1
    sed -i 's/^HOST=.*/HOST=127.0.0.1/' "$PROJECT_DIR/backend/.env"
    echo "已将后端监听地址改为 127.0.0.1"
else
    echo "警告: 未找到 .env 文件，请手动修改 HOST=127.0.0.1"
fi
echo ""

# 步骤 5: 测试并重启服务
echo "步骤 5/5: 测试并重启服务"

# 测试 Nginx 配置
echo "测试 Nginx 配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx 配置测试通过"
    
    # 重启 Nginx
    echo "重启 Nginx..."
    systemctl restart nginx
    
    # 重启后端服务
    echo "重启后端服务..."
    systemctl restart frps-panel-backend
    
    echo ""
    echo "=== 部署完成 ==="
    echo ""
    echo "访问地址: https://YOUR_SERVER_IP:8443"
    echo "HTTP 重定向: http://YOUR_SERVER_IP:8080 -> https://YOUR_SERVER_IP:8443"
    echo ""
    echo "注意事项:"
    echo "1. 首次访问会显示证书不安全警告，点击'高级' -> '继续访问'"
    echo "2. 后端现在只监听 127.0.0.1:8000，外部无法直接访问"
    echo "3. 登录接口限流: 每分钟最多 5 次尝试"
    echo "4. API 接口限流: 每秒最多 10 个请求"
    echo "5. 备份文件位置: $BACKUP_DIR"
    echo ""
    echo "查看服务状态:"
    echo "  sudo systemctl status nginx"
    echo "  sudo systemctl status frps-panel-backend"
    echo ""
    echo "查看日志:"
    echo "  sudo tail -f /var/log/nginx/frps-panel-access.log"
    echo "  sudo tail -f /var/log/nginx/frps-panel-error.log"
    echo ""
else
    echo "错误: Nginx 配置测试失败"
    echo "请检查配置文件: $NGINX_CONF"
    exit 1
fi
