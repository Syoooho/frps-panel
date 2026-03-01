<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# components

## 用途

React 组件目录，包含可复用的 UI 组件和布局组件。

## 核心文件

当前目录无直接文件，所有组件按类型组织在子目录中。

## 子目录

| 目录 | 用途 |
|------|------|
| `ui/` | 通用 UI 组件（按钮、模态框、表单等） (详见 `ui/AGENTS.md`) |
| `layout/` | 布局组件（导航栏、侧边栏等） (详见 `layout/AGENTS.md`) |
| `tunnel/` | 隧道相关组件 |
| `common/` | 通用业务组件 |

## AI Agent 工作指南

### 在此目录工作时

- 组件应该可复用、可组合
- 使用 TypeScript 定义 Props 接口
- 使用 Tailwind CSS 进行样式开发
- 组件应该职责单一
- 复杂组件应拆分为子组件

### 测试要求

- 为每个组件编写单元测试
- 测试不同 Props 的渲染结果
- 测试用户交互

### 常见模式

- 函数式组件 + Hooks
- Props 接口命名：`{ComponentName}Props`
- 使用 `clsx` 处理条件样式
- 使用 Lucide React 图标
- 组件导出：`export default ComponentName`

## 依赖关系

### 内部依赖

- 被 `pages/` 使用

### 外部依赖

- React
- Lucide React (图标)
- Tailwind CSS

## 组件分类

### UI 组件
- 通用、无业务逻辑
- 高度可复用
- 示例：Button, Modal, Input

### 布局组件
- 页面结构组件
- 示例：DashboardLayout, AdminLayout

### 业务组件
- 包含业务逻辑
- 特定功能
- 示例：TunnelForm, UserTable

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
