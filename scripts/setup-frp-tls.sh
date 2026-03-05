#!/bin/bash

# FRP TLS 配置脚本
# 为 FRP 服务器启用 TLS 加密

set -e

echo "=== FRP TLS 配置工具 ==="
echo ""

# 配置变量
FRP_DIR="/opt/frps-panel/frp"
CERT_DIR="$FRP_DIR/certs"
FRP_CONFIG="$FRP_DIR/frps.toml"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 root 权限运行此脚本"
    echo "使用: sudo $0"
    exit 1
fi

# 创建证书目录
echo "1. 创建证书目录..."
mkdir -p "$CERT_DIR"

# 生成 TLS 证书
echo "2. 生成 TLS 证书..."
read -p "请输入服务器 IP 或域名: " SERVER_NAME

if [ -z "$SERVER_NAME" ]; then
    echo "错误: 服务器地址不能为空"
    exit 1
fi

# 生成私钥
openssl genrsa -out "$CERT_DIR/server.key" 2048

# 生成证书签名请求
openssl req -new -key "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.csr" \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=FRP/OU=IT/CN=$SERVER_NAME"

# 生成自签名证书
openssl x509 -req -days 3650 \
    -in "$CERT_DIR/server.csr" \
    -signkey "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt"

# 设置权限
chmod 600 "$CERT_DIR/server.key"
chmod 644 "$CERT_DIR/server.crt"

echo "✅ 证书生成完成"

# 备份现有配置
echo ""
echo "3. 备份现有 FRP 配置..."
if [ -f "$FRP_CONFIG" ]; then
    cp "$FRP_CONFIG" "$FRP_CONFIG.bak.$(date +%Y%m%d-%H%M%S)"
    echo "✅ 配置已备份"
fi

# 更新 FRP 配置
echo ""
echo "4. 更新 FRP 配置..."

# 检查配置文件是否存在
if [ ! -f "$FRP_CONFIG" ]; then
    echo "警告: FRP 配置文件不存在，创建新配置"
    cat > "$FRP_CONFIG" <<EOF
# FRP 服务器配置
bindPort = 7000
vhostHTTPPort = 80
vhostHTTPSPort = 443

# TLS 配置
transport.tls.force = false
transport.tls.certFile = "$CERT_DIR/server.crt"
transport.tls.keyFile = "$CERT_DIR/server.key"

# 认证配置
auth.method = "token"
auth.token = "your-token-here"

# 日志配置
log.to = "./frps.log"
log.level = "info"
log.maxDays = 7
EOF
else
    # 添加 TLS 配置到现有文件
    if ! grep -q "transport.tls" "$FRP_CONFIG"; then
        cat >> "$FRP_CONFIG" <<EOF

# TLS 配置
transport.tls.force = false
transport.tls.certFile = "$CERT_DIR/server.crt"
transport.tls.keyFile = "$CERT_DIR/server.key"
EOF
    else
        echo "TLS 配置已存在，跳过添加"
    fi
fi

echo "✅ 配置更新完成"

# 重启 FRP 服务
echo ""
echo "5. 重启 FRP 服务..."
if systemctl is-active --quiet frps; then
    systemctl restart frps
    echo "✅ FRP 服务已重启"
else
    echo "警告: FRP 服务未运行，请手动启动"
fi

echo ""
echo "=== 配置完成 ==="
echo ""
echo "证书位置:"
echo "  - 证书: $CERT_DIR/server.crt"
echo "  - 私钥: $CERT_DIR/server.key"
echo ""
echo "FRP 配置: $FRP_CONFIG"
echo ""
echo "客户端配置示例:"
echo "  [common]"
echo "  server_addr = $SERVER_NAME"
echo "  server_port = 7000"
echo "  tls_enable = true"
echo ""
echo "注意:"
echo "  - TLS 当前为可选模式 (force = false)"
echo "  - 客户端可以选择是否启用 TLS"
echo "  - 如需强制 TLS，修改配置: transport.tls.force = true"
echo ""
