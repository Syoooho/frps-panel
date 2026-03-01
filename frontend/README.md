# FRP SaaS Platform - Frontend

基于 React + Vite + Tailwind CSS 的现代化前端应用

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- React Router v6
- React Hook Form
- Lucide React (图标)
- Axios

## 安装依赖

```bash
cd frontend
npm install
```

## 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

## 运行开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

## 设计系统

本项目使用 UI/UX Pro Max 技能生成的设计系统，配色方案：

- Primary: #0F172A (深蓝)
- Secondary: #334155 (灰蓝)
- CTA: #0369A1 (蓝色)
- Background: #F8FAFC (浅灰)

字体：Plus Jakarta Sans

## 项目结构

```
src/
├── assets/           # 静态资源
│   └── styles/      # 样式文件
├── components/
│   ├── common/      # 通用组件（Card、EmptyState、Loading）
│   ├── layout/      # 布局组件（DashboardLayout、AdminLayout）
│   ├── tunnel/      # 隧道组件（TunnelCard、TunnelForm）
│   └── ui/          # UI 基础组件（Button、Modal、Input、Toast 等）
├── hooks/           # 自定义 Hooks（useToast、useConfirm）
├── pages/
│   ├── admin/       # 管理员页面（概览、用户、兑换码、配置）
│   ├── auth/        # 认证页面（登录、注册）
│   └── dashboard/   # 用户仪表板（概览、隧道、激活、个人信息）
├── router/          # 路由配置
├── services/        # API 服务（auth、tunnel、subscription、admin）
├── store/           # Zustand 状态管理（authStore、tunnelStore）
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数（format、validation）
├── App.tsx          # 根组件
├── main.tsx         # 入口文件
└── index.css        # 全局样式
```

## 核心功能

### 用户功能
- ✅ 用户注册/登录（表单验证）
- ✅ 仪表板概览（订阅状态、隧道统计、配额使用）
- ✅ 隧道管理（TCP/UDP/HTTP/HTTPS）
- ✅ 兑换码激活（月付/年付）
- ✅ 个人信息管理（密码修改）

### 管理员功能
- ✅ 管理员登录（独立入口）
- ✅ 系统概览（用户、隧道、兑换码统计）
- ✅ 用户管理（查看、删除、分页）
- ✅ 兑换码管理（生成、查看、删除）
- ✅ 系统配置

### 技术特性
- ✅ TypeScript 严格模式
- ✅ Zustand 状态管理（持久化）
- ✅ React Hook Form 表单验证
- ✅ Axios 请求拦截和错误处理
- ✅ 路由守卫和权限控制
- ✅ 响应式设计（Tailwind CSS）
- ✅ 组件化开发（可复用组件库）

## 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS
- API 调用统一通过 services 层
- 状态管理使用 Zustand
- 表单验证使用 React Hook Form

## 测试账号

- 普通用户：test@example.com / test1234
- 管理员：admin@example.com / admin123
