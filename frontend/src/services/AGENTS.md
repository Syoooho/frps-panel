<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# services

## 用途

API 服务层，封装所有与后端 API 的通信逻辑。

## 核心文件

| 文件 | 描述 |
|------|------|
| `api.ts` | Axios 实例配置和通用 API 工具 |
| `auth.ts` | 认证相关 API（登录、注册、获取用户信息） |
| `tunnel.ts` | 隧道管理相关 API |
| `mockApi.ts` | Mock API 数据（开发阶段使用） |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 每个文件对应一组相关的 API
- 使用 `api.ts` 中配置的 Axios 实例
- API 函数应该返回 Promise
- 使用 TypeScript 定义请求和响应类型
- 错误处理应该统一

### 测试要求

- 为每个 API 函数编写单元测试
- 使用 Mock 隔离网络请求

### 常见模式

- 函数命名：`getXxx`, `createXxx`, `updateXxx`, `deleteXxx`
- 使用 async/await
- 导出函数：`export const functionName = async () => {}`
- 请求拦截器添加 Token
- 响应拦截器处理错误

## 依赖关系

### 内部依赖

- 被 `pages/` 和 `store/` 使用

### 外部依赖

- Axios

## API 服务说明

### api.ts
- Axios 实例配置
- 请求/响应拦截器
- 基础 URL 配置
- Token 自动添加

### auth.ts
- 用户登录
- 用户注册
- 获取当前用户信息
- 刷新令牌

### tunnel.ts
- 获取隧道列表
- 创建隧道
- 更新隧道
- 删除隧道

### mockApi.ts
- Mock 数据生成
- 开发阶段使用
- 生产环境应移除

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
