# FRP SaaS Platform

基于frp的内网穿透SaaS平台，面向个人开发者提供服务。

## 项目结构

```
frps-panel/
├── backend/          # FastAPI后端服务
├── frontend/         # React前端应用
├── frp-plugin/       # Go FRP插件（待改造）
├── docs/             # 项目文档
└── scripts/          # 工具脚本
```

## 功能特性

- 用户注册和邮箱登录
- 兑换码激活订阅
- 按端口数量计费（月付10端口，年付100端口）
- 隧道管理（TCP/UDP/HTTP/HTTPS）
- 管理员后台
- 流量不限

## 快速开始

### 后端服务

```bash
cd backend
uv venv
uv pip install -e .
cp .env.example .env
# 编辑.env配置文件
uvicorn app.main:app --reload
```

### 前端应用

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 技术栈

- **后端**: FastAPI + SQLAlchemy + SQLite
- **前端**: React + TypeScript + Ant Design
- **插件**: Go (frps-panel)

## 文档

详细设计文档请查看 `docs/plans/` 目录。

## 开发状态

当前处于项目骨架搭建阶段，核心功能开发中。

## License

MIT
