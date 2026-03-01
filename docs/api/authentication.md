# 认证API文档

## 概述

FRP SaaS平台使用JWT（JSON Web Token）进行用户认证。所有需要认证的接口都需要在请求头中携带有效的访问令牌。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **认证方式**: Bearer Token
- **Token类型**: JWT
- **Token有效期**: 
  - Access Token: 30分钟
  - Refresh Token: 7天

## 接口列表

### 1. 用户注册

创建新用户账号。

**请求**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_admin": false,
    "created_at": "2026-03-01T10:00:00Z"
  }
}
```

**错误响应**

- `400 Bad Request` - 邮箱已被注册
- `422 Unprocessable Entity` - 请求参数验证失败

### 2. 用户登录

使用邮箱和密码登录。

**请求**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_admin": false,
    "created_at": "2026-03-01T10:00:00Z"
  }
}
```

**错误响应**

- `401 Unauthorized` - 邮箱或密码错误
- `403 Forbidden` - 账号已被禁用

### 3. 获取当前用户信息

获取当前登录用户的详细信息。

**请求**

```http
GET /auth/me
Authorization: Bearer <access_token>
```

**响应**

```json
{
  "id": 1,
  "email": "user@example.com",
  "is_active": true,
  "is_admin": false,
  "created_at": "2026-03-01T10:00:00Z",
  "last_login": "2026-03-01T12:00:00Z"
}
```

**错误响应**

- `401 Unauthorized` - Token无效或已过期
- `403 Forbidden` - 用户已被禁用
- `404 Not Found` - 用户不存在

### 4. 用户登出

登出当前用户（客户端需清除Token）。

**请求**

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**响应**

```json
{
  "success": true,
  "message": "登出成功"
}
```

## 认证流程

### 注册流程

```
1. 用户提交邮箱和密码
2. 后端验证邮箱格式和唯一性
3. 密码使用bcrypt哈希存储
4. 创建用户记录
5. 生成JWT Token
6. 返回Token和用户信息
```

### 登录流程

```
1. 用户提交邮箱和密码
2. 后端查询用户记录
3. 验证密码哈希
4. 检查用户状态（是否被禁用）
5. 更新最后登录时间
6. 生成新的JWT Token
7. 返回Token和用户信息
```

### Token使用

```
1. 客户端收到Token后存储在localStorage
2. 每次API请求在Header中携带Token
3. 后端验证Token有效性
4. Token过期后需要重新登录
```

## 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token无效或过期） |
| 403 | 禁止访问（账号被禁用） |
| 404 | 资源不存在 |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |

## 安全建议

1. **HTTPS**: 生产环境必须使用HTTPS
2. **密码强度**: 建议密码至少8位，包含字母和数字
3. **Token存储**: 不要在URL或日志中暴露Token
4. **Token刷新**: Access Token过期后使用Refresh Token获取新Token
5. **登出处理**: 登出时清除客户端所有Token

## 示例代码

### JavaScript/TypeScript

```typescript
// 注册
const register = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  localStorage.setItem('access_token', data.access_token)
  return data
}

// 登录
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  localStorage.setItem('access_token', data.access_token)
  return data
}

// 获取用户信息
const getMe = async () => {
  const token = localStorage.getItem('access_token')
  const response = await fetch('http://localhost:8000/api/v1/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.json()
}
```

### Python

```python
import requests

# 注册
def register(email: str, password: str):
    response = requests.post(
        'http://localhost:8000/api/v1/auth/register',
        json={'email': email, 'password': password}
    )
    return response.json()

# 登录
def login(email: str, password: str):
    response = requests.post(
        'http://localhost:8000/api/v1/auth/login',
        json={'email': email, 'password': password}
    )
    return response.json()

# 获取用户信息
def get_me(token: str):
    response = requests.get(
        'http://localhost:8000/api/v1/auth/me',
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()
```

### cURL

```bash
# 注册
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 登录
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 获取用户信息
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```
