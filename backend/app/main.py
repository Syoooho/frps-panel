from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.middleware.logging import LoggingMiddleware
from app.api.v1 import auth, activation, subscription, tunnels, admin, frp, monitor, dashboard, system

# 初始化日志
setup_logging(settings.LOG_LEVEL)

app = FastAPI(
    title="FRP SaaS Platform API",
    version="2.0.0",
    description="FRP内网穿透SaaS平台后端API"
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 日志中间件
app.add_middleware(LoggingMiddleware)

# 注册路由
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(subscription.router, prefix="/api/v1/subscriptions", tags=["订阅"])
app.include_router(activation.router, prefix="/api/v1/activation", tags=["兑换码"])
app.include_router(tunnels.router, prefix="/api/v1/tunnels", tags=["隧道"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["管理员"])
app.include_router(frp.router, prefix="/api/v1/frp", tags=["FRP插件"])
app.include_router(monitor.router, prefix="/api/v1/monitor", tags=["系统监控"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["仪表板"])
app.include_router(system.router, prefix="/api/v1/system", tags=["系统配置"])

@app.get("/")
async def root():
    return {"message": "FRP SaaS Platform API", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}
