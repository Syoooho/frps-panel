# FRP SaaS 平台

基于 FRP (Fast Reverse Proxy) 的现代化 SaaS 平台，为个人开发者提供内网穿透服务。

[English](./README.md) | [部署指南](./docs/deployment.md)

## 功能特性

- 🔐 用户注册和邮箱登录
- 🎫 兑换码激活订阅（月付10端口，年付100端口）
- 🚇 隧道管理（TCP/UDP/HTTP/HTTPS）
- 📊 管理员后台（实时监控）
- ♾️ 流量不限
- 👥 多用户鉴权
- 🔒 端口、域名、二级域名限制
- 📈 系统资源监控（CPU、内存、磁盘、FRP 状态）
- 📝 结构化日志系统
- 🔄 自动化部署（数据库保护）

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand（状态管理）
- React Router v6
- React Hook Form

### 后端
- FastAPI
- SQLAlchemy + SQLite
- JWT 认证
- Bcrypt 密码哈希
- Pydantic 数据验证
- 结构化日志

### 插件
- Go 1.21+
- FRP 0.67.0+

## 快速开始

### 环境要求

- Python 3.11+
- Node.js 18+
- uv（Python 包管理器）
- npm

### 1. 初始化数据库

```bash
cd backend
uv run python -m app.init_db
```

### 2. 启动后端服务

```bash
cd backend
uv run uvicorn app.main:app --reload
```

后端运行在 http://localhost:8000
- API 文档：http://localhost:8000/docs
- ReDoc：http://localhost:8000/redoc

### 3. 启动前端应用

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:3000

### 4. 启动 FRP 服务器和插件

```bash
# 启动 FRP 服务器
cd frp_0.67.0_linux_amd64
./frps -c frps.toml

# 启动插件（另一个终端）
cd frp-plugin
go build -o frps-panel ./cmd/frps-panel
./frps-panel -c config/frps-panel.toml
```

## 测试账号

- **管理员**：admin@example.com / admin123
- **普通用户**：test@example.com / test1234（带月付订阅）

测试兑换码：
- 月付：MONTHLY-TEST-0000 ~ 0004
- 年付：YEARLY-TEST-0000 ~ 0004

## 项目结构

```
frps-panel/
├── backend/              # FastAPI 后端服务
│   ├── app/             # 应用代码
│   │   ├── api/         # API 路由
│   │   ├── models/      # 数据库模型
│   │   ├── schemas/     # Pydantic 模式
│   │   ├── services/    # 业务逻辑
│   │   └── core/        # 核心工具
│   ├── logs/            # 应用日志
│   └── tests/           # 测试文件
├── frontend/            # React 前端应用
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── pages/       # 页面组件
│   │   ├── services/    # API 服务
│   │   ├── store/       # 状态管理
│   │   └── utils/       # 工具函数
│   └── public/          # 静态资源
├── frp-plugin/          # Go FRP 插件
│   ├── cmd/             # 命令入口
│   ├── config/          # 配置文件
│   └── pkg/             # 插件包
├── docs/                # 文档
│   ├── api/             # API 文档
│   └── plans/           # 设计文档
├── scripts/             # 工具脚本
│   ├── rollback.sh      # 回滚脚本
│   └── ...
└── .github/             # GitHub Actions 工作流
    └── workflows/
        └── deploy.yml   # 自动部署
```

## 开发状态

### 已完成 ✅

- ✅ 项目骨架搭建（前端 + 后端 + 插件）
- ✅ 用户认证系统（注册、登录、JWT）
- ✅ 完整前端实现（所有页面和组件）
- ✅ 完整后端 API 实现（所有接口）
- ✅ 前后端联调（100% API 测试通过）
- ✅ FRP 插件集成（Go 插件 + HTTP 服务器）
- ✅ 系统监控和日志（CPU、内存、磁盘、FRP 状态）
- ✅ 隧道管理（创建、编辑、删除、复制配置）
- ✅ 管理员后台（用户管理、兑换码管理、系统配置）
- ✅ 数据库初始化和迁移
- ✅ API 文档（Swagger UI）
- ✅ 自动化部署（GitHub Actions）
- ✅ 数据库保护（部署时备份和恢复）
- ✅ 回滚脚本（轻松回滚到之前版本）

### 待开发 📋

- WebSocket 实时状态推送
- 邮件通知系统
- 多节点支持

## 文档

- [部署指南](./docs/deployment.md) - 生产环境部署指南
- [API 文档](./docs/api/README.md) - API 文档
- [集成测试报告](./backend/tests/test_integration.md) - 集成测试报告

## 部署

查看 [部署指南](./docs/deployment.md) 了解生产环境部署说明。

### 快速部署

项目包含通过 GitHub Actions 的自动部署。只需推送到 main 分支：

```bash
git push origin main
```

### 回滚

如果需要回滚到之前的版本：

```bash
ssh root@your-server
cd /opt/frps-panel
./scripts/rollback.sh
```

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 致谢

基于 [frps-panel](https://github.com/yhl452493373/frps-panel) by yhl452493373
