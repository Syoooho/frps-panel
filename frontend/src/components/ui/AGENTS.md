<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# ui

## 用途

通用 UI 组件库，提供可复用的基础组件。

## 核心文件

| 文件 | 描述 |
|------|------|
| `Button.tsx` | 按钮组件（支持多种样式和尺寸） |
| `Modal.tsx` | 模态框组件 |
| `Toast.tsx` | 提示消息组件 |
| `ConfirmDialog.tsx` | 确认对话框组件 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 组件应该高度可复用
- 无业务逻辑，只负责展示
- 支持自定义样式
- 使用 TypeScript 定义 Props
- 使用 Tailwind CSS

### 测试要求

- 为每个组件编写单元测试
- 测试不同 Props 的渲染
- 测试用户交互

### 常见模式

- Props 接口定义清晰
- 支持 className 自定义样式
- 使用 children 支持内容插槽
- 使用 Lucide React 图标
- 组件应该可访问（a11y）

## 依赖关系

### 内部依赖

- 被所有页面和组件使用

### 外部依赖

- React
- Lucide React
- Tailwind CSS

## 组件说明

### Button
- 多种样式：primary, secondary, danger
- 多种尺寸：sm, md, lg
- 支持禁用状态
- 支持加载状态

### Modal
- 遮罩层
- 关闭按钮
- 自定义内容
- 动画效果

### Toast
- 成功、错误、警告、信息提示
- 自动消失
- 可关闭

### ConfirmDialog
- 确认操作
- 自定义标题和内容
- 确认/取消按钮

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
