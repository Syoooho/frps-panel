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
| `tests/` | 测试脚本和测试文档 |
| `.venv/` | Python 虚拟环境（不提交到 Git） |

## AI Agent 工作指南

### 在此目录工作时

- 使用 uv 管理 Python 环境：`uv venv` 创建环境，`uv pip install -e .` 安装依赖
- 初始化数据库：`uv run python -m app.init_db`
- 启动服务：`uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- 或使用脚本：`bash scripts/start.sh`
- API 文档自动生成：访问 `/docs` (Swagger) 或 `/redoc`
- 测试 API：`uv run python tests/test_api.py`（需先启动服务）
- 测试 FRP API：`uv run python tests/test_frp_api.py`（需先启动服务）

### 已实现功能

### 认证系统 ✅
- 用户注册（POST /api/v1/auth/register）
- 用户登录（POST /api/v1/auth/login）
- 获取当前用户（GET /api/v1/auth/me）
- 用户登出（POST /api/v1/auth/logout）
- JWT Token 生成和验证
- 密码 bcrypt 哈希
- 邮箱格式验证
- 管理员权限验证

### 隧道管理 ✅
- 获取用户隧道列表（GET /api/v1/tunnels）
- 获取单个隧道（GET /api/v1/tunnels/{id}）
- 创建隧道（POST /api/v1/tunnels）
- 更新隧道（PUT /api/v1/tunnels/{id}）
- 删除隧道（DELETE /api/v1/tunnels/{id}）
- 配额检查（创建时验证订阅）
- 支持 TCP/UDP/HTTP/HTTPS 协议

### 订阅管理 ✅
- 获取用户订阅信息（GET /api/v1/subscriptions/me）
- 兑换码激活（POST /api/v1/activation/activate）
- 订阅自动续期
- 配额管理（月付10端口，年付100端口）

### 兑换码系统 ✅
- 生成兑换码（POST /api/v1/activation/generate）
- 获取兑换码列表（GET /api/v1/activation/codes）
- 删除兑换码（DELETE /api/v1/activation/codes/{id}）
- 使用状态追踪
- 支持月付/年付类型

### 管理员功能 ✅
- 获取用户列表（GET /api/v1/admin/users）
- 删除用户（DELETE /api/v1/admin/users/{id}）
- 系统统计数据（GET /api/v1/admin/stats）
- 权限控制（管理员专用接口）

### FRP 插件 API ✅
- 用户登录验证（POST /api/v1/frp/handler - Login）
- 新建代理验证（POST /api/v1/frp/handler - NewProxy）
- 关闭代理处理（POST /api/v1/frp/handler - CloseProxy）
- 心跳检测（POST /api/v1/frp/handler - Ping）
- 用户 FRP Token 系统
- 隧道状态自动管理

### 数据模型 ✅
- User - 用户模型（邮箱、密码、角色）
- Subscription - 订阅模型（计划类型、配额、有效期）
- ActivationCode - 兑换码模型（代码、类型、使用状态）
- Tunnel - 隧道模型（名称、类型、端口、域名）
- SystemConfig - 系统配置模型

### 核心服务 ✅
- AuthService - 认证服务（用户验证、Token 生成）
- TunnelService - 隧道服务（CRUD、配额检查）
- SubscriptionService - 订阅服务（激活、续期、兑换码管理）
- AdminService - 管理员服务（用户管理、统计数据）
- FRPService - FRP 插件服务（用户验证、代理验证、隧道管理）
- Security - 安全模块（密码哈希、JWT）
- Database - 数据库连接和会话管理
- Config - 配置管理

### 工具脚本 ✅
- init_db.py - 数据库初始化脚本
- tests/test_api.py - API 测试脚本
- tests/test_frp_api.py - FRP API 测试脚本
- tests/test_integration.md - 集成测试文档
- scripts/init_db.sh - Shell 初始化脚本
- scripts/start.sh - 启动脚本

### 测试数据 ✅
- 管理员账户：admin@example.com / admin123
- 测试用户：test@example.com / test1234（带月付订阅）
- 10个测试兑换码（5个月付 + 5个年付）

## 待实现功能

- WebSocket 实时状态推送
- 邮件通知系统
- 系统配置管理 API
- 日志记录和审计
- 性能监控和限流
- 数据库备份和恢复

## 测试要求

- 运行测试：`pytest`
- 测试覆盖率：`pytest --cov=app`
- API 测试：`uv run python tests/test_api.py`
- FRP API 测试：`uv run python tests/test_frp_api.py`
- 集成测试文档：`tests/test_integration.md`

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
