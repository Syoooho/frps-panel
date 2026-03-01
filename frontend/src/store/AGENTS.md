<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# store

## 用途

Zustand 状态管理，管理全局应用状态。

## 核心文件

| 文件 | 描述 |
|------|------|
| `authStore.ts` | 认证状态管理（用户信息、登录状态、Token） |
| `tunnelStore.ts` | 隧道状态管理（隧道列表、当前隧道） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 每个 store 管理一个领域的状态
- 使用 Zustand 的 `create` 函数创建 store
- State 和 Actions 定义在同一个对象中
- 使用 TypeScript 定义 Store 接口

### 测试要求

- 测试 store 的状态更新逻辑
- 测试 actions 的副作用

### 常见模式

- Store 接口命名：`{Domain}Store`
- Actions 命名：`setXxx`, `updateXxx`, `resetXxx`
- 使用 `create<StoreInterface>()` 创建 store
- 在组件中使用：`const { state, action } = useStore()`

## 依赖关系

### 内部依赖

- 被 `pages/` 和 `components/` 使用
- 可能调用 `services/` 中的 API

### 外部依赖

- Zustand

## Store 说明

### authStore
- 用户信息
- 登录状态
- Token 管理
- 登录/登出 actions

### tunnelStore
- 隧道列表
- 当前选中隧道
- 加载状态
- CRUD actions

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
