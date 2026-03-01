<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# layout

## 用途

布局组件，定义页面的整体结构和导航。

## 核心文件

| 文件 | 描述 |
|------|------|
| `DashboardLayout.tsx` | 用户仪表板布局（侧边栏导航） |
| `AdminLayout.tsx` | 管理员后台布局（侧边栏导航） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 布局组件定义页面结构
- 包含导航栏、侧边栏、内容区域
- 使用 `children` 渲染页面内容
- 响应式设计

### 测试要求

- 测试导航功能
- 测试响应式布局

### 常见模式

- 使用 `Outlet` 渲染子路由
- 使用 `useLocation` 高亮当前路由
- 使用 Tailwind CSS 实现响应式
- 包含用户信息和退出按钮

## 依赖关系

### 内部依赖

- 被 `pages/` 使用
- 使用 `components/ui/` 组件
- 使用 `store/authStore` 获取用户信息

### 外部依赖

- React Router
- Lucide React

## 布局说明

### DashboardLayout
- 侧边栏导航
- 顶部用户信息
- 导航项：概览、隧道、激活、个人资料
- 响应式设计

### AdminLayout
- 侧边栏导航
- 顶部用户信息
- 导航项：概览、用户管理、兑换码、系统配置
- 响应式设计

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
