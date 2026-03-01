# 管理员 API

管理员专用接口，需要管理员权限。

## 获取用户列表

获取所有用户列表（分页）。

**请求**

```http
GET /api/v1/admin/users?skip=0&limit=20
Authorization: Bearer {admin_access_token}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skip | integer | 否 | 跳过记录数，默认0 |
| limit | integer | 否 | 返回记录数，默认100 |

**响应**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "is_active": true,
    "is_admin": false,
    "created_at": "2026-03-01T10:00:00"
  }
]
```

## 删除用户

删除指定用户及其所有数据。

**请求**

```http
DELETE /api/v1/admin/users/{user_id}
Authorization: Bearer {admin_access_token}
```

**响应**

```json
{
  "message": "用户已删除"
}
```

**错误响应**

- 403 Forbidden - 不能删除管理员账户

```json
{
  "detail": "不能删除管理员账户"
}
```

## 获取统计数据

获取系统统计信息。

**请求**

```http
GET /api/v1/admin/stats
Authorization: Bearer {admin_access_token}
```

**响应**

```json
{
  "total_users": 156,
  "active_users": 89,
  "total_tunnels": 342,
  "online_tunnels": 218,
  "total_codes": 500,
  "used_codes": 156
}
```

## 生成兑换码

批量生成兑换码。

**请求**

```http
POST /api/v1/activation/generate
Authorization: Bearer {admin_access_token}
Content-Type: application/json

{
  "plan_type": "monthly",
  "count": 10
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_type | string | 是 | 计划类型：monthly/yearly |
| count | integer | 否 | 生成数量，默认1 |

**响应**

```json
{
  "codes": [
    "ABCD-1234-EFGH-5678",
    "IJKL-9012-MNOP-3456"
  ]
}
```

## 获取兑换码列表

获取所有兑换码（分页）。

**请求**

```http
GET /api/v1/activation/codes?skip=0&limit=20
Authorization: Bearer {admin_access_token}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skip | integer | 否 | 跳过记录数，默认0 |
| limit | integer | 否 | 返回记录数，默认100 |

**响应**

```json
[
  {
    "id": 1,
    "code": "ABCD-1234-EFGH-5678",
    "plan_type": "monthly",
    "is_used": false,
    "used_by": null,
    "used_at": null,
    "created_at": "2026-03-01T10:00:00"
  },
  {
    "id": 2,
    "code": "IJKL-9012-MNOP-3456",
    "plan_type": "yearly",
    "is_used": true,
    "used_by": 5,
    "used_at": "2026-03-02T15:30:00",
    "created_at": "2026-03-01T10:00:00"
  }
]
```

## 删除兑换码

删除指定的兑换码。

**请求**

```http
DELETE /api/v1/activation/codes/{code_id}
Authorization: Bearer {admin_access_token}
```

**响应**

```json
{
  "message": "兑换码已删除"
}
```

## 权限说明

所有管理员接口都需要：
1. 有效的 JWT Token
2. 用户的 is_admin 字段为 true

如果权限不足，会返回：

```json
{
  "detail": "权限不足"
}
```
