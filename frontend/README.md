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
├── components/
│   ├── ui/           # 通用 UI 组件
│   └── layout/       # 布局组件
├── pages/
│   ├── auth/         # 认证页面
│   └── dashboard/    # 仪表板页面
├── services/         # API 服务
├── store/            # Zustand 状态管理
├── router/           # 路由配置
└── index.css         # 全局样式
```
