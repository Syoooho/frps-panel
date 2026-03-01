# FRP SaaS平台 - 前端设计

## 技术栈

- **框架**：React 18
- **构建工具**：Vite
- **路由**：React Router v6
- **状态管理**：Zustand 或 React Context
- **UI组件库**：Ant Design 或 Tailwind CSS + Headless UI
- **HTTP客户端**：Axios
- **表单处理**：React Hook Form
- **图表**：ECharts 或 Recharts

## 用户端页面结构

### 公开页面
```
/login                    # 登录页
/register                 # 注册页
```

### 用户仪表板（需登录）
```
/dashboard                # 用户仪表板
  ├─ /dashboard/overview  # 概览
  ├─ /dashboard/tunnels   # 隧道管理
  ├─ /dashboard/activate  # 兑换码激活
  └─ /dashboard/profile   # 个人信息
```

## 管理员端页面结构

```
/admin/login              # 管理员登录
/admin                    # 管理员仪表板
  ├─ /admin/overview      # 数据概览
  ├─ /admin/users         # 用户管理
  ├─ /admin/codes         # 兑换码管理
  ├─ /admin/config        # 系统配置
  └─ /admin/tunnels       # 全局隧道监控
```

## 页面详细设计

### 1. 登录页 (/login)

**功能**：
- 邮箱和密码输入
- 记住我选项
- 登录按钮
- 跳转到注册页链接

**表单验证**：
- 邮箱格式验证
- 密码非空验证

### 2. 注册页 (/register)

**功能**：
- 邮箱输入
- 密码输入（带强度提示）
- 确认密码
- 注册按钮
- 跳转到登录页链接

**表单验证**：
- 邮箱格式和唯一性
- 密码强度（至少8位）
- 两次密码一致性

### 3. 用户概览页 (/dashboard/overview)

**显示内容**：
- 订阅状态卡片
  - 套餐类型（月付/年付）
  - 到期时间
  - 剩余天数
- 配额使用情况
  - 端口配额进度条
  - 已用/总配额数字
- 隧道统计
  - 总隧道数
  - 在线隧道数
- 快捷操作
  - 创建隧道按钮
  - 激活兑换码按钮

### 4. 隧道管理页 (/dashboard/tunnels)

**功能**：
- 隧道列表展示
  - 表格或卡片形式
  - 显示：名称、类型、端口、状态、操作
- 创建隧道按钮
- 搜索和筛选
  - 按类型筛选
  - 按状态筛选

**隧道卡片内容**：
- 隧道名称
- 类型标签（TCP/UDP/HTTP/HTTPS）
- 状态指示器（在线/离线）
- 连接信息
  - TCP/UDP：显示远程地址和端口
  - HTTP/HTTPS：显示访问URL
- 操作按钮
  - 编辑
  - 删除
  - 复制配置

**创建隧道对话框**：
- 隧道名称输入
- 类型选择（下拉菜单）
- 本地端口输入
- 根据类型显示不同字段：
  - TCP/UDP：远程端口（可选）
  - HTTP/HTTPS：域名或子域名
- 创建按钮

### 5. 兑换码激活页 (/dashboard/activate)

**功能**：
- 兑换码输入框
- 激活按钮
- 激活历史记录
  - 显示已使用的兑换码
  - 激活时间
  - 套餐类型

### 6. 个人信息页 (/dashboard/profile)

**显示内容**：
- 邮箱（不可修改）
- 注册时间
- 最后登录时间
- 修改密码功能
- 登出按钮

### 7. 管理员概览页 (/admin/overview)

**统计卡片**：
- 总用户数
- 活跃用户数
- 总隧道数
- 在线隧道数

**图表**：
- 用户增长趋势（折线图）
- 隧道类型分布（饼图）
- 每日活跃用户（柱状图）

### 8. 用户管理页 (/admin/users)

**功能**：
- 用户列表表格
  - 显示：ID、邮箱、订阅状态、隧道数、注册时间
- 搜索功能（按邮箱）
- 筛选功能（按状态）
- 操作按钮
  - 查看详情
  - 禁用/启用
  - 删除

**用户详情对话框**：
- 基本信息
- 订阅详情
- 隧道列表
- 操作日志

### 9. 兑换码管理页 (/admin/codes)

**功能**：
- 批量生成表单
  - 套餐类型选择
  - 生成数量输入
  - 有效期设置
  - 生成按钮
- 兑换码列表
  - 显示：兑换码、套餐、状态、使用者、创建时间
- 导出功能（CSV）
- 删除功能（仅未使用）

### 10. 系统配置页 (/admin/config)

**配置项**：
- 月付套餐配置
  - 端口数量
  - 价格说明
- 年付套餐配置
  - 端口数量
  - 价格说明
- 其他配置
  - 默认域名
  - 端口范围
  - 宽限期天数
- 保存按钮

## 关键UI组件

### 1. 配额进度条组件
```jsx
<QuotaProgress 
  used={3} 
  total={10} 
  label="端口配额"
/>
```

### 2. 隧道状态指示器
```jsx
<StatusBadge 
  status="online"  // online/offline
  text="在线"
/>
```

### 3. 隧道卡片组件
```jsx
<TunnelCard
  name="my-ssh"
  type="tcp"
  status="online"
  remotePort={10022}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### 4. 统计卡片组件
```jsx
<StatCard
  title="总用户数"
  value={1000}
  icon={<UserIcon />}
  trend="+10%"
/>
```

## 响应式设计

- 移动端优先设计
- 断点：
  - 手机：< 768px
  - 平板：768px - 1024px
  - 桌面：> 1024px
- 移动端隧道列表使用卡片布局
- 桌面端使用表格布局

## 状态管理

使用Zustand管理全局状态：

```javascript
// stores/authStore.js
- user: 当前用户信息
- token: JWT token
- login()
- logout()
- refreshToken()

// stores/subscriptionStore.js
- subscription: 订阅信息
- quota: 配额信息
- fetchSubscription()

// stores/tunnelStore.js
- tunnels: 隧道列表
- fetchTunnels()
- createTunnel()
- deleteTunnel()
```

## API调用封装

```javascript
// services/api.js
- 统一的axios实例
- 请求拦截器（添加token）
- 响应拦截器（处理错误）
- 自动刷新token机制

// services/auth.js
- register()
- login()
- logout()

// services/tunnel.js
- getTunnels()
- createTunnel()
- updateTunnel()
- deleteTunnel()
```
