#!/bin/bash
# 本地部署测试脚本
# 用于在推送到 GitHub 之前本地测试部署流程

set -e

echo "🧪 开始本地部署测试..."

# 检查依赖
echo "📋 检查依赖..."
command -v node >/dev/null 2>&1 || { echo "❌ 需要安装 Node.js"; exit 1; }
command -v go >/dev/null 2>&1 || { echo "❌ 需要安装 Go"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ 需要安装 Python3"; exit 1; }

# 清理旧的构建
echo "🧹 清理旧的构建..."
rm -rf deploy/

# 创建部署目录
mkdir -p deploy

# 构建前端
echo "📱 构建前端..."
cd frontend
npm ci
npm run build
cd ..
cp -r frontend/dist deploy/frontend

# 构建插件
echo "🔌 构建插件..."
cd frp-plugin
go mod download
GOOS=linux GOARCH=amd64 go build -o ../deploy/frps-panel-linux-amd64 ./cmd/frps-panel
cd ..

# 复制后端
echo "🔧 复制后端..."
cp -r backend deploy/backend

# 复制配置文件
echo "⚙️  复制配置文件..."
cp frp-plugin/config/*.toml deploy/ 2>/dev/null || true

# 显示构建结果
echo ""
echo "✅ 本地构建完成！"
echo ""
echo "📦 构建产物:"
ls -lh deploy/
echo ""
echo "📁 目录结构:"
tree -L 2 deploy/ 2>/dev/null || find deploy/ -maxdepth 2 -print
echo ""
echo "💡 提示:"
echo "1. 检查 deploy/ 目录中的文件是否正确"
echo "2. 如果一切正常，可以推送代码触发自动部署"
echo "3. 推送命令: git push origin main"
