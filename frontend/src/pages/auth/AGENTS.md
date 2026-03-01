<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# auth

## 用途

认证相关页面，包含登录和注册功能。

## 核心文件

| 文件 | 描述 |
|------|------|
| `Login.tsx` | 登录页面 |
| `Register.tsx` | 注册页面 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 使用 React Hook Form 处理表单
- 表单验证使用 Zod 或内置验证
- 登录成功后跳转到仪表板
- 显示错误提示

### 测试要求

- 测试表单验证
- 测试登录/注册流程
- 测试错误处理

### 常见模式

- 使用 `useForm` hook
- 使用 `authStore` 管理登录状态
- 使用 `useNavigate` 进行跳转
- 显示加载状态

## 依赖关系

### 内部依赖

- 使用 `services/auth` API
- 使用 `store/authStore` 状态管理
- 使用 `components/ui/` 组件

### 外部依赖

- React Hook Form
- React Router

## 页面说明

### Login
- 邮箱和密码输入
- 记住我选项
- 登录按钮
- 跳转到注册页面链接

### Register
- 邮箱、密码、确认密码输入
- 注册按钮
- 跳转到登录页面链接

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
