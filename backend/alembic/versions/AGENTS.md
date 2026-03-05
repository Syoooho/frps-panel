<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-05 | Updated: 2026-03-05 -->

# versions

## 目的

存放 Alembic 数据库迁移脚本，用于管理数据库结构的版本演进。每个迁移脚本代表一次数据库结构变更，按编号顺序执行。

## 核心文件

| 文件 | 描述 |
|------|------|
| `001_20260305_add_security_tables.py` | 添加安全相关表（登录日志、登录尝试、审计日志） |
| `002_20260305_add_tunnel_encryption.py` | 为隧道表添加加密和压缩选项字段 |
| `003_20260305_add_custom_ports.py` | 为隧道表添加自定义 HTTP/HTTPS 端口字段 |

## 迁移依赖链

```
001_add_security_tables (基础)
    ↓
002_add_tunnel_encryption
    ↓
003_add_custom_ports (最新)
```

## AI Agent 工作指南

### 在此目录工作时

- 迁移脚本使用编号命名：`XXX_YYYYMMDD_description.py`
- 每个脚本必须定义 `revision`、`down_revision`、`upgrade()` 和 `downgrade()`
- 新迁移的 `down_revision` 必须指向当前最新的迁移版本
- 迁移脚本一旦部署到生产环境，不应修改
- 使用 `uv run alembic` 命令执行迁移操作

### 测试要求

```bash
# 测试升级
cd backend
uv run alembic upgrade head

# 测试降级
uv run alembic downgrade -1

# 验证当前版本
uv run alembic current

# 查看迁移历史
uv run alembic history
```

### 常见模式

- 使用 `op.create_table()` 创建新表
- 使用 `op.add_column()` 添加新字段
- 使用 `op.create_index()` 创建索引
- 使用 `op.create_foreign_key()` 创建外键
- 在 `downgrade()` 中实现完整的回滚逻辑

### 创建新迁移

1. 确定下一个编号（当前最大编号 + 1）
2. 创建文件：`XXX_YYYYMMDD_description.py`
3. 设置 `revision = 'XXX_description'`
4. 设置 `down_revision = '上一个迁移的revision'`
5. 实现 `upgrade()` 和 `downgrade()` 函数
6. 测试升级和降级操作

## 依赖关系

### 内部依赖

- `backend/app/models/` - 数据库模型定义
- `backend/app/core/database.py` - 数据库连接配置
- `backend/alembic/env.py` - Alembic 环境配置

### 外部依赖

- `alembic` - 数据库迁移工具
- `sqlalchemy` - ORM 框架

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
