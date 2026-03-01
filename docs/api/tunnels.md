# 隧道管理 API

隧道管理相关接口，用于创建、查询、更新和删除用户的内网穿透隧道。

## 获取隧道列表

获取当前用户的所有隧道。

**请求**

```http
GET /api/v1/tunnels
Authorization: Bearer {access_token}
```

**响应**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Web Server",
    "type": "tcp",
    "local_ip": "127.0.0.1",
    "local_port": 8080,
    "remote_port": 8080,
    "custom_domain": null,
    "subdomain": null,
    "status": "active",
    "created_at": "2026-03-01T10:00:00"
  }
]
```

## 获取单个隧道

获取指定隧道的详细信息。

**请求**

```http
GET /api/v1/tunnels/{tunnel_id}
Authorization: Bearer {access_token}
```

**响应**

```json
{
  "id": 1,
  "user_id": 1,
  "name": "Web Server",
  "type": "tcp",
  "local_ip": "127.0.0.1",
  "local_port": 8080,
  "remote_port": 8080,
  "custom_domain": null,
  "subdomain": null,
  "status": "active",
  "created_at": "2026-03-01T10:00:00"
}
```

## 创建隧道

创建新的隧道配置。

**请求**

```http
POST /api/v1/tunnels
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Web Server",
  "type": "tcp",
  "local_ip": "127.0.0.1",
  "local_port": 8080,
  "remote_port": 8080
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 隧道名称 |
| type | string | 是 | 隧道类型：tcp/udp/http/https |
| local_ip | string | 是 | 本地IP地址 |
| local_port | integer | 是 | 本地端口 |
| remote_port | integer | 否 | 远程端口（TCP/UDP类型） |
| custom_domain | string | 否 | 自定义域名（HTTPS类型） |
| subdomain | string | 否 | 子域名（HTTP类型） |

**响应**

```json
{
  "id": 1,
  "user_id": 1,
  "name": "Web Server",
  "type": "tcp",
  "local_ip": "127.0.0.1",
  "local_port": 8080,
  "remote_port": 8080,
  "custom_domain": null,
  "subdomain": null,
  "status": "inactive",
  "created_at": "2026-03-01T10:00:00"
}
```

**错误响应**

- 403 Forbidden - 未激活订阅或已达配额上限

```json
{
  "detail": "请先激活订阅"
}
```

## 更新隧道

更新隧道配置。

**请求**

```http
PUT /api/v1/tunnels/{tunnel_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Updated Web Server",
  "local_port": 8081
}
```

**响应**

```json
{
  "id": 1,
  "user_id": 1,
  "name": "Updated Web Server",
  "type": "tcp",
  "local_ip": "127.0.0.1",
  "local_port": 8081,
  "remote_port": 8080,
  "custom_domain": null,
  "subdomain": null,
  "status": "active",
  "created_at": "2026-03-01T10:00:00"
}
```

## 删除隧道

删除指定的隧道。

**请求**

```http
DELETE /api/v1/tunnels/{tunnel_id}
Authorization: Bearer {access_token}
```

**响应**

```json
{
  "message": "隧道已删除"
}
```

## 隧道类型说明

### TCP 隧道
- 适用于：SSH、数据库、游戏服务器等
- 需要指定：local_port, remote_port

### UDP 隧道
- 适用于：游戏服务器、语音通话等
- 需要指定：local_port, remote_port

### HTTP 隧道
- 适用于：网站、API服务等
- 需要指定：local_port, subdomain
- 访问地址：http://{subdomain}.yourdomain.com

### HTTPS 隧道
- 适用于：加密网站等
- 需要指定：local_port, custom_domain
- 访问地址：https://{custom_domain}
