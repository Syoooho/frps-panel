#!/bin/bash
# 服务器初始化脚本
# 在服务器上首次部署前运行此脚本

set -e

echo "🚀 开始初始化服务器环境..."

# 更新系统
echo "📦 更新系统包..."
apt-get update
apt-get upgrade -y

# 安装基础依赖
echo "📦 安装基础依赖..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    sqlite3

# 安装 uv (Python 包管理器)
echo "📦 检查 uv..."
if ! command -v uv &> /dev/null; then
    echo "安装 uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
    echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
    # 创建系统级软链接
    ln -sf $HOME/.cargo/bin/uv /usr/local/bin/uv || true
else
    echo "✅ uv 已安装"
fi

# 创建应用目录
echo "📁 创建应用目录..."
mkdir -p /opt/frps-panel
mkdir -p /opt/frps-panel/logs

# 配置防火墙
echo "🔥 配置防火墙..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7000/tcp  # FRP 服务端口
ufw allow 7200/tcp  # FRP 插件端口
ufw allow 8000/tcp  # 后端 API 端口（可选，仅用于调试）

# 创建环境配置文件
echo "⚙️  创建环境配置..."
cat > /opt/frps-panel/.env << 'EOF'
# 数据库配置
DATABASE_URL=sqlite:///./frps_panel.db

# JWT 配置
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS 配置
CORS_ORIGINS=["*"]

# FRP 服务器配置
FRP_SERVER_ADDR=your-server-ip
FRP_SERVER_PORT=7000
EOF

echo "✅ 服务器初始化完成！"
echo ""
echo "📝 下一步操作："
echo "1. 编辑 /opt/frps-panel/.env 文件，修改配置"
echo "2. 在 GitHub 仓库设置中配置 Secrets："
echo "   - SERVER_IP: 服务器 IP 地址"
echo "   - SSH_KEY: SSH 私钥"
echo "3. 推送代码到 main/master 分支触发自动部署"
echo ""
echo "🔗 访问地址："
echo "   前端: http://$(curl -s ifconfig.me)"
echo "   API 文档: http://$(curl -s ifconfig.me)/docs"
