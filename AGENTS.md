<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# FRP SaaS Platform

## 项目概述

基于 frp 的内网穿透 SaaS 平台，面向个人开发者提供服务。该项目包含完整的前后端系统、FRP 插件以及管理后台，支持用户注册、兑换码激活、隧道管理等功能。

## 核心文件

| 文件 | 描述 |
|------|------|
| `README.md` | 项目英文说明文档 |
| `README_zh.md` | 项目中文说明文档（原 frps-panel 插件文档） |
| `LICENSE` | MIT 开源协议 |
| `.gitignore` | Git 忽略配置 |

## 子目录

| 目录 | 用途 |
|------|------|
| `backend/` | FastAPI 后端服务 (详见 `backend/AGENTS.md`) |
| `frontend/` | React 前端应用 (详见 `frontend/AGENTS.md`) |
| `frp-plugin/` | Go 语言编写的 FRP 插件 (详见 `frp-plugin/AGENTS.md`) |
| `docs/` | 项目文档和设计方案 (详见 `docs/AGENTS.md`) |
| `scripts/` | 工具脚本 (详见 `scripts/AGENTS.md`) |
| `design-system/` | UI 设计系统 (详见 `design-system/AGENTS.md`) |
| `screenshots/` | 项目截图资源 |

## AI Agent 工作指南

### 在此目录工作时

- 这是项目根目录，包含整体配置和文档
- 修改 README 时需同时考虑中英文版本
- 新增功能前应先查看 `docs/plans/` 中的设计文档

### 测试要求

- 后端测试：`cd backend && pytest`
- 前端测试：`cd frontend && npm test`
- 插件测试：`cd frp-plugin && make test`

### 常见模式

- 使用 uv 管理 Python 环境
- 使用 npm 管理前端依赖
- 使用 Go modules 管理插件依赖
- 配置文件使用 `.env.example` 作为模板

## 依赖关系

### 内部依赖

- `frontend` → `backend` (API 调用)
- `backend` → `frp-plugin` (插件通信)
- 所有模块 → `docs` (设计文档参考)

### 外部依赖

- **后端**: FastAPI, SQLAlchemy, Alembic, bcrypt, python-jose, email-validator
- **前端**: React, Vite, Tailwind CSS, Zustand, React Router, React Hook Form
- **插件**: Go 1.21+, frp >= 0.52.0

## 项目特性

- 用户注册和邮箱登录
- 兑换码激活订阅（月付10端口，年付100端口）
- 隧道管理（TCP/UDP/HTTP/HTTPS）
- 管理员后台
- 流量不限
- 多用户鉴权
- 端口、域名、二级域名限制

## 开发状态

### 已完成功能 ✅

- **项目骨架搭建**
  - 前端环境（React + TypeScript + Vite + Tailwind CSS）
  - 后端环境（FastAPI + SQLAlchemy + SQLite）
  - 数据库初始化（5个核心表）
  
- **用户认证系统**
  - 用户注册（邮箱 + 密码）
  - 用户登录（JWT Token）
  - 管理员登录
  - 密码哈希（bcrypt）
  - Token刷新机制
  - 前端状态管理（Zustand）

### 开发中功能 🚧

- 兑换码激活系统
- 隧道管理功能
- 用户仪表板
- 管理员后台

### 待开发功能 📋

- 订阅管理
- 配额控制
- Go插件改造
- 邮件通知
- 多节点支持

## 快速启动

### 后端服务
```bash
cd backend
uv run uvicorn app.main:app --reload
# 访问 http://localhost:8000
# API文档 http://localhost:8000/docs
```

### 前端应用
```bash
cd frontend
npm run dev
# 访问 http://localhost:3000
```

### 测试账号
- 管理员：admin@example.com / admin123
- 测试用户：test@example.com / test1234

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
