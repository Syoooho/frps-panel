# 安全增强部署指南

## 概述

本文档介绍如何部署 FRP SaaS Platform 的安全增强功能,包括 HTTPS 配置、请求限流、登录保护等。

## 部署步骤

### 1. 初始化安全数据表

在服务器上执行:

```bash
cd /opt/frps-panel/backend
uv run python scripts/init_security_tables.py
```

### 2. 生成 SSL 证书

```bash
cd /opt/frps-panel
sudo bash scripts/generate-ssl-cert.sh
```

按提示输入服务器 IP 地址。

### 3. 部署安全配置

```bash
cd /opt/frps-panel
sudo bash scripts/deploy-security.sh
```

脚本会自动:
- 部署 Nginx 安全配置
- 修改后端监听地址为 127.0.0.1
- 重启相关服务

### 4. 验证部署

访问 `https://YOUR_SERVER_IP:8443` 检查是否正常。

首次访问会显示证书警告,点击"高级" -> "继续访问"即可。

## 安全功能说明

### 1. HTTPS 加密

- 使用 TLS 1.2/1.3 协议
- 强加密套件
- 自签名证书(10年有效期)

### 2. 请求限流

| 接口类型 | 限流规则 |
|---------|---------|
| 登录接口 | 每分钟最多 5 次 |
| API 接口 | 每秒最多 10 个请求 |
| 静态资源 | 每秒最多 50 个请求 |

### 3. 登录保护

- 5 次登录失败后锁定账号 15 分钟
- 记录所有登录尝试(成功/失败)
- 记录 IP 地址和 User-Agent

### 4. 安全响应头

- `X-Frame-Options: DENY` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止 MIME 嗅探
- `X-XSS-Protection: 1; mode=block` - XSS 防护
- `Content-Security-Policy` - 内容安全策略
- `Strict-Transport-Security` - 强制 HTTPS

### 5. 后端隐藏

后端只监听 127.0.0.1:8000,外部无法直接访问。

## 端口说明

| 端口 | 用途 |
|-----|------|
| 8443 | HTTPS 访问入口 |
| 8080 | HTTP 重定向到 HTTPS |
| 8000 | 后端 API(仅本地) |
| 7000 | FRP 服务器 |
| 7200 | FRP 插件 |

## 查看日志

### Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/frps-panel-access.log

# 错误日志
sudo tail -f /var/log/nginx/frps-panel-error.log
```

### 应用日志

```bash
# 应用日志
sudo tail -f /opt/frps-panel/backend/logs/app.log

# 安全日志(登录尝试等)
sudo tail -f /opt/frps-panel/backend/logs/security.log
```

## 测试安全功能

在本地测试:

```bash
cd backend
uv run python tests/test_security.py
```

## 故障排查

### 无法访问 HTTPS

1. 检查防火墙是否开放 8443 端口:
```bash
sudo ufw allow 8443/tcp
```

2. 检查 Nginx 状态:
```bash
sudo systemctl status nginx
```

3. 检查 SSL 证书:
```bash
ls -la /opt/frps-panel/ssl/
```

### 登录被锁定

查看数据库中的锁定记录:

```bash
sqlite3 /opt/frps-panel/backend/frps_panel.db
SELECT * FROM login_attempts WHERE locked_until > datetime('now');
```

手动解锁账号:

```bash
sqlite3 /opt/frps-panel/backend/frps_panel.db
UPDATE login_attempts SET failed_count=0, locked_until=NULL WHERE email='user@example.com';
```

### 限流过于严格

修改 Nginx 配置:

```bash
sudo nano /etc/nginx/sites-available/frps-panel-security
```

调整 `limit_req_zone` 的 `rate` 参数,然后重启:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 安全建议

1. **定期更新证书**: 自签名证书 10 年后需要重新生成

2. **监控登录日志**: 定期检查异常登录尝试

3. **备份数据库**: 包含安全日志的数据库应定期备份

4. **配置防火墙**: 只开放必要的端口

5. **使用强密码**: 管理员账号使用复杂密码

## 回滚

如果需要回滚到旧配置:

```bash
# 查看备份
ls -la /opt/frps-panel/backup-*

# 恢复 Nginx 配置
sudo cp /opt/frps-panel/backup-YYYYMMDD-HHMMSS/nginx.conf.bak /etc/nginx/sites-available/frps-panel
sudo systemctl restart nginx

# 恢复环境配置
sudo cp /opt/frps-panel/backup-YYYYMMDD-HHMMSS/.env.bak /opt/frps-panel/backend/.env
sudo systemctl restart frps-panel-backend
```

## 联系支持

如有问题,请在 GitHub Issues 中提出。
