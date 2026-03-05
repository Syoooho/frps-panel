#!/bin/bash
# FRP SaaS Platform 回滚脚本

set -e

APP_DIR="/opt/frps-panel"

echo "🔄 FRP SaaS Platform 回滚工具"
echo ""

# 列出可用的备份
echo "📦 可用的备份："
ls -lt /opt/ | grep frps-panel-backup | head -10

echo ""
echo "请输入要回滚到的备份目录名（例如：frps-panel-backup-20260305-194500）"
read -p "备份目录名: " BACKUP_NAME

BACKUP_DIR="/opt/$BACKUP_NAME"

# 检查备份是否存在
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ 错误：备份目录不存在: $BACKUP_DIR"
    exit 1
fi

echo ""
echo "⚠️  警告：即将回滚到 $BACKUP_NAME"
echo "当前部署将被替换，但数据库会保留"
read -p "确认继续？(yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ 已取消回滚"
    exit 0
fi

echo ""
echo "🛑 停止服务..."
systemctl stop frps || true
systemctl stop frps-panel-backend || true
systemctl stop frps-panel-plugin || true
systemctl stop nginx || true

echo "💾 备份当前数据库..."
if [ -f "$APP_DIR/backend/frps_panel.db" ]; then
    cp $APP_DIR/backend/frps_panel.db /tmp/frps_panel.db.rollback
    echo "✅ 数据库已备份到 /tmp/frps_panel.db.rollback"
fi

echo "🔄 回滚应用..."
rm -rf $APP_DIR
cp -r $BACKUP_DIR $APP_DIR

echo "♻️  恢复数据库..."
if [ -f "/tmp/frps_panel.db.rollback" ]; then
    cp /tmp/frps_panel.db.rollback $APP_DIR/backend/frps_panel.db
    rm /tmp/frps_panel.db.rollback
    echo "✅ 数据库已恢复"
fi

echo "🚀 启动服务..."
systemctl start frps
sleep 2
systemctl start frps-panel-backend
sleep 2
systemctl start frps-panel-plugin
systemctl start nginx

echo ""
echo "✅ 检查服务状态..."
systemctl status frps --no-pager || true
echo ""
systemctl status frps-panel-backend --no-pager || true
echo ""
systemctl status frps-panel-plugin --no-pager || true
echo ""
systemctl status nginx --no-pager || true

echo ""
echo "🎉 回滚完成！"
echo "应用已回滚到: $BACKUP_NAME"
echo "数据库已保留"
