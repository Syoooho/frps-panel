# 自动化部署文档

## 概述

本项目使用 GitHub Actions 实现自动化部署，当代码推送到 `main` 或 `master` 分支时，会自动构建并部署到服务器。

## 部署架构

```
GitHub Actions
    ↓
构建前端 (React + Vite)
    ↓
构建插件 (Go)
    ↓
上传到服务器
    ↓
执行部署脚本
    ↓
启动服务
```

## 服务器要求

- 操作系统: Ubuntu 20.04+ / Debian 11+
- 内存: 至少 2GB
- 磁盘: 至少 10GB
- 开放端口: 80, 443, 7000, 7200

## 首次部署步骤

### 1. 服务器初始化

在服务器上执行初始化脚本：

```bash
# 下载初始化脚本
wget https://raw.githubusercontent.com/your-repo/frps-panel/main/scripts/server-setup.sh

# 赋予执行权限
chmod +x server-setup.sh

# 执行初始化
sudo ./server-setup.sh
```

### 2. 配置环境变量

编辑服务器上的环境配置文件：

```bash
sudo nano /opt/frps-panel/.env
```

修改以下配置：

```env
# JWT 密钥（必须修改）
SECRET_KEY=your-random-secret-key-here

# FRP 服务器地址（修改为你的服务器 IP）
FRP_SERVER_ADDR=your-server-ip
FRP_SERVER_PORT=7000
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 Secrets：

| Name | Value | 说明 |
|------|-------|------|
| `SERVER_IP` | 服务器 IP 地址 | 例如: 123.45.67.89 |
| `SSH_KEY` | SSH 私钥 | 完整的私钥内容 |

**获取 SSH 私钥**：

```bash
# 在本地生成 SSH 密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "deploy@frps-panel"

# 将公钥添加到服务器
ssh-copy-id root@your-server-ip

# 查看私钥内容（复制到 GitHub Secrets）
cat ~/.ssh/id_rsa
```

### 4. 触发部署

推送代码到 main/master 分支：

```bash
git add .
git commit -m "配置自动化部署"
git push origin main
```

或者手动触发部署：

1. 进入 GitHub 仓库
2. 点击 Actions 标签
3. 选择 "Deploy to Server" workflow
4. 点击 "Run workflow"

## 部署流程说明

### 构建阶段

1. **前端构建**
   - 安装 Node.js 18
   - 安装依赖 (`npm ci`)
   - 构建生产版本 (`npm run build`)
   - 输出到 `frontend/dist`

2. **插件构建**
   - 安装 Go 1.21
   - 交叉编译 Linux 版本
   - 输出 `frps-panel-linux-amd64`

3. **后端准备**
   - 复制源代码
   - 复制依赖文件

### 部署阶段

1. **上传文件**
   - 通过 SCP 上传到 `/tmp/frps-panel-deploy`

2. **执行部署脚本**
   - 备份现有部署
   - 停止现有服务
   - 部署新版本
   - 安装后端依赖
   - 配置 Nginx
   - 配置 systemd 服务
   - 启动服务

3. **服务管理**
   - `frps-panel-backend.service` - 后端 API 服务
   - `frps-panel-plugin.service` - FRP 插件服务
   - `nginx` - Web 服务器

## 服务管理命令

### 查看服务状态

```bash
# 查看后端服务
sudo systemctl status frps-panel-backend

# 查看插件服务
sudo systemctl status frps-panel-plugin

# 查看 Nginx
sudo systemctl status nginx
```

### 重启服务

```bash
# 重启后端
sudo systemctl restart frps-panel-backend

# 重启插件
sudo systemctl restart frps-panel-plugin

# 重启 Nginx
sudo systemctl restart nginx
```

### 查看日志

```bash
# 后端日志
sudo journalctl -u frps-panel-backend -f

# 插件日志
sudo journalctl -u frps-panel-plugin -f

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 应用日志
sudo tail -f /opt/frps-panel/backend/logs/app.log
```

## 目录结构

```
/opt/frps-panel/
├── frontend/              # 前端静态文件
│   ├── index.html
│   └── assets/
├── backend/               # 后端应用
│   ├── app/
│   ├── .venv/            # Python 虚拟环境
│   ├── requirements.txt
│   ├── frps_panel.db     # SQLite 数据库
│   └── logs/             # 日志文件
├── frps-panel            # FRP 插件可执行文件
├── frps-panel.toml       # 插件配置
├── frps.toml             # FRP 服务器配置
└── .env                  # 环境变量
```

## Nginx 配置

配置文件位置: `/etc/nginx/sites-available/frps-panel`

```nginx
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root /opt/frps-panel/frontend;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API 文档
    location /docs {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

## 回滚部署

如果部署出现问题，可以回滚到之前的版本：

```bash
# 查看备份
ls -la /opt/frps-panel-backup-*

# 停止服务
sudo systemctl stop frps-panel-backend
sudo systemctl stop frps-panel-plugin

# 恢复备份（替换为实际的备份目录）
sudo rm -rf /opt/frps-panel
sudo cp -r /opt/frps-panel-backup-20260303-120000 /opt/frps-panel

# 重启服务
sudo systemctl start frps-panel-backend
sudo systemctl start frps-panel-plugin
```

## 故障排查

### 部署失败

1. 检查 GitHub Actions 日志
2. 检查服务器磁盘空间: `df -h`
3. 检查服务器内存: `free -h`
4. 检查 SSH 连接: `ssh root@your-server-ip`

### 服务无法启动

```bash
# 检查服务状态
sudo systemctl status frps-panel-backend
sudo systemctl status frps-panel-plugin

# 查看详细日志
sudo journalctl -u frps-panel-backend -n 100
sudo journalctl -u frps-panel-plugin -n 100

# 检查端口占用
sudo netstat -tlnp | grep 8000
sudo netstat -tlnp | grep 7200
```

### 前端无法访问

```bash
# 检查 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 检查文件权限
ls -la /opt/frps-panel/frontend/
```

## 安全建议

1. **修改默认密码**
   - 登录后立即修改管理员密码

2. **配置 HTTPS**
   - 使用 Let's Encrypt 免费证书
   - 安装 certbot: `sudo apt install certbot python3-certbot-nginx`
   - 获取证书: `sudo certbot --nginx -d your-domain.com`

3. **配置防火墙**
   ```bash
   sudo ufw enable
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 7000/tcp
   ```

4. **定期备份数据库**
   ```bash
   # 创建备份脚本
   sudo crontab -e
   
   # 添加每日备份任务
   0 2 * * * cp /opt/frps-panel/backend/frps_panel.db /opt/backups/frps_panel-$(date +\%Y\%m\%d).db
   ```

## 监控和维护

### 设置监控

```bash
# 安装监控工具
sudo apt install htop iotop

# 查看系统资源
htop

# 查看磁盘 I/O
sudo iotop
```

### 日志轮转

日志文件会自动轮转（10MB/文件，保留5-10个备份），配置在 `backend/app/core/logging.py`

### 数据库维护

```bash
# 进入数据库
sqlite3 /opt/frps-panel/backend/frps_panel.db

# 查看表
.tables

# 优化数据库
VACUUM;

# 退出
.quit
```

## 更新部署

只需推送代码到 main/master 分支，GitHub Actions 会自动完成部署：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

## 联系支持

如有问题，请在 GitHub Issues 中提出。
