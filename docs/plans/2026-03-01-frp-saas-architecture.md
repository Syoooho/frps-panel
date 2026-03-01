# FRP SaaS平台 - 整体架构设计

## 项目概述

将现有的frps-panel改造为面向个人开发者的SaaS平台，提供内网穿透服务。

## 商业模式

- **目标用户**：个人开发者
- **计费方式**：按端口数量计费
  - 月付：10个端口
  - 年付：100个端口
  - 流量不限
- **支付方式**：线下支付 + 兑换码激活
- **管理方式**：管理员可配置计费详情

## 技术栈

- **前端**：React + Vite
- **后端**：FastAPI (Python)
- **数据库**：SQLite
- **现有服务**：Go (frps-panel插件)
- **部署方式**：前后端分离
- **环境管理**：uv

## 系统架构

```
┌─────────────────────────────────────────┐
│         用户前端 (React)                 │
│  - 用户注册/登录                         │
│  - 隧道管理面板                          │
│  - 兑换码激活                            │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│      管理前端 (React)                    │
│  - 用户管理                              │
│  - 兑换码生成                            │
│  - 系统配置                              │
│  - 统计报表                              │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│       FastAPI 后端服务                   │
│  ┌────────────────────────────────────┐ │
│  │  认证模块 (JWT)                    │ │
│  │  用户管理模块                      │ │
│  │  兑换码模块                        │ │
│  │  隧道管理模块                      │ │
│  │  配额控制模块                      │ │
│  └────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         SQLite 数据库                    │
│  - users (用户表)                        │
│  - activation_codes (兑换码表)           │
│  - subscriptions (订阅表)                │
│  - tunnels (隧道表)                      │
│  - system_config (系统配置表)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    现有 frps-panel (Go)                  │
│  - 保留现有的frp插件功能                 │
│  - 通过API与FastAPI后端通信              │
└──────────────────────────────────────────┘
```

## 集成策略

1. **保留现有Go代码**：作为frp插件层，负责与frps通信
2. **新建FastAPI后端**：处理业务逻辑（用户、计费、兑换码）
3. **Go插件调用FastAPI**：通过HTTP API验证用户权限和配额
4. **前端直接访问FastAPI**：不直接访问Go服务

## 核心功能模块

### 第一阶段 - MVP核心功能
1. 用户注册/登录系统（邮箱+密码）
2. 兑换码管理系统（管理员生成、用户激活）
3. 端口配额管理（月付10端口、年付100端口）
4. 用户隧道管理（创建/删除/查看隧道）
5. 基础的用户面板

### 第二阶段 - 增强功能
6. 流量统计和可视化
7. 隧道在线状态监控
8. 邮件通知（到期提醒等）
9. 用户使用文档/帮助中心

### 第三阶段 - 高级功能
10. 自定义域名绑定
11. API接口（供高级用户使用）
12. 多节点支持（不同地区服务器）
13. 工单系统

## 管理员后台功能

- 用户管理（查看/禁用/删除用户）
- 兑换码批量生成和管理
- 系统配置（端口数量、价格设置）
- 统计报表（用户数、活跃度、收入等）

## 项目目录结构

