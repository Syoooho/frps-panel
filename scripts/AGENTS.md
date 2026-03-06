<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-06 -->

# scripts

## 用途

系统级工具脚本目录，包含部署、TLS/SSL 配置、服务器设置等脚本。

注意：数据库相关脚本已移至 `backend/scripts/`。

## 核心文件

### 部署脚本

| 文件 | 描述 |
|------|------|
| `deploy-security.sh` | 安全部署脚本，配置 HTTPS、防火墙等 |
| `local-deploy-test.sh` | 本地部署测试脚本 |
| `server-setup.sh` | 服务器初始化设置脚本 |
| `rollback.sh` | 部署回滚脚本 |

### TLS/SSL 配置

| 文件 | 描述 |
|------|------|
| `setup-frp-tls.sh` | FRP TLS 配置脚本 |
| `generate-ssl-cert.sh` | SSL 证书生成脚本 |

### Nginx 配置

| 文件 | 描述 |
|------|------|
| `nginx-security.conf` | Nginx 安全配置模板 |

### 其他工具

| 文件 | 描述 |
|------|------|
| `cleanup-repo.sh` | 仓库清理脚本 |

## 子目录

当前无子目录。

## AI Agent 工作指南

### 在此目录工作时

- 部署脚本应该在服务器环境运行
- 使用 bash 编写 shell 脚本
- 脚本应该有清晰的错误处理和日志输出
- 涉及系统配置的操作需要 root 权限

### 脚本分类

- **部署脚本**：用于生产环境部署和配置
- **TLS/SSL 脚本**：用于证书生成和 TLS 配置
- **Nginx 配置**：Web 服务器安全配置模板
- **工具脚本**：仓库维护和清理工具

### 数据库脚本位置

数据库相关的 Python 脚本已移至 `backend/scripts/`：
- `backend/scripts/init_db.py` - 数据库初始化
- `backend/scripts/create_admin.py` - 创建管理员账号
- `backend/scripts/update_db_for_encryption.py` - 数据库加密更新
- `backend/scripts/update_existing_tunnels.py` - 更新现有隧道
- `backend/scripts/check_tunnel_fields.py` - 检查隧道字段

### 测试要求

- 部署脚本应该在测试环境验证
- 使用 `set -e` 确保错误时停止执行
- 提供 dry-run 模式（如适用）
- 记录详细的操作日志

### 常见模式

- 检查依赖和权限
- 备份配置文件
- 使用环境变量配置
- 提供回滚机制

## 依赖关系

### 内部依赖

- 依赖 `backend/` 和 `frontend/` 的构建产物
- 依赖 `frp-plugin/` 的编译产物
- 使用 `.env` 文件配置

### 外部依赖

- Bash 4.0+
- Nginx（用于反向代理）
- OpenSSL（用于证书生成）
- systemd（用于服务管理）
- UFW 或 iptables（用于防火墙配置）

## 使用说明

### 服务器初始化

```bash
# 首次部署时运行
sudo bash scripts/server-setup.sh
```

### 安全部署

```bash
# 配置 HTTPS 和安全设置
sudo bash scripts/deploy-security.sh
```

### TLS 配置

```bash
# 为 FRP 配置 TLS
sudo bash scripts/setup-frp-tls.sh

# 生成自签名证书（测试用）
sudo bash scripts/generate-ssl-cert.sh
```

### 回滚部署

```bash
# 回滚到上一个版本
sudo bash scripts/rollback.sh
```

### 本地测试

```bash
# 在本地测试部署流程
bash scripts/local-deploy-test.sh
```

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
