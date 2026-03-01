<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# api

## 用途

API 路由层，定义所有 RESTful API 端点和依赖注入函数。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `deps.py` | 依赖注入函数（数据库会话、用户认证、权限验证） |

## 子目录

| 目录 | 用途 |
|------|------|
| `v1/` | API v1 版本路由 (详见 `v1/AGENTS.md`) |

## AI Agent 工作指南

### 在此目录工作时

- `deps.py` 定义了通用的依赖注入函数
- `get_db()` - 获取数据库会话
- `get_current_user()` - 获取当前登录用户
- `get_current_admin()` - 验证管理员权限
- 新增 API 版本应创建新的子目录（如 v2/）

### 测试要求

- 测试依赖注入函数的各种场景
- 测试认证失败、权限不足等异常情况

### 常见模式

- 使用 `Depends()` 注入依赖
- JWT Token 通过 HTTPBearer 获取
- 异常使用 HTTPException 抛出
- 依赖函数返回类型应明确

## 依赖关系

### 内部依赖

- `deps.py` → `core/config.py` (配置)
- `deps.py` → `core/database.py` (数据库)
- `deps.py` → `models/user.py` (用户模型)
- `v1/` → `deps.py` (使用依赖注入)

### 外部依赖

- FastAPI
- python-jose (JWT)
- SQLAlchemy

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
