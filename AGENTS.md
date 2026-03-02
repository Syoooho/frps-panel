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

- **前端完整实现**
  - 类型系统（TypeScript 类型定义）
  - 工具函数（格式化、验证）
  - 自定义 Hooks（Toast、Confirm）
  - API 服务层（认证、隧道、订阅、管理员）
  - UI 组件库（Button、Card、Modal、Input 等）
  - 用户页面（登录、注册、仪表板、隧道管理、激活、个人信息）
  - 管理员页面（概览、用户管理、兑换码管理、系统配置）
  - 路由配置和权限控制

- **后端完整实现**
  - 认证 API（注册、登录、用户信息）
  - 隧道管理 API（CRUD、配额检查）
  - 订阅管理 API（查询、激活）
  - 兑换码系统 API（生成、查询、删除）
  - 管理员 API（用户管理、统计数据）
  - FRP 插件 API（Login、NewProxy、CloseProxy、Ping）
  - 仪表板 API（用户统计数据）
  - 业务服务层（Auth、Tunnel、Subscription、Admin、FRP、Monitor）
  - 数据库模型（User、Tunnel、Subscription、ActivationCode）
  - 数据初始化脚本
  - API 测试脚本

- **前后端联调**
  - 环境配置（CORS、API 地址）
  - API 集成测试（100% 通过）
  - Bug 修复（字段名统一、API 调用方式）
  - 测试文档（backend/tests/test_integration.md）

- **API 文档**
  - 认证 API 文档
  - 隧道管理 API 文档
  - 订阅管理 API 文档
  - 管理员 API 文档
  - Swagger UI 自动文档

- **Go 插件改造**
  - 插件主程序（Go 1.21+）
  - 配置管理系统
  - HTTP 服务器实现
  - 请求转发到后端 API
  - 用户 FRP Token 系统
  - 隧道状态管理
  - 配置文件示例（frps、frpc、frps-panel）

- **系统监控和日志**
  - 结构化日志系统（app.log、error.log、access.log）
  - 日志文件自动轮转（10MB/文件，保留5-10个备份）
  - 请求日志中间件（记录所有 API 请求和响应时间）
  - 系统资源监控（CPU、内存、磁盘使用率）
  - 隧道状态统计（总数、在线、离线、按类型统计）
  - 用户活跃度统计（总数、活跃、新增）
  - 订阅状态统计（总数、有效、过期、即将过期）
  - 监控 API（需管理员权限）
  - 管理员监控页面（实时数据展示，30秒自动刷新）

- **隧道配置复制功能**
  - 自动生成 frpc 配置文件
  - 包含用户认证信息和隧道参数
  - 一键复制到剪贴板
  - 服务器地址可在系统配置中修改

- **系统配置管理**
  - FRP 服务器地址配置
  - FRP 服务器端口配置
  - 配置持久化到 .env 文件
  - 管理员专属功能

- **隧道编辑功能**
  - 支持编辑已创建的隧道
  - 端口冲突检查（创建和编辑时）
  - 自动分配可用端口（TCP/UDP）
  - 详细错误提示

- **统一布局系统**
  - 管理员和普通用户共用布局
  - 根据用户角色动态显示菜单
  - 管理员额外菜单：系统监控、用户管理、兑换码管理、系统配置
  - 视觉区分（管理员显示红色盾牌图标）

### 开发中功能 🚧

无

### 待开发功能 📋

- WebSocket 实时状态推送
- 邮件通知系统
- 多节点支持

## 快速启动

### 初始化数据库
```bash
cd backend
uv run python -m app.init_db
```

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

### 联调测试
```bash
# 后端 API 测试
cd backend
uv run python tests/test_api.py

# FRP 插件 API 测试
cd backend
uv run python tests/test_frp_api.py

# 系统监控 API 测试
cd backend
uv run python tests/test_monitor_api.py

# 前端测试
# 浏览器访问 http://localhost:3000
# 参考 backend/tests/test_integration.md 进行完整测试
```

### 日志查看
```bash
# 查看应用日志
cd backend
tail -f logs/app.log

# 查看访问日志
tail -f logs/access.log

# 查看错误日志
tail -f logs/error.log
```

### FRP 插件
```bash
# 构建插件
cd frp-plugin
make build

# 运行插件
./frps-panel -c ./config/frps-panel.toml
```

### 测试账号
- 管理员：admin@example.com / admin123
- 测试用户：test@example.com / test1234（带月付订阅）
- 测试用户 FRP Token：在个人信息页面查看
- 测试兑换码：MONTHLY-TEST-0000 ~ 0004（月付）
- 测试兑换码：YEARLY-TEST-0000 ~ 0004（年付）

## 测试报告

详见 [backend/tests/test_integration.md](./backend/tests/test_integration.md) - 前后端联调测试报告

### 测试结果
- ✅ 后端 API 测试 100% 通过
- ✅ 用户认证功能正常
- ✅ 隧道管理功能正常
- ✅ 管理员功能正常
- ✅ JWT Token 认证正常
- ✅ FRP 插件 API 测试通过
- ✅ 系统监控 API 测试通过
- ✅ 日志系统正常运行
- ✅ 仪表板数据显示正常

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
