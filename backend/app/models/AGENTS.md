<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# models

## 用途

SQLAlchemy 数据库模型定义，对应数据库表结构。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `user.py` | 用户模型（邮箱、密码、角色等） |
| `subscription.py` | 订阅模型（用户订阅信息、端口数量、过期时间） |
| `activation_code.py` | 兑换码模型（兑换码、类型、状态） |
| `tunnel.py` | 隧道模型（隧道配置、类型、端口等） |
| `system_config.py` | 系统配置模型（全局配置项） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 每个文件定义一个数据库表模型
- 模型类继承 `Base`（来自 `core.database`）
- 使用 SQLAlchemy 2.0 风格的类型注解
- 修改模型后需要创建 Alembic 迁移：`alembic revision --autogenerate -m "描述"`

### 测试要求

- 测试模型的创建、查询、更新、删除
- 测试关系和约束

### 常见模式

- 使用 `Column` 定义字段
- 使用 `relationship` 定义关系
- 主键使用自增整数 `id`
- 时间戳字段：`created_at`, `updated_at`
- 布尔字段：`is_active`, `is_admin` 等

## 依赖关系

### 内部依赖

- 依赖 `core/database.py` 的 `Base` 类

### 外部依赖

- SQLAlchemy

## 数据模型说明

### User (用户)
- 邮箱登录
- 密码哈希存储
- 角色标识（普通用户/管理员）
- 激活状态

### Subscription (订阅)
- 关联用户
- 端口数量限制
- 订阅类型（月付/年付）
- 过期时间

### ActivationCode (兑换码)
- 兑换码字符串
- 类型（月付10端口/年付100端口）
- 使用状态
- 使用者和使用时间

### Tunnel (隧道)
- 关联用户
- 隧道类型（TCP/UDP/HTTP/HTTPS）
- 端口配置
- 域名配置

### SystemConfig (系统配置)
- 键值对存储
- 全局配置项

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
