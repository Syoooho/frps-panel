#!/bin/bash

echo "初始化数据库..."
cd "$(dirname "$0")/.."
uv run python -m app.init_db
echo "完成！"
