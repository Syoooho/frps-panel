#!/bin/bash

# FRP SaaS Platform - 仓库清理脚本
# 用于移除不应该提交到 Git 的文件

echo "🧹 开始清理仓库..."

# 1. 从 Git 历史中移除数据库文件（但保留本地文件）
echo "📦 移除数据库文件..."
if [ -f "backend/frps_panel.db" ]; then
    git rm --cached backend/frps_panel.db 2>/dev/null || echo "  数据库文件未在 Git 中追踪"
fi

# 2. 从 Git 历史中移除 FRP 二进制文件
echo "📦 移除 FRP 二进制文件..."
if [ -d "frp_0.67.0_linux_amd64" ]; then
    git rm -r --cached frp_0.67.0_linux_amd64 2>/dev/null || echo "  FRP 目录未在 Git 中追踪"
fi

# 3. 移除可能存在的日志文件
echo "📦 移除日志文件..."
git rm -r --cached backend/logs/ 2>/dev/null || echo "  日志目录未在 Git 中追踪"

# 4. 移除环境配置文件
echo "📦 移除环境配置文件..."
git rm --cached backend/.env 2>/dev/null || echo "  backend/.env 未在 Git 中追踪"
git rm --cached frontend/.env 2>/dev/null || echo "  frontend/.env 未在 Git 中追踪"

# 5. 移除 node_modules（如果被误提交）
echo "📦 移除 node_modules..."
git rm -r --cached frontend/node_modules/ 2>/dev/null || echo "  node_modules 未在 Git 中追踪"

# 6. 移除 Python 虚拟环境
echo "📦 移除 Python 虚拟环境..."
git rm -r --cached backend/.venv/ 2>/dev/null || echo "  .venv 未在 Git 中追踪"

# 7. 移除构建产物
echo "📦 移除构建产物..."
git rm -r --cached frontend/dist/ 2>/dev/null || echo "  frontend/dist 未在 Git 中追踪"
git rm -r --cached frontend/.vite/ 2>/dev/null || echo "  frontend/.vite 未在 Git 中追踪"

echo ""
echo "✅ 清理完成！"
echo ""
echo "📝 下一步操作："
echo "1. 检查清理结果: git status"
echo "2. 提交更改: git commit -m 'chore: 清理不应提交的文件'"
echo "3. 推送到远程: git push"
echo ""
echo "⚠️  注意："
echo "- 本地文件不会被删除，只是从 Git 追踪中移除"
echo "- 确保 .gitignore 已正确配置"
echo "- 如需彻底清理 Git 历史，请使用 git filter-branch 或 BFG Repo-Cleaner"
