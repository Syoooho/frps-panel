<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# dashboard

## 用途

用户仪表板页面，提供用户功能入口。

## 核心文件

| 文件 | 描述 |
|------|------|
| `Overview.tsx` | 概览页面（订阅信息、统计数据） |
| `Tunnels.tsx` | 隧道管理页面（列表、创建、编辑、删除） |
| `Activate.tsx` | 激活订阅页面（兑换码输入） |
| `Profile.tsx` | 个人资料页面（用户信息、修改密码） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 页面使用 `DashboardLayout` 布局
- 需要用户认证
- 使用 `useEffect` 加载数据
- 处理加载和错误状态

### 测试要求

- 测试数据加载
- 测试用户交互
- 测试权限控制

### 常见模式

- 使用 Zustand store 管理状态
- 使用 services API 获取数据
- 使用 UI 组件展示内容
- 表单使用 React Hook Form

## 依赖关系

### 内部依赖

- 使用 `components/layout/DashboardLayout`
- 使用 `components/ui/` 组件
- 使用 `services/` API
- 使用 `store/` 状态管理

### 外部依赖

- React
- React Hook Form
- Recharts (图表)

## 页面说明

### Overview
- 订阅信息卡片
- 隧道数量统计
- 流量统计图表

### Tunnels
- 隧道列表表格
- 创建隧道按钮
- 编辑/删除操作
- 隧道表单模态框

### Activate
- 兑换码输入框
- 激活按钮
- 激活历史记录

### Profile
- 用户信息展示
- 修改密码表单
- 保存按钮

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
