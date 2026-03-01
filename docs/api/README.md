# FRP SaaS Platform API 文档

## 概述

FRP SaaS Platform 提供完整的RESTful API，用于管理用户、订阅、隧道等功能。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## API模块

### 1. 认证模块 (Authentication)

用户注册、登录、Token管理。

📄 [详细文档](./authentication.md)

**端点**:
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户
- `POST /auth/logout` - 用户登出

### 2. 兑换码模块 (Activation) 🚧

兑换码生成、激活、管理。

**端点**:
- `POST /activation/redeem` - 兑换码激活
- `POST /activation/generate` - 生成兑换码（管理员）
- `GET /activation/list` - 兑换码列表（管理员）
- `DELETE /activation/{code_id}` - 删除兑换码（管理员）

### 3. 订阅模块 (Subscription) 🚧

用户订阅信息和配额管理。

**端点**:
- `GET /subscription/my` - 我的订阅
- `GET /subscription/quota` - 配额信息

### 4. 隧道模块 (Tunnels) 🚧

隧道创建、管理、状态监控。

**端点**:
- `GET /tunnels` - 隧道列表
- `POST /tunnels` - 创建隧道
- `PUT /tunnels/{id}` - 更新隧道
- `DELETE /tunnels/{id}` - 删除隧道
- `GET /tunnels/{id}/status` - 隧道状态

### 5. 管理员模块 (Admin) 🚧

用户管理、系统配置、统计数据。

**端点**:
- `GET /admin/users` - 用户列表
- `PUT /admin/users/{id}` - 更新用户
- `DELETE /admin/users/{id}` - 删除用户
- `GET /admin/stats` - 统计数据
- `GET /admin/config` - 系统配置
- `PUT /admin/config` - 更新配置

### 6. FRP插件模块 (FRP) 🚧

FRP插件验证和隧道状态同步。

**端点**:
- `POST /frp/validate` - 验证用户
- `POST /frp/tunnel/register` - 隧道上线
- `POST /frp/tunnel/unregister` - 隧道下线

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
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
2. Token有效期30分钟
3. 过期后需要重新登录

## 分页参数

列表接口支持分页参数：

```
?page=1&page_size=20
```

响应格式：

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

## 错误码定义

| 错误码 | 说明 |
|--------|------|
| AUTH_001 | 认证失败 |
| AUTH_002 | Token过期 |
| AUTH_003 | 权限不足 |
| USER_001 | 用户不存在 |
| USER_002 | 邮箱已存在 |
| CODE_001 | 兑换码无效 |
| CODE_002 | 兑换码已使用 |
| CODE_003 | 兑换码已过期 |
| QUOTA_001 | 配额不足 |
| TUNNEL_001 | 隧道名称重复 |
| TUNNEL_002 | 端口已被占用 |
| TUNNEL_003 | 域名已被占用 |

## 开发工具

### Swagger UI

访问 http://localhost:8000/docs 查看交互式API文档。

### ReDoc

访问 http://localhost:8000/redoc 查看美化的API文档。

### Postman Collection

导入 `postman_collection.json` 到Postman进行API测试。

## 更新日志

### 2026-03-01

- ✅ 实现认证模块（注册、登录、获取用户信息）
- ✅ JWT Token生成和验证
- ✅ 密码哈希存储
- ✅ 邮箱格式验证

### 待实现

- 🚧 兑换码模块
- 🚧 订阅模块
- 🚧 隧道模块
- 🚧 管理员模块
- 🚧 FRP插件集成

## 联系方式

- 项目地址: https://github.com/yhl452493373/frps-panel
- 问题反馈: https://github.com/yhl452493373/frps-panel/issues
