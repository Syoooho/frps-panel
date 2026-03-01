from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, activation, subscription, tunnels, admin, frp

app = FastAPI(
    title="FRP SaaS Platform API",
    version="2.0.0",
    description="FRP内网穿透SaaS平台后端API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(activation.router, prefix="/api/v1/activation", tags=["兑换码"])
app.include_router(subscription.router, prefix="/api/v1/subscription", tags=["订阅"])
app.include_router(tunnels.router, prefix="/api/v1/tunnels", tags=["隧道"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["管理员"])
app.include_router(frp.router, prefix="/api/v1/frp", tags=["FRP插件"])

@app.get("/")
async def root():
    return {"message": "FRP SaaS Platform API", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}
