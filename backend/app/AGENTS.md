<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# app

## 用途

FastAPI 应用主代码目录，包含 API 路由、数据模型、业务逻辑、核心配置等所有应用代码。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `main.py` | FastAPI 应用入口，定义 app 实例和中间件 |

## 子目录

| 目录 | 用途 |
|------|------|
| `api/` | API 路由和端点 (详见 `api/AGENTS.md`) |
| `core/` | 核心配置和工具 (详见 `core/AGENTS.md`) |
| `models/` | SQLAlchemy 数据库模型 (详见 `models/AGENTS.md`) |
| `schemas/` | Pydantic 数据模型 (详见 `schemas/AGENTS.md`) |
| `services/` | 业务逻辑服务层 (详见 `services/AGENTS.md`) |
| `utils/` | 工具函数 (详见 `utils/AGENTS.md`) |

## AI Agent 工作指南

### 在此目录工作时

- `main.py` 是应用入口，定义 FastAPI 实例和全局配置
- 新增 API 路由应在 `api/v1/` 目录下创建
- 数据库模型定义在 `models/`，API 数据模型定义在 `schemas/`
- 业务逻辑应封装在 `services/` 中，保持路由处理函数简洁
- 使用 `api/deps.py` 中的依赖注入函数

### 测试要求

- 为每个 API 端点编写测试
- 为业务逻辑服务编写单元测试
- 使用 pytest 和 pytest-asyncio
- 测试应该独立，不依赖外部服务

### 常见模式

- 路由函数使用 `async def`
- 使用 `Depends()` 进行依赖注入
- 数据库会话通过 `get_db()` 依赖获取
- 当前用户通过 `get_current_user()` 依赖获取
- 使用 Pydantic 模型进行请求验证和响应序列化
- 异常使用 `HTTPException` 抛出

## 依赖关系

### 内部依赖

- `main.py` → `api/` (注册路由)
- `api/` → `schemas/` (请求响应模型)
- `api/` → `services/` (业务逻辑)
- `services/` → `models/` (数据库操作)
- `api/deps.py` → `core/` (配置和安全)

### 外部依赖

- FastAPI 框架
- SQLAlchemy ORM
- Pydantic 数据验证

## 应用架构

```
main.py (FastAPI 实例)
  ↓
api/ (路由层)
  ↓
services/ (业务逻辑层)
  ↓
models/ (数据访问层)
```

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
