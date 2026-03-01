#!/bin/bash

echo "启动 FRP SaaS Platform 后端服务..."
cd "$(dirname "$0")/.."
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
