# 🚀 快速部署指南

## 前置条件

- ✅ 一台 Linux 服务器（Ubuntu 20.04+ / Debian 11+）
- ✅ 服务器 root 访问权限
- ✅ GitHub 仓库已配置以下 Secrets：
  - `SERVER_IP`: 服务器 IP 地址
  - `SSH_KEY`: SSH 私钥
  - `SECRET_KEY`: JWT 密钥（随机字符串，至少 32 位）
  - `FRP_SERVER_ADDR`: FRP 服务器地址（通常是服务器 IP）

## 三步完成部署

### 步骤 1: 初始化服务器

在服务器上执行：

```bash
curl -fsSL https://raw.githubusercontent.com/your-username/frps-panel/main/scripts/server-setup.sh | sudo bash
```

或手动执行：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装依赖
sudo apt install -y curl wget git nginx python3 python3-pip sqlite3

# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建目录
sudo mkdir -p /opt/frps-panel
```

### 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret" 添加：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_IP` | 服务器 IP 地址 | `123.45.67.89` |
| `SSH_KEY` | SSH 私钥内容 | 完整的私钥文件内容 |
| `SECRET_KEY` | JWT 密钥 | 随机字符串，至少 32 位 |
| `FRP_SERVER_ADDR` | FRP 服务器地址 | 通常与 `SERVER_IP` 相同 |

生成 SECRET_KEY 的方法：
```bash
# Linux/Mac
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 步骤 3: 触发部署

推送代码到 GitHub：

```bash
git push origin main
```

或在 GitHub Actions 页面手动触发部署。

---

## 部署完成后

### 访问应用

- 🌐 前端: `http://你的服务器IP`
- 📚 API 文档: `http://你的服务器IP/docs`
- 🔧 后端 API: `http://你的服务器IP/api`

### 默认账号

- 管理员: `admin@example.com` / `admin123`
- 测试用户: `test@example.com` / `test1234`

### 管理服务

```bash
# 查看状态
sudo systemctl status frps-panel-backend
sudo systemctl status frps-panel-plugin

# 重启服务
sudo systemctl restart frps-panel-backend
sudo systemctl restart frps-panel-plugin

# 查看日志
sudo journalctl -u frps-panel-backend -f
```

---

## 常见问题

### Q: 部署失败怎么办？

A: 检查 GitHub Actions 日志，查看具体错误信息。

### Q: 遇到 "uv: command not found" 错误？

A: 这是因为 `uv` 未正确安装或不在 PATH 中。解决方法：
```bash
# 重新运行服务器初始化脚本
curl -fsSL https://raw.githubusercontent.com/your-username/frps-panel/main/scripts/server-setup.sh | sudo bash

# 或手动安装 uv 并创建软链接
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
sudo ln -sf $HOME/.local/bin/uv /usr/local/bin/uv

# 验证安装
uv --version
sudo uv --version
```

### Q: 服务无法启动？

A: 检查服务日志：
```bash
sudo journalctl -u frps-panel-backend -n 50
```

### Q: 如何配置 HTTPS？

A: 使用 Let's Encrypt：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Q: 如何备份数据？

A: 备份数据库文件：
```bash
sudo cp /opt/frps-panel/backend/frps_panel.db ~/backup/
```

---

## 详细文档

完整部署文档请查看: [docs/deployment.md](docs/deployment.md)

## 技术支持

遇到问题？请在 [GitHub Issues](https://github.com/your-username/frps-panel/issues) 提出。