```
frps-panel/
│
├── backend/                           # FastAPI后端服务（新建）
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI应用入口
│   │   │
│   │   ├── api/                      # API路由层
│   │   │   ├── __init__.py
│   │   │   ├── deps.py               # 依赖注入（认证、数据库会话）
│   │   │   └── v1/                   # API版本1
│   │   │       ├── __init__.py
│   │   │       ├── auth.py           # 认证相关接口
│   │   │       ├── activation.py     # 兑换码接口
│   │   │       ├── subscription.py   # 订阅接口
│   │   │       ├── tunnels.py        # 隧道管理接口
│   │   │       ├── admin.py          # 管理员接口
│   │   │       └── frp.py            # FRP插件验证接口
│   │   │
│   │   ├── core/                     # 核心配置
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # 配置管理
│   │   │   ├── security.py           # JWT、密码哈希
│   │   │   └── database.py           # 数据库连接
│   │   │
│   │   ├── models/                   # SQLAlchemy数据模型
│   │   │   ├── __init__.py
│   │   │   ├── user.py               # 用户模型
│   │   │   ├── subscription.py       # 订阅模型
│   │   │   ├── activation_code.py    # 兑换码模型
│   │   │   ├── tunnel.py             # 隧道模型
│   │   │   └── system_config.py      # 系统配置模型
│   │   │
│   │   ├── schemas/                  # Pydantic数据验证模式
│   │   │   ├── __init__.py
│   │   │   ├── user.py               # 用户相关schema
│   │   │   ├── auth.py               # 认证相关schema
│   │   │   ├── subscription.py       # 订阅相关schema
│   │   │   ├── activation_code.py    # 兑换码相关schema
│   │   │   ├── tunnel.py             # 隧道相关schema
│   │   │   └── common.py             # 通用schema（响应格式）
│   │   │
│   │   ├── services/                 # 业务逻辑层
│   │   │   ├── __init__.py
│   │   │   ├── user_service.py       # 用户业务逻辑
│   │   │   ├── auth_service.py       # 认证业务逻辑
│   │   │   ├── activation_service.py # 兑换码业务逻辑
│   │   │   ├── subscription_service.py # 订阅业务逻辑
│   │   │   ├── tunnel_service.py     # 隧道业务逻辑
│   │   │   └── admin_service.py      # 管理员业务逻辑
│   │   │
│   │   └── utils/                    # 工具函数
│   │       ├── __init__.py
│   │       ├── code_generator.py     # 兑换码生成器
│   │       ├── email.py              # 邮件发送（可选）
│   │       └── validators.py         # 自定义验证器
│   │
│   ├── alembic/                      # 数据库迁移
│   │   ├── versions/                 # 迁移版本文件
│   │   ├── env.py
│   │   └── alembic.ini
│   │
│   ├── tests/                        # 测试文件（可选）
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_api/
│   │
│   ├── pyproject.toml                # uv项目配置
│   ├── .env.example                  # 环境变量示例
│   ├── .env                          # 环境变量（不提交）
│   └── README.md                     # 后端说明文档
│
├── frontend/                         # React前端应用（新建）
│   ├── public/                       # 静态资源
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/                   # 资源文件
│   │   │   ├── images/
│   │   │   └── styles/
│   │   │       └── global.css
│   │   │
│   │   ├── components/               # 通用组件
│   │   │   ├── common/               # 基础组件
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/               # 布局组件
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── tunnel/               # 隧道相关组件
│   │   │       ├── TunnelCard.tsx
│   │   │       ├── TunnelForm.tsx
│   │   │       └── TunnelList.tsx
│   │   │
│   │   ├── pages/                    # 页面组件
│   │   │   ├── auth/                 # 认证页面
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── dashboard/            # 用户仪表板
│   │   │   │   ├── Overview.tsx
│   │   │   │   ├── Tunnels.tsx
│   │   │   │   ├── Activate.tsx
│   │   │   │   └── Profile.tsx
│   │   │   └── admin/                # 管理员页面
│   │   │       ├── Overview.tsx
│   │   │       ├── Users.tsx
│   │   │       ├── Codes.tsx
│   │   │       ├── Config.tsx
│   │   │       └── Tunnels.tsx
│   │   │
│   │   ├── services/                 # API调用服务
│   │   │   ├── api.ts                # Axios实例配置
│   │   │   ├── auth.ts               # 认证API
│   │   │   ├── tunnel.ts             # 隧道API
│   │   │   ├── activation.ts         # 兑换码API
│   │   │   └── admin.ts              # 管理员API
│   │   │
│   │   ├── hooks/                    # 自定义Hooks
│   │   │   ├── useAuth.ts            # 认证Hook
│   │   │   ├── useTunnels.ts         # 隧道Hook
│   │   │   └── useSubscription.ts    # 订阅Hook
│   │   │
│   │   ├── store/                    # 状态管理（Zustand）
│   │   │   ├── authStore.ts          # 认证状态
│   │   │   ├── tunnelStore.ts        # 隧道状态
│   │   │   └── subscriptionStore.ts  # 订阅状态
│   │   │
│   │   ├── types/                    # TypeScript类型定义
│   │   │   ├── user.ts
│   │   │   ├── tunnel.ts
│   │   │   ├── subscription.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/                    # 工具函数
│   │   │   ├── format.ts             # 格式化函数
│   │   │   ├── validation.ts         # 验证函数
│   │   │   └── constants.ts          # 常量定义
│   │   │
│   │   ├── router/                   # 路由配置
│   │   │   └── index.tsx
│   │   │
│   │   ├── App.tsx                   # 应用根组件
│   │   ├── main.tsx                  # 应用入口
│   │   └── vite-env.d.ts
│   │
│   ├── .env.example                  # 环境变量示例
│   ├── .env                          # 环境变量（不提交）
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md                     # 前端说明文档
│
├── frp-plugin/                       # Go FRP插件（改造现有代码）
│   ├── cmd/
│   │   └── frps-panel/
│   │       ├── main.go
│   │       └── cmd.go
│   ├── pkg/
│   │   └── server/
│   │       ├── server.go
│   │       └── controller/
│   │           ├── controller.go     # 需改造：调用FastAPI
│   │           ├── handler.go
│   │           └── client.go         # 新增：FastAPI客户端
│   ├── config/
│   │   ├── frps-panel.toml
│   │   └── frps-tokens.toml          # 逐步废弃
│   ├── go.mod
│   ├── go.sum
│   ├── Makefile
│   └── README.md
│
├── docs/                             # 项目文档
│   ├── plans/                        # 设计文档
│   │   ├── 2026-03-01-frp-saas-architecture.md
│   │   ├── 2026-03-01-frp-saas-database.md
│   │   ├── 2026-03-01-frp-saas-api.md
│   │   ├── 2026-03-01-frp-saas-frontend.md
│   │   └── 2026-03-01-frp-saas-business-flow.md
│   ├── api/                          # API文档
│   └── deployment/                   # 部署文档
│
├── scripts/                          # 脚本工具
│   ├── init_db.py                    # 初始化数据库
│   ├── create_admin.py               # 创建管理员
│   └── backup.sh                     # 备份脚本
│
├── .gitignore
├── docker-compose.yml                # Docker编排（可选）
├── README.md                         # 项目总体说明
└── LICENSE
```

## 开发原则

- **YAGNI**：只实现必需的功能
- **DRY**：避免代码重复
- **简洁性**：代码简洁，避免冗余
- **渐进式开发**：先MVP，后迭代
