# 🚀 快速部署指南

## 前置条件

- ✅ 一台 Linux 服务器（Ubuntu 20.04+ / Debian 11+）
- ✅ 服务器 root 访问权限
- ✅ GitHub 仓库已配置 `SERVER_IP` 和 `SSH_KEY` Secrets

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

### 步骤 2: 配置环境

编辑服务器配置：

```bash
sudo nano /opt/frps-panel/.env
```

修改以下内容：

```env
SECRET_KEY=请修改为随机字符串
FRP_SERVER_ADDR=你的服务器IP
FRP_SERVER_PORT=7000
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
