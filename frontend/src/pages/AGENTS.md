<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# pages

## 用途

页面组件目录，每个页面对应一个路由。

## 核心文件

当前目录无直接文件，所有页面按模块组织在子目录中。

## 子目录

| 目录 | 用途 |
|------|------|
| `auth/` | 认证页面（登录、注册） (详见 `auth/AGENTS.md`) |
| `dashboard/` | 用户仪表板页面 (详见 `dashboard/AGENTS.md`) |
| `admin/` | 管理员后台页面 (详见 `admin/AGENTS.md`) |

## AI Agent 工作指南

### 在此目录工作时

- 每个页面是一个独立的组件
- 页面组件负责数据获取和状态管理
- 使用布局组件包裹页面内容
- 页面路由在 `router/index.tsx` 中配置

### 测试要求

- 为每个页面编写集成测试
- 测试页面加载和数据展示
- 测试用户交互流程

### 常见模式

- 页面组件使用 `useEffect` 获取数据
- 使用 Zustand store 管理状态
- 使用 `services/` 中的 API 函数
- 使用布局组件包裹内容
- 处理加载和错误状态

## 依赖关系

### 内部依赖

- 依赖 `components/` (UI 组件)
- 依赖 `services/` (API 调用)
- 依赖 `store/` (状态管理)

### 外部依赖

- React
- React Router

## 页面结构

### 认证页面
- `/login` - 登录
- `/register` - 注册

### 用户仪表板
- `/dashboard/overview` - 概览
- `/dashboard/tunnels` - 隧道管理
- `/dashboard/activate` - 激活订阅
- `/dashboard/profile` - 个人资料

### 管理后台
- `/admin/overview` - 管理概览
- `/admin/users` - 用户管理
- `/admin/codes` - 兑换码管理
- `/admin/config` - 系统配置

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
