<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# core

## 用途

核心配置和工具模块，包含应用配置、数据库连接、安全工具等基础设施代码。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `config.py` | 应用配置（使用 pydantic-settings 从环境变量读取） |
| `database.py` | 数据库连接和会话管理 |
| `security.py` | 安全工具（密码哈希、JWT 生成和验证） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- `config.py` 使用 pydantic-settings 管理配置，所有配置从环境变量读取
- `database.py` 定义 SQLAlchemy 引擎和会话工厂
- `security.py` 提供密码哈希和 JWT 处理函数
- 修改配置项需同步更新 `.env.example`

### 测试要求

- 测试配置加载
- 测试密码哈希和验证
- 测试 JWT 生成和解析

### 常见模式

- 配置类继承 `BaseSettings`
- 使用 `Settings()` 实例化配置对象
- 密码使用 bcrypt 哈希
- JWT 使用 HS256 算法

## 依赖关系

### 内部依赖

- 被所有其他模块依赖

### 外部依赖

- pydantic-settings (配置管理)
- SQLAlchemy (数据库)
- python-jose (JWT)
- passlib (密码哈希)

## 配置项说明

- `DATABASE_URL` - 数据库连接字符串
- `SECRET_KEY` - JWT 签名密钥（必须设置）
- `ALGORITHM` - JWT 算法（默认 HS256）
- `ACCESS_TOKEN_EXPIRE_MINUTES` - 访问令牌过期时间
- `REFRESH_TOKEN_EXPIRE_DAYS` - 刷新令牌过期时间
- `ADMIN_EMAIL` - 默认管理员邮箱
- `ADMIN_PASSWORD` - 默认管理员密码
- `FRP_PLUGIN_URL` - FRP 插件地址

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
