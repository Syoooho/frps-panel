<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# src

## 用途

前端应用源代码目录，包含所有 React 组件、页面、服务、状态管理等代码。

## 核心文件

| 文件 | 描述 |
|------|------|
| `main.tsx` | 应用入口文件，渲染根组件 |
| `App.tsx` | 根组件，配置路由 |
| `index.css` | 全局样式和 Tailwind CSS 导入 |
| `vite-env.d.ts` | Vite 环境类型定义 |

## 子目录

| 目录 | 用途 |
|------|------|
| `components/` | React 组件 (详见 `components/AGENTS.md`) |
| `pages/` | 页面组件 (详见 `pages/AGENTS.md`) |
| `router/` | 路由配置 (详见 `router/AGENTS.md`) |
| `services/` | API 服务 (详见 `services/AGENTS.md`) |
| `store/` | Zustand 状态管理 (详见 `store/AGENTS.md`) |
| `assets/` | 静态资源 (详见 `assets/AGENTS.md`) |
| `hooks/` | 自定义 Hooks（待实现） |
| `types/` | TypeScript 类型定义（待实现） |
| `utils/` | 工具函数（待实现） |

## AI Agent 工作指南

### 在此目录工作时

- `main.tsx` 是应用入口，挂载 React 应用
- `App.tsx` 配置路由和全局布局
- 使用 TypeScript 严格模式
- 使用 Tailwind CSS 进行样式开发
- 组件使用函数式组件和 Hooks

### 测试要求

- 当前未配置测试
- 建议使用 Vitest + React Testing Library

### 常见模式

- 组件文件使用 PascalCase 命名
- 使用 `.tsx` 扩展名
- 导出默认组件
- Props 使用 TypeScript 接口定义
- 使用 Zustand 管理全局状态
- 使用 React Router v6 进行路由

## 依赖关系

### 内部依赖

- `main.tsx` → `App.tsx`
- `App.tsx` → `router/`
- `pages/` → `components/`
- `pages/` → `services/`
- `pages/` → `store/`

### 外部依赖

- React
- React Router
- Zustand
- Axios
- Tailwind CSS

## 应用结构

```
main.tsx (入口)
  ↓
App.tsx (路由配置)
  ↓
pages/ (页面)
  ↓
components/ (组件)
```

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
