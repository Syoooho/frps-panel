# FRP SaaS Platform API 文档

## 概述

FRP SaaS Platform 提供完整的RESTful API，用于管理用户、订阅、隧道等功能。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## API模块

### 1. 认证模块 (Authentication) ✅

用户注册、登录、Token管理。

📄 [详细文档](./authentication.md)

**端点**:
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户
- `POST /auth/logout` - 用户登出

### 2. 隧道模块 (Tunnels) ✅

隧道创建、管理、状态监控。

📄 [详细文档](./tunnels.md)

**端点**:
- `GET /tunnels` - 隧道列表
- `GET /tunnels/{id}` - 获取隧道详情
- `POST /tunnels` - 创建隧道
- `PUT /tunnels/{id}` - 更新隧道
- `DELETE /tunnels/{id}` - 删除隧道

### 3. 订阅模块 (Subscription) ✅

用户订阅信息和兑换码激活。

📄 [详细文档](./subscriptions.md)

**端点**:
- `GET /subscriptions/me` - 我的订阅
- `POST /activation/activate` - 激活兑换码

### 4. 管理员模块 (Admin) ✅

用户管理、系统配置、统计数据、兑换码管理。

📄 [详细文档](./admin.md)

**端点**:
- `GET /admin/users` - 用户列表
- `DELETE /admin/users/{id}` - 删除用户
- `GET /admin/stats` - 统计数据
- `POST /activation/generate` - 生成兑换码
- `GET /activation/codes` - 兑换码列表
- `DELETE /activation/codes/{id}` - 删除兑换码

### 5. FRP插件模块 (FRP) 🚧

FRP插件验证和隧道状态同步（待实现）。

**端点**:
- `POST /frp/validate` - 验证用户
- `POST /frp/tunnel/register` - 隧道上线
- `POST /frp/tunnel/unregister` - 隧道下线

## 通用响应格式

### 成功响应

```json
{
  "id": 1,
  "name": "example",
  ...
}
```

### 错误响应

```json
{
  "detail": "错误描述信息"
}
```

## HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |

## 认证说明

大部分API需要在请求头中携带JWT Token：

```http
Authorization: Bearer <access_token>
```

获取Token的方式：
1. 用户注册或登录后获得
2. Token包含在响应的 `access_token` 字段中
3. 过期后需要重新登录

## 快速开始

### 1. 用户注册

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. 用户登录

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. 创建隧道

```bash
curl -X POST http://localhost:8000/api/v1/tunnels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{
    "name": "Web Server",
    "type": "tcp",
    "local_ip": "127.0.0.1",
    "local_port": 8080,
    "remote_port": 8080
  }'
```

## 测试账号

开发环境提供以下测试账号：

- **管理员**: admin@example.com / admin123
- **普通用户**: test@example.com / test1234（带月付订阅）

测试兑换码：
- 月付：MONTHLY-TEST-0000 ~ 0004
- 年付：YEARLY-TEST-0000 ~ 0004

## 开发工具

### Swagger UI

访问 http://localhost:8000/docs 查看交互式API文档。

### ReDoc

访问 http://localhost:8000/redoc 查看美化的API文档。

## 更新日志

### 2026-03-01

- ✅ 实现认证模块（注册、登录、获取用户信息）
- ✅ 实现隧道管理模块（CRUD、配额检查）
- ✅ 实现订阅模块（查询、兑换码激活）
- ✅ 实现管理员模块（用户管理、统计数据、兑换码管理）
- ✅ JWT Token生成和验证
- ✅ 密码哈希存储
- ✅ 邮箱格式验证
- ✅ 数据库初始化脚本

### 待实现

- 🚧 FRP插件集成
- 🚧 WebSocket实时状态推送
- 🚧 邮件通知系统

## 联系方式

- 项目地址: https://github.com/yhl452493373/frps-panel
- 问题反馈: https://github.com/yhl452493373/frps-panel/issues
