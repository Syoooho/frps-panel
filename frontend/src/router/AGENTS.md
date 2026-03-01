<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# router

## 用途

React Router 路由配置，定义应用的所有路由规则。

## 核心文件

| 文件 | 描述 |
|------|------|
| `index.tsx` | 路由配置文件，定义所有路由和权限控制 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 使用 React Router v6 的 `createBrowserRouter`
- 路由配置使用对象形式
- 实现路由守卫（认证、权限检查）
- 懒加载页面组件优化性能

### 测试要求

- 测试路由跳转
- 测试路由守卫逻辑
- 测试 404 页面

### 常见模式

- 使用 `createBrowserRouter` 创建路由
- 使用 `RouterProvider` 提供路由
- 嵌套路由使用 `children`
- 路由守卫使用 `loader` 或自定义组件
- 懒加载：`lazy(() => import('./Page'))`

## 依赖关系

### 内部依赖

- 依赖 `pages/` (页面组件)
- 依赖 `store/authStore` (认证状态)

### 外部依赖

- React Router

## 路由结构

```
/ (公开)
├── /login (登录)
├── /register (注册)
├── /dashboard (需认证)
│   ├── /overview
│   ├── /tunnels
│   ├── /activate
│   └── /profile
└── /admin (需管理员权限)
    ├── /overview
    ├── /users
    ├── /codes
    └── /config
```

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
