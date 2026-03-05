#!/bin/bash

# SSL 证书生成脚本
# 用于生成自签名 SSL 证书

set -e

echo "=== SSL 证书生成工具 ==="
echo ""

# 配置变量
CERT_DIR="/opt/frps-panel/ssl"
CERT_DAYS=3650  # 10年有效期

# 获取服务器 IP
read -p "请输入服务器 IP 地址: " SERVER_IP

if [ -z "$SERVER_IP" ]; then
    echo "错误: IP 地址不能为空"
    exit 1
fi

# 创建证书目录
echo "创建证书目录..."
mkdir -p "$CERT_DIR"

# 生成私钥
echo "生成私钥..."
openssl genrsa -out "$CERT_DIR/server.key" 4096

# 生成证书签名请求配置
cat > "$CERT_DIR/cert.conf" <<EOF
[req]
default_bits = 4096
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C = CN
ST = Beijing
L = Beijing
O = FRP SaaS Platform
OU = IT Department
CN = $SERVER_IP

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = $SERVER_IP
EOF

# 生成证书
echo "生成证书..."
openssl req -new -x509 -key "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -days $CERT_DAYS \
    -config "$CERT_DIR/cert.conf" \
    -extensions v3_req

# 设置权限
chmod 600 "$CERT_DIR/server.key"
chmod 644 "$CERT_DIR/server.crt"

echo ""
echo "=== 证书生成完成 ==="
echo "证书位置: $CERT_DIR/server.crt"
echo "私钥位置: $CERT_DIR/server.key"
echo "有效期: $CERT_DAYS 天"
echo ""
echo "注意: 这是自签名证书，浏览器会显示不安全警告"
echo "用户首次访问时需要点击'高级' -> '继续访问'"
echo ""
