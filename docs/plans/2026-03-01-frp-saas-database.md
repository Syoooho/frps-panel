# FRP SaaS平台 - 数据库设计

## 数据库选型

- **类型**：SQLite
- **原因**：轻量级，适合初期部署，后期可迁移到MySQL/PostgreSQL
- **ORM**：SQLAlchemy

## 核心数据表

### 1. users (用户表)

用户账号信息表

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INTEGER | 主键 | PRIMARY KEY |
| email | VARCHAR(255) | 邮箱 | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | 密码哈希 | NOT NULL |
| is_active | BOOLEAN | 是否激活 | DEFAULT FALSE |
| is_admin | BOOLEAN | 是否管理员 | DEFAULT FALSE |
| created_at | DATETIME | 创建时间 | NOT NULL |
| last_login | DATETIME | 最后登录时间 | NULL |

**索引**：
- `idx_email` ON email
- `idx_is_active` ON is_active

### 2. subscriptions (订阅表)

用户订阅和配额信息

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INTEGER | 主键 | PRIMARY KEY |
| user_id | INTEGER | 用户ID | FOREIGN KEY, NOT NULL |
| plan_type | VARCHAR(20) | 套餐类型 | NOT NULL (monthly/yearly) |
| port_quota | INTEGER | 端口配额 | NOT NULL (10或100) |
| used_ports | INTEGER | 已使用端口数 | DEFAULT 0 |
| start_date | DATETIME | 开始日期 | NOT NULL |
| expire_date | DATETIME | 到期日期 | NOT NULL |
| status | VARCHAR(20) | 状态 | NOT NULL (active/expired/suspended) |
| created_at | DATETIME | 创建时间 | NOT NULL |

**索引**：
- `idx_user_id` ON user_id
- `idx_status` ON status
- `idx_expire_date` ON expire_date

**约束**：
- 一个用户同时只能有一个active状态的订阅

### 3. activation_codes (兑换码表)

兑换码管理表

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INTEGER | 主键 | PRIMARY KEY |
| code | VARCHAR(32) | 兑换码 | UNIQUE, NOT NULL |
| plan_type | VARCHAR(20) | 套餐类型 | NOT NULL (monthly/yearly) |
| port_quota | INTEGER | 端口配额 | NOT NULL |
| is_used | BOOLEAN | 是否已使用 | DEFAULT FALSE |
| used_by | INTEGER | 使用者ID | FOREIGN KEY, NULL |
| used_at | DATETIME | 使用时间 | NULL |
| created_by | INTEGER | 创建者ID | FOREIGN KEY, NOT NULL |
| created_at | DATETIME | 创建时间 | NOT NULL |
| expire_at | DATETIME | 兑换码过期时间 | NULL |

**索引**：
- `idx_code` ON code
- `idx_is_used` ON is_used
- `idx_created_by` ON created_by

### 4. tunnels (隧道表)

用户隧道配置表

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INTEGER | 主键 | PRIMARY KEY |
| user_id | INTEGER | 用户ID | FOREIGN KEY, NOT NULL |
| name | VARCHAR(100) | 隧道名称 | NOT NULL |
| type | VARCHAR(20) | 类型 | NOT NULL (tcp/udp/http/https/stcp/sudp) |
| local_port | INTEGER | 本地端口 | NOT NULL |
| remote_port | INTEGER | 远程端口 | NULL |
| custom_domain | VARCHAR(255) | 自定义域名 | NULL |
| subdomain | VARCHAR(100) | 子域名 | NULL |
| status | VARCHAR(20) | 状态 | DEFAULT 'offline' (online/offline) |
| created_at | DATETIME | 创建时间 | NOT NULL |
| last_active | DATETIME | 最后活跃时间 | NULL |

**索引**：
- `idx_user_id` ON user_id
- `idx_remote_port` ON remote_port
- `idx_custom_domain` ON custom_domain
- `idx_status` ON status

**约束**：
- remote_port 全局唯一（非NULL时）
- custom_domain 全局唯一（非NULL时）
- 同一用户的name唯一

### 5. system_config (系统配置表)

系统全局配置表

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INTEGER | 主键 | PRIMARY KEY |
| key | VARCHAR(100) | 配置键 | UNIQUE, NOT NULL |
| value | TEXT | 配置值(JSON) | NOT NULL |
| description | TEXT | 描述 | NULL |
| updated_at | DATETIME | 更新时间 | NOT NULL |

**预设配置项**：

```json
{
  "monthly_plan": {
    "ports": 10,
    "price": "月付价格",
    "duration_days": 30
  },
  "yearly_plan": {
    "ports": 100,
    "price": "年付价格",
    "duration_days": 365
  },
  "max_tunnels_per_user": 50,
  "default_subdomain": "example.com",
  "port_range": {
    "start": 10000,
    "end": 60000
  },
  "grace_period_days": 1
}
```

## 数据关系

```
users (1) ----< (N) subscriptions
users (1) ----< (N) tunnels
users (1) ----< (N) activation_codes (used_by)
users (1) ----< (N) activation_codes (created_by)
```

## 数据迁移策略

使用 Alembic 进行数据库版本管理：

1. 初始化迁移环境
2. 创建初始表结构
3. 插入默认系统配置
4. 创建默认管理员账号

## 数据备份策略

- 每日自动备份SQLite文件
- 保留最近7天的备份
- 支持手动导出/导入
