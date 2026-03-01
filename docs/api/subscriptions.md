# 订阅管理 API

订阅和兑换码相关接口。

## 获取我的订阅

获取当前用户的订阅信息。

**请求**

```http
GET /api/v1/subscriptions/me
Authorization: Bearer {access_token}
```

**响应**

```json
{
  "id": 1,
  "user_id": 1,
  "plan_type": "monthly",
  "max_tunnels": 10,
  "start_date": "2026-03-01T00:00:00",
  "end_date": "2026-03-31T23:59:59",
  "is_active": true
}
```

**无订阅时响应**

```json
null
```

## 激活兑换码

使用兑换码激活或续费订阅。

**请求**

```http
POST /api/v1/activation/activate
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "code": "MONTHLY-TEST-0000"
}
```

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 兑换码 |

**响应**

```json
{
  "message": "激活成功"
}
```

**错误响应**

- 404 Not Found - 兑换码不存在

```json
{
  "detail": "兑换码不存在"
}
```

- 400 Bad Request - 兑换码已被使用

```json
{
  "detail": "兑换码已被使用"
}
```

## 订阅计划说明

### 月付计划
- 价格：根据实际定价
- 隧道配额：10个
- 有效期：30天
- 流量：不限

### 年付计划
- 价格：根据实际定价
- 隧道配额：100个
- 有效期：365天
- 流量：不限

## 续费说明

- 如果已有有效订阅，激活兑换码会在当前到期时间基础上延长
- 配额取两者中的较大值
- 例如：月付订阅到期前激活年付兑换码，配额会升级到100个
