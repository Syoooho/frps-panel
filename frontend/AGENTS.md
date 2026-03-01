<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# frontend

## 用途

基于 React + Vite + Tailwind CSS 的现代化前端应用，提供用户界面和管理后台。

## 核心文件

| 文件 | 描述 |
|------|------|
| `package.json` | npm 项目配置和依赖管理 |
| `package-lock.json` | npm 依赖锁定文件 |
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 配置 |
| `tailwind.config.js` | Tailwind CSS 配置 |
| `postcss.config.js` | PostCSS 配置 |
| `index.html` | HTML 入口文件 |
| `README.md` | 前端应用说明文档 |
| `.env.example` | 环境变量配置模板 |
| `.env` | 环境变量配置（不提交到 Git） |

## 子目录

| 目录 | 用途 |
|------|------|
| `src/` | 应用源代码 (详见 `src/AGENTS.md`) |
| `public/` | 静态资源文件 |
| `node_modules/` | npm 依赖包（不提交到 Git） |

## AI Agent 工作指南

### 在此目录工作时

- 安装依赖：`npm install`
- 启动开发服务器：`npm run dev`（访问 http://localhost:3000）
- 构建生产版本：`npm run build`
- 预览生产构建：`npm run preview`
- 使用 TypeScript 严格模式，确保类型安全
- 遵循 React Hooks 最佳实践
- 使用 Tailwind CSS 进行样式开发

### 已实现功能

### 认证页面 ✅
- 登录页面（/login）
  - 用户登录
  - 管理员登录入口
  - 表单验证
  - 错误提示
- 注册页面（/register）
  - 用户注册
  - 密码确认
  - 邮箱验证

### 状态管理 ✅
- authStore - 用户认证状态（Zustand + persist）
  - Token存储
  - 用户信息
  - 登录/登出

### 服务层 ✅
- authService - 认证API调用
  - 注册、登录、获取用户信息
- api - Axios实例配置
  - 请求拦截（添加Token）
  - 响应拦截（错误处理）

### UI组件 ✅
- Button - 按钮组件
- Input - 输入框组件
- Modal - 模态框组件
- Toast - 提示组件
- ConfirmDialog - 确认对话框

### 布局组件 ✅
- DashboardLayout - 用户仪表板布局
- AdminLayout - 管理员后台布局

## 待实现功能

- 用户仪表板页面
  - 概览页
  - 隧道管理页
  - 兑换码激活页
  - 个人信息页
- 管理员后台页面
  - 数据概览
  - 用户管理
  - 兑换码管理
  - 系统配置
- 路由守卫
- 权限控制

## 测试要求

- 当前未配置测试框架
- 建议添加 Vitest + React Testing Library
- 组件应该可测试，避免过度耦合

### 常见模式

- 使用函数式组件和 Hooks
- 使用 Zustand 进行状态管理
- 使用 React Router v6 进行路由管理
- 使用 React Hook Form 处理表单
- 使用 Axios 进行 API 调用
- 使用 Lucide React 图标库
- 组件按功能分类：ui（通用组件）、layout（布局）、业务组件
- 页面按模块分类：auth（认证）、dashboard（用户面板）、admin（管理后台）

## 依赖关系

### 内部依赖

- `src/pages/` → `src/components/` (使用 UI 组件)
- `src/services/` → API 调用
- `src/store/` → 全局状态管理
- `src/router/` → 路由配置

### 外部依赖

- `react` - UI 框架
- `react-dom` - React DOM 渲染
- `react-router-dom` - 路由管理
- `vite` - 构建工具
- `typescript` - 类型系统
- `tailwindcss` - CSS 框架
- `zustand` - 状态管理
- `axios` - HTTP 客户端
- `react-hook-form` - 表单处理
- `lucide-react` - 图标库
- `recharts` - 图表库

## 设计系统

- Primary: #0F172A (深蓝)
- Secondary: #334155 (灰蓝)
- CTA: #0369A1 (蓝色)
- Background: #F8FAFC (浅灰)
- 字体：Plus Jakarta Sans
- 使用 UI/UX Pro Max 技能生成的设计系统

## 页面结构

- `/login` - 登录页面
- `/register` - 注册页面
- `/dashboard` - 用户仪表板
  - `/dashboard/overview` - 概览
  - `/dashboard/tunnels` - 隧道管理
  - `/dashboard/activate` - 激活订阅
  - `/dashboard/profile` - 个人资料
- `/admin` - 管理后台
  - `/admin/overview` - 管理概览
  - `/admin/users` - 用户管理
  - `/admin/codes` - 兑换码管理
  - `/admin/config` - 系统配置

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
