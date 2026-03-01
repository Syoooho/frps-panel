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

### 认证系统 ✅
- 登录页面（/login）
  - 用户登录
  - 管理员登录入口
  - 表单验证（React Hook Form）
  - 错误提示
- 注册页面（/register）
  - 用户注册
  - 密码确认
  - 邮箱验证

### 用户仪表板 ✅
- 概览页（/dashboard/overview）
  - 订阅状态展示
  - 隧道统计
  - 配额使用情况
  - 快捷入口
- 隧道管理（/dashboard/tunnels）
  - 隧道列表展示
  - 创建隧道（TCP/UDP/HTTP/HTTPS）
  - 删除隧道
  - 配置复制
- 激活订阅（/dashboard/activate）
  - 兑换码输入
  - 激活反馈
  - 订阅说明
- 个人信息（/dashboard/profile）
  - 用户信息展示
  - 密码修改

### 管理员后台 ✅
- 数据概览（/admin/overview）
  - 用户统计
  - 隧道统计
  - 兑换码统计
  - 在线率展示
- 用户管理（/admin/users）
  - 用户列表
  - 分页查询
  - 删除用户
- 兑换码管理（/admin/codes）
  - 兑换码列表
  - 批量生成
  - 删除兑换码
- 系统配置（/admin/config）
  - 系统参数配置

### 状态管理 ✅
- authStore - 用户认证状态（Zustand + persist）
  - Token 存储
  - 用户信息
  - 登录/登出
- tunnelStore - 隧道数据状态
  - 隧道列表
  - 增删改查操作

### 服务层 ✅
- authService - 认证 API
  - 注册、登录、获取用户信息
- tunnelService - 隧道 API
  - 获取、创建、更新、删除隧道
- subscriptionService - 订阅 API
  - 获取订阅信息、激活兑换码
- adminService - 管理员 API
  - 用户管理、兑换码管理、统计数据
- api - Axios 实例配置
  - 请求拦截（添加 Token）
  - 响应拦截（错误处理）

### UI 组件库 ✅
- Button - 按钮组件（多种变体）
- Input - 输入框组件（带验证）
- Card - 卡片组件
- Badge - 徽章组件
- Modal - 模态框组件
- Toast - 提示组件
- ConfirmDialog - 确认对话框
- Loading - 加载组件
- EmptyState - 空状态组件

### 业务组件 ✅
- TunnelCard - 隧道卡片
- TunnelForm - 隧道表单

### 布局组件 ✅
- DashboardLayout - 用户仪表板布局
- AdminLayout - 管理员后台布局

### 工具函数 ✅
- format - 格式化工具（日期、状态、类型）
- validation - 验证工具（邮箱、密码、端口、域名）

### 自定义 Hooks ✅
- useToast - Toast 通知管理
- useConfirm - 确认对话框管理

### 类型系统 ✅
- User - 用户类型
- Tunnel - 隧道类型
- Subscription - 订阅类型
- RedeemCode - 兑换码类型
- ApiResponse - API 响应类型
- PaginatedResponse - 分页响应类型

## 待实现功能

- 数据可视化图表（Recharts 集成）
- WebSocket 实时通信
- 国际化支持（i18n）
- 性能优化（代码分割、懒加载）
- 单元测试（Vitest + React Testing Library）
- E2E 测试（Playwright）

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
