# FRP SaaS平台 - API接口设计

## API规范

- **协议**：RESTful API over HTTPS
- **认证**：JWT (JSON Web Token)
- **数据格式**：JSON
- **基础路径**：`/api/v1`

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
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 认证相关接口

### POST /api/v1/auth/register
用户注册

**请求体**：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com"
  },
  "message": "注册成功"
}
```

### POST /api/v1/auth/login
用户登录

**请求体**：
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

### POST /api/v1/auth/logout
用户登出

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "message": "登出成功"
}
```

### GET /api/v1/auth/me
获取当前用户信息

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "is_admin": false,
    "created_at": "2026-03-01T10:00:00Z"
  }
}
```

### POST /api/v1/auth/refresh
刷新Token

**请求体**：
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**响应**：同登录响应

## 兑换码相关接口

### POST /api/v1/activation/redeem
用户兑换码激活

**Headers**：`Authorization: Bearer <token>`

**请求体**：
```json
{
  "code": "ABCD-1234-EFGH-5678"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "subscription_id": 1,
    "plan_type": "monthly",
    "port_quota": 10,
    "expire_date": "2026-04-01T10:00:00Z"
  },
  "message": "激活成功"
}
```

### POST /api/v1/activation/generate
管理员批量生成兑换码

**Headers**：`Authorization: Bearer <admin_token>`

**请求体**：
```json
{
  "plan_type": "monthly",
  "count": 10,
  "expire_days": 30
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "codes": [
      "ABCD-1234-EFGH-5678",
      "IJKL-9012-MNOP-3456"
    ],
    "count": 10
  }
}
```

### GET /api/v1/activation/list
管理员查看兑换码列表

**Headers**：`Authorization: Bearer <admin_token>`

**查询参数**：
- `page`: 页码（默认1）
- `page_size`: 每页数量（默认20）
- `is_used`: 是否已使用（可选）
- `plan_type`: 套餐类型（可选）

**响应**：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "code": "ABCD-1234-EFGH-5678",
        "plan_type": "monthly",
        "is_used": false,
        "created_at": "2026-03-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

### DELETE /api/v1/activation/{code_id}
管理员删除兑换码

**Headers**：`Authorization: Bearer <admin_token>`

**响应**：
```json
{
  "success": true,
  "message": "删除成功"
}
```

## 订阅相关接口

### GET /api/v1/subscription/my
获取我的订阅信息

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "plan_type": "monthly",
    "port_quota": 10,
    "used_ports": 3,
    "start_date": "2026-03-01T10:00:00Z",
    "expire_date": "2026-04-01T10:00:00Z",
    "status": "active",
    "days_remaining": 30
  }
}
```

### GET /api/v1/subscription/quota
获取配额使用情况

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "port_quota": 10,
    "used_ports": 3,
    "available_ports": 7,
    "usage_percentage": 30
  }
}
```

## 隧道管理接口

### GET /api/v1/tunnels
获取我的隧道列表

**Headers**：`Authorization: Bearer <token>`

**查询参数**：
- `status`: 状态过滤（online/offline）
- `type`: 类型过滤

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "my-ssh",
      "type": "tcp",
      "local_port": 22,
      "remote_port": 10022,
      "status": "online",
      "created_at": "2026-03-01T10:00:00Z",
      "last_active": "2026-03-01T12:00:00Z"
    }
  ]
}
```

### POST /api/v1/tunnels
创建新隧道

**Headers**：`Authorization: Bearer <token>`

**请求体**：
```json
{
  "name": "my-ssh",
  "type": "tcp",
  "local_port": 22,
  "remote_port": 10022
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "my-ssh",
    "type": "tcp",
    "local_port": 22,
    "remote_port": 10022,
    "status": "offline"
  },
  "message": "隧道创建成功"
}
```

### PUT /api/v1/tunnels/{id}
更新隧道配置

**Headers**：`Authorization: Bearer <token>`

**请求体**：
```json
{
  "name": "my-ssh-updated",
  "local_port": 2222
}
```

**响应**：同创建响应

### DELETE /api/v1/tunnels/{id}
删除隧道

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "message": "隧道删除成功"
}
```

### GET /api/v1/tunnels/{id}/status
获取隧道状态

**Headers**：`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "status": "online",
    "last_active": "2026-03-01T12:00:00Z",
    "connections": 2
  }
}
```

## 管理员接口

### GET /api/v1/admin/users
用户列表

**Headers**：`Authorization: Bearer <admin_token>`

**查询参数**：
- `page`: 页码
- `page_size`: 每页数量
- `search`: 搜索关键词（邮箱）
- `is_active`: 是否激活

**响应**：
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "email": "user@example.com",
        "is_active": true,
        "subscription": {
          "plan_type": "monthly",
          "expire_date": "2026-04-01T10:00:00Z"
        },
        "tunnel_count": 3,
        "created_at": "2026-03-01T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

### PUT /api/v1/admin/users/{id}
更新用户（禁用/启用）

**Headers**：`Authorization: Bearer <admin_token>`

**请求体**：
```json
{
  "is_active": false
}
```

**响应**：
```json
{
  "success": true,
  "message": "用户已禁用"
}
```

### DELETE /api/v1/admin/users/{id}
删除用户

**Headers**：`Authorization: Bearer <admin_token>`

**响应**：
```json
{
  "success": true,
  "message": "用户已删除"
}
```

### GET /api/v1/admin/stats
统计数据

**Headers**：`Authorization: Bearer <admin_token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "total_users": 1000,
    "active_users": 800,
    "total_tunnels": 3000,
    "online_tunnels": 1500,
    "monthly_revenue": 10000,
    "user_growth": [
      {"date": "2026-03-01", "count": 10}
    ]
  }
}
```

### GET /api/v1/admin/config
获取系统配置

**Headers**：`Authorization: Bearer <admin_token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "monthly_plan": {
      "ports": 10,
      "price": "月付价格"
    },
    "yearly_plan": {
      "ports": 100,
      "price": "年付价格"
    }
  }
}
```

### PUT /api/v1/admin/config
更新系统配置

**Headers**：`Authorization: Bearer <admin_token>`

**请求体**：
```json
{
  "monthly_plan": {
    "ports": 15,
    "price": "新价格"
  }
}
```

**响应**：
```json
{
  "success": true,
  "message": "配置更新成功"
}
```

## FRP插件验证接口

### POST /api/v1/frp/validate
验证用户token和配额

**请求体**：
```json
{
  "user": "user@example.com",
  "token": "user_token_from_frpc"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user_id": 1,
    "port_quota": 10,
    "used_ports": 3
  }
}
```

### POST /api/v1/frp/tunnel/register
隧道上线通知

**请求体**：
```json
{
  "tunnel_id": 1,
  "user_id": 1,
  "remote_port": 10022
}
```

**响应**：
```json
{
  "success": true,
  "message": "隧道已上线"
}
```

### POST /api/v1/frp/tunnel/unregister
隧道下线通知

**请求体**：
```json
{
  "tunnel_id": 1
}
```

**响应**：
```json
{
  "success": true,
  "message": "隧道已下线"
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
