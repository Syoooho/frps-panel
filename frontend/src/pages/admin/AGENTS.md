<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# admin

## 用途

管理员后台页面，提供系统管理功能。

## 核心文件

| 文件 | 描述 |
|------|------|
| `AdminOverview.tsx` | 管理概览页面（系统统计、用户统计） |
| `UserManagement.tsx` | 用户管理页面（用户列表、禁用/启用） |
| `CodeManagement.tsx` | 兑换码管理页面（生成、列表、状态） |
| `SystemConfig.tsx` | 系统配置页面（全局配置项） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 页面使用 `AdminLayout` 布局
- 需要管理员权限
- 使用 `useEffect` 加载数据
- 处理加载和错误状态

### 测试要求

- 测试数据加载
- 测试管理操作
- 测试权限控制

### 常见模式

- 使用 services API 获取数据
- 使用 UI 组件展示内容
- 表格展示列表数据
- 确认对话框确认危险操作

## 依赖关系

### 内部依赖

- 使用 `components/layout/AdminLayout`
- 使用 `components/ui/` 组件
- 使用 `services/` API

### 外部依赖

- React
- Recharts (图表)

## 页面说明

### AdminOverview
- 用户总数统计
- 订阅统计
- 隧道统计
- 收入统计图表

### UserManagement
- 用户列表表格
- 搜索和筛选
- 禁用/启用用户
- 查看用户详情

### CodeManagement
- 生成兑换码表单
- 兑换码列表表格
- 状态筛选
- 导出功能

### SystemConfig
- 配置项列表
- 编辑配置
- 保存按钮

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
