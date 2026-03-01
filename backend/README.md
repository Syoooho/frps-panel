# FRP SaaS Platform - Backend

FastAPI 后端服务，提供完整的 RESTful API

## 技术栈

- FastAPI - 现代 Web 框架
- SQLAlchemy - ORM 框架
- SQLite - 数据库（可切换 PostgreSQL）
- Pydantic - 数据验证
- JWT - 用户认证
- Bcrypt - 密码加密

## 快速开始

### 安装依赖

使用 uv 管理环境：

```bash
cd backend
uv venv
uv pip install -e .
```

### 初始化数据库

```bash
uv run python -m app.init_db
```

这将创建：
- 管理员账户：admin@example.com / admin123
- 测试用户：test@example.com / test1234（带月付订阅）
- 10个测试兑换码

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 运行服务

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

或使用脚本：

```bash
bash scripts/start.sh
```

### 测试 API

```bash
uv run python test_api.py
```

## API 文档

启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 核心功能

### 认证 API
- POST /api/v1/auth/register - 用户注册
- POST /api/v1/auth/login - 用户登录
- GET /api/v1/auth/me - 获取当前用户
- POST /api/v1/auth/logout - 用户登出

### 隧道管理 API
- GET /api/v1/tunnels - 获取隧道列表
- POST /api/v1/tunnels - 创建隧道
- GET /api/v1/tunnels/{id} - 获取隧道详情
- PUT /api/v1/tunnels/{id} - 更新隧道
- DELETE /api/v1/tunnels/{id} - 删除隧道

### 订阅管理 API
- GET /api/v1/subscriptions/me - 获取我的订阅
- POST /api/v1/activation/activate - 激活兑换码

### 管理员 API
- GET /api/v1/admin/users - 获取用户列表
- DELETE /api/v1/admin/users/{id} - 删除用户
- GET /api/v1/admin/stats - 获取统计数据
- POST /api/v1/activation/generate - 生成兑换码
- GET /api/v1/activation/codes - 获取兑换码列表
- DELETE /api/v1/activation/codes/{id} - 删除兑换码

## 项目结构

```
backend/
├── app/
│   ├── api/          # API 路由
│   │   └── v1/       # v1 版本接口
│   ├── core/         # 核心配置
│   ├── models/       # 数据库模型
│   ├── schemas/      # Pydantic 模型
│   ├── services/     # 业务逻辑
│   ├── utils/        # 工具函数
│   ├── init_db.py    # 数据库初始化
│   └── main.py       # 应用入口
├── scripts/          # 工具脚本
├── test_api.py       # API 测试
└── pyproject.toml    # 项目配置
```

## 测试账号

- 管理员：admin@example.com / admin123
- 测试用户：test@example.com / test1234
- 测试兑换码：MONTHLY-TEST-0000 ~ 0004（月付）
- 测试兑换码：YEARLY-TEST-0000 ~ 0004（年付）
