<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# scripts

## 用途

工具脚本目录，包含数据库初始化、管理员创建等辅助脚本。

## 核心文件

| 文件 | 描述 |
|------|------|
| `init_db.py` | 数据库初始化脚本，创建所有表结构 |
| `create_admin.py` | 创建管理员账号脚本 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 脚本应该可以独立运行
- 使用 `#!/usr/bin/env python3` 作为 shebang
- 脚本需要添加 `sys.path.append('backend')` 以导入后端模块
- 运行前确保已激活 Python 虚拟环境

### 测试要求

- 脚本应该幂等（可重复执行）
- 应该有清晰的输出信息
- 错误处理应该完善

### 常见模式

- 导入后端模块：`sys.path.append('backend')`
- 使用数据库会话：`SessionLocal()`
- 使用 try-finally 确保资源释放
- 打印操作结果供用户确认

## 依赖关系

### 内部依赖

- 依赖 `backend/app/` 模块
- 使用后端的数据库配置和模型

### 外部依赖

- Python 3.11+
- 后端项目的所有依赖

## 脚本说明

### init_db.py

- 功能：创建所有数据库表
- 使用：`python scripts/init_db.py`
- 注意：会根据 SQLAlchemy 模型创建表，不会删除已有数据

### create_admin.py

- 功能：创建管理员账号
- 使用：`python scripts/create_admin.py`
- 配置：从环境变量读取 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`
- 注意：如果管理员已存在则跳过

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
