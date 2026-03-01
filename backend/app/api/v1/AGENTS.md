<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# v1

## 用途

API v1 版本的所有路由端点定义。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `auth.py` | 认证相关 API（登录、注册、刷新令牌） |
| `activation.py` | 兑换码激活相关 API |
| `subscription.py` | 订阅管理相关 API |
| `tunnels.py` | 隧道管理相关 API |
| `admin.py` | 管理员后台相关 API |
| `frp.py` | FRP 插件通信相关 API |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 每个文件定义一组相关的 API 端点
- 使用 `APIRouter` 创建路由
- 路由函数使用 `async def`
- 使用 `Depends()` 注入依赖（数据库会话、当前用户等）
- 使用 Pydantic 模型验证请求和序列化响应
- 在 `main.py` 中注册路由

### 测试要求

- 为每个端点编写集成测试
- 测试正常流程和异常情况
- 测试权限控制

### 常见模式

- 路由装饰器：`@router.get()`, `@router.post()` 等
- 路径参数：`{id: int}`
- 查询参数：函数参数
- 请求体：Pydantic 模型参数
- 响应模型：`response_model=XXXResponse`
- 状态码：`status_code=status.HTTP_201_CREATED`

## 依赖关系

### 内部依赖

- 依赖 `../deps.py` (依赖注入)
- 依赖 `../../schemas/` (数据模型)
- 依赖 `../../services/` (业务逻辑)

### 外部依赖

- FastAPI

## API 端点说明

### auth.py
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `POST /refresh` - 刷新令牌
- `GET /me` - 获取当前用户信息

### activation.py
- `POST /activate` - 使用兑换码激活订阅

### subscription.py
- `GET /` - 获取当前用户订阅信息

### tunnels.py
- `GET /` - 获取隧道列表
- `POST /` - 创建隧道
- `PUT /{id}` - 更新隧道
- `DELETE /{id}` - 删除隧道

### admin.py
- `GET /users` - 获取用户列表
- `POST /codes` - 生成兑换码
- `GET /codes` - 获取兑换码列表
- `GET /config` - 获取系统配置
- `PUT /config` - 更新系统配置

### frp.py
- `POST /sync` - 同步配置到 FRP 插件

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
