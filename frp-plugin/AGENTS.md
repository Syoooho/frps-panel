<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# frp-plugin

## 用途

Go 语言编写的 FRP 服务端插件（frps-panel），用于接收 frps 发送的 HTTP 请求，实现多用户鉴权、端口限制、域名限制等功能。

## 核心文件

| 文件 | 描述 |
|------|------|
| `go.mod` | Go modules 依赖管理 |
| `go.sum` | Go modules 依赖校验 |
| `Makefile` | 构建脚本 |
| `Makefile.cross-compiles` | 跨平台编译脚本 |
| `package.sh` | 打包脚本 |

## 子目录

| 目录 | 用途 |
|------|------|
| `cmd/` | 命令行入口 (详见 `cmd/AGENTS.md`) |
| `pkg/` | 核心包代码 (详见 `pkg/AGENTS.md`) |
| `config/` | 配置文件示例 (详见 `config/AGENTS.md`) |

## AI Agent 工作指南

### 在此目录工作时

- 使用 Go 1.21+ 版本
- 构建：`make` 或 `go build -o frps-panel ./cmd/frps-panel`
- 跨平台编译：`make -f Makefile.cross-compiles`
- 运行：`./frps-panel -c ./config/frps-panel.toml`
- 打包：`./package.sh`
- 该插件需要配合 frp >= 0.52.0 版本使用

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

- 多用户鉴权（基于 token）
- 用户管理（添加、删除、禁用、启用）
- 端口限制（指定用户可用端口范围）
- 域名限制（指定用户可用域名列表）
- 二级域名限制（指定用户可用二级域名列表）
- 服务器信息展示
- 代理列表和流量统计

## 配置说明

- `frps-panel.toml` - 插件主配置（监听地址、端口、管理员账号等）
- `frps-tokens.toml` - 用户 token 配置（用户名、token、限制规则等）

## 注意事项

- 用户被删除或禁用后不会立即生效，需要等待一段时间
- 端口、域名、二级域名限制仅在建立新连接（NewProxy）时生效
- 该插件是原 frps-panel 项目的一部分，未来需要改造以适配新的 SaaS 架构

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
