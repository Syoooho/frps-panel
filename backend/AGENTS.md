<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# backend

## 用途

FastAPI 后端服务，提供 RESTful API 接口，处理用户认证、订阅管理、隧道配置、兑换码系统等核心业务逻辑。

## 核心文件

| 文件 | 描述 |
|------|------|
| `pyproject.toml` | Python 项目配置和依赖管理 |
| `uv.lock` | uv 包管理器锁定文件 |
| `README.md` | 后端服务说明文档 |
| `.env.example` | 环境变量配置模板 |
| `.env` | 环境变量配置（不提交到 Git） |
| `frps_panel.db` | SQLite 数据库文件 |

## 子目录

| 目录 | 用途 |
|------|------|
| `app/` | 应用主代码 (详见 `app/AGENTS.md`) |
| `alembic/` | 数据库迁移脚本 (详见 `alembic/AGENTS.md`) |
| `tests/` | 测试代码（待实现） |
| `.venv/` | Python 虚拟环境（不提交到 Git） |

## AI Agent 工作指南

### 在此目录工作时

- 使用 uv 管理 Python 环境：`uv venv` 创建环境，`uv pip install -e .` 安装依赖
- 修改数据库模型后需要创建迁移：`alembic revision --autogenerate -m "描述"`
- 应用迁移：`alembic upgrade head`
- 启动服务：`uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- API 文档自动生成：访问 `/docs` (Swagger) 或 `/redoc`

### 已实现功能

### 认证系统 ✅
- 用户注册（POST /api/v1/auth/register）
- 用户登录（POST /api/v1/auth/login）
- 获取当前用户（GET /api/v1/auth/me）
- 用户登出（POST /api/v1/auth/logout）
- JWT Token生成和验证
- 密码bcrypt哈希
- 邮箱格式验证

### 数据模型 ✅
- User - 用户模型
- Subscription - 订阅模型
- ActivationCode - 兑换码模型
- Tunnel - 隧道模型
- SystemConfig - 系统配置模型

### 核心服务 ✅
- auth_service - 认证服务（用户验证、Token生成）
- security - 安全模块（密码哈希、JWT）
- database - 数据库连接和会话管理
- config - 配置管理

## 待实现功能

- 兑换码生成和激活
- 订阅管理
- 隧道CRUD操作
- 配额控制
- 管理员功能
- FRP插件集成

## 测试要求

- 运行测试：`pytest`
- 测试覆盖率：`pytest --cov=app`
- 当前测试目录为空，需要补充单元测试和集成测试

### 常见模式

- 使用 Pydantic 进行数据验证
- 使用 SQLAlchemy ORM 操作数据库
- 使用 JWT 进行用户认证
- 使用依赖注入（Depends）管理数据库会话和权限
- API 路由按版本组织（v1）
- 配置通过环境变量管理（pydantic-settings）

## 依赖关系

### 内部依赖

- `app/models/` → 数据库模型定义
- `app/schemas/` → API 数据模型
- `app/api/` → API 路由
- `app/core/` → 核心配置和工具
- `app/services/` → 业务逻辑服务

### 外部依赖

- `fastapi` - Web 框架
- `uvicorn` - ASGI 服务器
- `sqlalchemy` - ORM 框架
- `alembic` - 数据库迁移工具
- `pydantic` - 数据验证
- `python-jose` - JWT 处理
- `passlib` - 密码哈希
- `httpx` - HTTP 客户端

## 数据库设计

- 使用 SQLite 作为数据库（生产环境可切换到 PostgreSQL）
- 主要表：users, subscriptions, activation_codes, tunnels, system_config
- 使用 Alembic 管理数据库版本

## API 设计

- RESTful 风格
- 版本化路由：`/api/v1/`
- 统一响应格式
- JWT Token 认证
- 角色权限控制（普通用户/管理员）

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
