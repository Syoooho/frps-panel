<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# alembic

## 用途

Alembic 数据库迁移工具配置和迁移脚本目录。

## 核心文件

当前目录无直接文件（配置文件在上级目录）。

## 子目录

| 目录 | 用途 |
|------|------|
| `versions/` | 数据库迁移脚本存储目录 |

## AI Agent 工作指南

### 在此目录工作时

- 创建迁移：`alembic revision --autogenerate -m "描述"`
- 应用迁移：`alembic upgrade head`
- 回滚迁移：`alembic downgrade -1`
- 查看历史：`alembic history`
- 不要手动修改已应用的迁移文件

### 测试要求

- 测试迁移的 upgrade 和 downgrade
- 确保迁移可逆

### 常见模式

- 迁移文件自动生成
- 文件命名：`{revision}_{description}.py`
- 包含 `upgrade()` 和 `downgrade()` 函数

## 依赖关系

### 内部依赖

- 依赖 `app/models/` (检测模型变更)
- 依赖 `app/core/database.py` (数据库连接)

### 外部依赖

- Alembic
- SQLAlchemy

## 迁移流程

1. 修改 `app/models/` 中的模型
2. 运行 `alembic revision --autogenerate -m "描述"`
3. 检查生成的迁移文件
4. 运行 `alembic upgrade head` 应用迁移

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
