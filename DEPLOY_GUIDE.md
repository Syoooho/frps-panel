# 部署指南

## 重要提示

由于服务器已重置，需要重新配置 GitHub Secrets 和执行首次部署。

## 步骤 1: 配置 GitHub Secrets

在 GitHub 仓库设置中配置以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加或更新以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_IP` | 服务器 IP 地址 | `123.45.67.89` |
| `SSH_KEY` | SSH 私钥（完整内容） | 从 `~/.ssh/id_rsa` 复制 |
| `SECRET_KEY` | JWT 密钥（随机字符串） | 使用 `openssl rand -hex 32` 生成 |
| `FRP_SERVER_ADDR` | FRP 服务器地址 | 通常与 `SERVER_IP` 相同 |

### 生成 SECRET_KEY

```bash
# 方法 1: 使用 openssl
openssl rand -hex 32

# 方法 2: 使用 Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 配置 SSH 密钥

```bash
# 1. 在本地生成 SSH 密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "deploy@frps-panel"

# 2. 将公钥添加到服务器
ssh-copy-id root@your-server-ip

# 3. 查看私钥内容（复制到 GitHub Secrets）
cat ~/.ssh/id_rsa
```

## 步骤 2: 服务器初始化

在服务器上执行初始化脚本：

```bash
# 下载并执行初始化脚本
curl -fsSL https://raw.githubusercontent.com/your-username/frps-panel/main/scripts/server-setup.sh | sudo bash

# 或者手动执行
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx python3 python3-pip sqlite3
curl -LsSf https://astral.sh/uv/install.sh | sh
sudo mkdir -p /opt/frps-panel
```

## 步骤 3: 触发部署

### 方法 1: 推送代码触发

```bash
git push origin main
```

### 方法 2: 手动触发

1. 进入 GitHub 仓库
2. 点击 Actions 标签
3. 选择 "Deploy to Server" workflow
4. 点击 "Run workflow"

## 步骤 4: 验证部署

部署完成后，检查服务状态：

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 检查服务状态
sudo systemctl status frps
sudo systemctl status frps-panel-backend
sudo systemctl status frps-panel-plugin

# 查看日志
sudo journalctl -u frps -n 50
sudo journalctl -u frps-panel-backend -n 50
sudo journalctl -u frps-panel-plugin -n 50
```

## 访问应用

- 前端: `http://your-server-ip`
- API 文档: `http://your-server-ip/docs`
- 后端 API: `http://your-server-ip/api`

## 默认账号

- 管理员: `admin@example.com` / `admin123`
- 测试用户: `test@example.com` / `test1234`

## 常见问题

### Q: 部署失败怎么办？

A: 检查 GitHub Actions 日志，查看具体错误信息。常见问题：
- SSH 连接失败：检查 `SERVER_IP` 和 `SSH_KEY` 配置
- 服务启动失败：检查服务器日志 `journalctl -u <service-name>`
- 端口被占用：检查端口占用情况 `netstat -tlnp`

### Q: 如何配置 HTTPS？

A: 使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Q: 如何备份数据？

A: 备份数据库文件：

```bash
sudo cp /opt/frps-panel/backend/frps_panel.db ~/backup/frps_panel-$(date +%Y%m%d).db
```

## 更新说明

本次更新内容：

1. ✅ 从 git 历史中删除了 .kiro 目录（减小仓库体积）
2. ✅ 添加了 frp_0.67.0_linux_amd64 二进制文件到仓库
3. ✅ 更新了 GitHub Actions 部署流程，包含 FRP 服务器自动部署
4. ✅ 添加了 frps systemd 服务配置
5. ✅ 优化了服务启动顺序和依赖关系

## 详细文档

- 完整部署文档: [docs/deployment.md](docs/deployment.md)
- 快速部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)

## 技术支持

遇到问题？请在 [GitHub Issues](https://github.com/your-username/frps-panel/issues) 提出。
