# FRP SaaS Platform - Backend

FastAPI后端服务

## 安装依赖

使用uv管理环境：

```bash
cd backend
uv venv
uv pip install -e .
```

## 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

## 运行服务

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API文档

启动后访问：http://localhost:8000/docs
