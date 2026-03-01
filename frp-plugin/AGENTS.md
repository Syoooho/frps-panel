<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# frp-plugin

## 用途

Go 语言编写的 FRP 服务端插件（frps-panel v2.0），用于接收 frps 发送的 HTTP 请求，转发到后端 FastAPI 进行用户验证和隧道管理。

## 核心文件

| 文件 | 描述 |
|------|------|
| `go.mod` | Go modules 依赖管理 |
| `go.sum` | Go modules 依赖校验 |
| `Makefile` | 构建脚本 |

## 子目录

| 目录 | 用途 |
|------|------|
| `cmd/frps-panel/` | 命令行入口（main.go） |
| `pkg/config/` | 配置管理 |
| `pkg/server/` | HTTP 服务器实现 |
| `config/` | 配置文件示例 |

## AI Agent 工作指南

### 在此目录工作时

- 使用 Go 1.21+ 版本
- 安装依赖：`go mod tidy`
- 构建：`make build` 或 `go build -o frps-panel ./cmd/frps-panel`
- 跨平台编译：`make build-all`
- 运行：`./frps-panel -c ./config/frps-panel.toml`
- 查看版本：`./frps-panel -v`
- 该插件需要配合 frp >= 0.52.0 版本使用
- 需要后端 API 服务运行在 http://127.0.0.1:8000

### 测试要求

- 运行测试：`make test` 或 `go test ./...`
- 测试覆盖率：`go test -cover ./...`
- 需要测试与 frps 的集成

### 常见模式

- 使用标准库 `net/http` 处理 HTTP 请求
- 配置文件使用 TOML 格式
- 插件接收 frps 的操作事件：Login, NewWorkConn, NewUserConn, NewProxy, Ping
- 用户信息存储在 `frps-tokens.toml` 文件中
- 支持端口、域名、二级域名的限制规则

## 依赖关系

### 内部依赖

- `cmd/frps-panel/` → `pkg/server/` (使用服务器核心逻辑)
- `pkg/server/` → `config/` (读取配置文件)

### 外部依赖

- Go 标准库
- frp >= 0.52.0 (运行时依赖)
- TOML 解析库

## 插件功能

- 接收 frps 的 HTTP 请求（Login、NewProxy、CloseProxy、Ping）
- 转发请求到后端 FastAPI 进行处理
- 支持 TLS 加密通信
- 配置文件热加载（重启生效）
- 轻量级代理设计，无状态服务

## 配置说明

- `frps-panel.toml` - 插件配置（监听地址、端口、后端 API 地址、TLS 配置）
- `frps.toml` - frps 服务端配置示例（注册插件）
- `frpc.toml` - frpc 客户端配置示例（使用邮箱和 FRP Token）

## 注意事项

- 插件作为无状态代理，所有业务逻辑由后端 API 处理
- 用户验证使用邮箱 + FRP Token 方式
- 隧道状态由后端数据库管理
- 插件需要能够访问后端 API（默认 http://127.0.0.1:8000）
- 支持 TLS 加密，生产环境建议启用

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
