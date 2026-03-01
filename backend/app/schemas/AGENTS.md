<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# schemas

## 用途

Pydantic 数据模型定义，用于 API 请求验证和响应序列化。

## 核心文件

| 文件 | 描述 |
|------|------|
| `__init__.py` | Python 包初始化文件 |
| `common.py` | 通用响应模型和基础模型 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 为每个 API 端点定义请求和响应模型
- 模型类继承 `BaseModel`
- 使用 Pydantic v2 语法
- 请求模型命名：`{Resource}Create`, `{Resource}Update`
- 响应模型命名：`{Resource}Response`, `{Resource}List`

### 测试要求

- 测试数据验证规则
- 测试序列化和反序列化

### 常见模式

- 使用类型注解定义字段
- 使用 `Field` 添加验证规则和描述
- 使用 `ConfigDict` 配置模型行为
- 响应模型通常包含 `id` 和时间戳字段

## 依赖关系

### 内部依赖

- 被 `api/` 模块使用

### 外部依赖

- Pydantic

## Schema 分类

### 请求模型
- 用于验证客户端请求数据
- 不包含 `id` 等自动生成字段

### 响应模型
- 用于序列化返回数据
- 包含完整的数据库字段
- 使用 `from_attributes=True` 支持 ORM 模型转换

### 通用模型
- 统一响应格式
- 分页模型
- 错误响应模型

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
