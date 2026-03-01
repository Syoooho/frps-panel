"""FRP 插件 API"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.frp_service import FRPService
from app.schemas.frp import (
    FRPLoginRequest, FRPLoginResponse,
    FRPNewProxyRequest, FRPNewProxyResponse,
    FRPCloseProxyRequest, FRPCloseProxyResponse,
    FRPPingRequest, FRPPingResponse
)
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/handler")
async def frp_handler(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    FRP 插件统一处理入口
    
    frps 会发送不同的操作类型:
    - Login: 用户登录验证
    - NewProxy: 新建代理
    - CloseProxy: 关闭代理
    - Ping: 心跳检测
    """
    try:
        body = await request.json()
        op = body.get("op", "")
        
        logger.info(f"FRP 请求: op={op}, body={body}")
        
        if op == "Login":
            return await handle_login(body, db)
        elif op == "NewProxy":
            return await handle_new_proxy(body, db)
        elif op == "CloseProxy":
            return await handle_close_proxy(body, db)
        elif op == "Ping":
            return await handle_ping(body, db)
        else:
            logger.warning(f"未知的操作类型: {op}")
            return {"reject": False, "unchange": True}
            
    except Exception as e:
        logger.error(f"FRP 处理异常: {e}")
        return {"reject": True, "reject_reason": str(e), "unchange": True}


async def handle_login(body: dict, db: Session) -> dict:
    """处理登录请求"""
    req = FRPLoginRequest(content=body.get("content", {}))
    
    # 验证用户
    valid, reason, user = FRPService.validate_user(
        db, req.user, req.token
    )
    
    if not valid:
        logger.warning(f"用户验证失败: user={req.user}, reason={reason}")
        return FRPLoginResponse(
            reject=True,
            reject_reason=reason
        ).model_dump()
    
    logger.info(f"用户验证成功: user={req.user}")
    return FRPLoginResponse().model_dump()


async def handle_new_proxy(body: dict, db: Session) -> dict:
    """处理新建代理请求"""
    req = FRPNewProxyRequest(content=body.get("content", {}))
    
    # 获取用户
    user = FRPService.get_user_by_email(db, req.user)
    if not user:
        logger.warning(f"用户不存在: user={req.user}")
        return FRPNewProxyResponse(
            reject=True,
            reject_reason="用户不存在"
        ).model_dump()
    
    if not user.is_active:
        logger.warning(f"用户已被禁用: user={req.user}")
        return FRPNewProxyResponse(
            reject=True,
            reject_reason="用户已被禁用"
        ).model_dump()
    
    # 验证代理配置
    valid, reason = FRPService.validate_proxy(
        db, user, req.proxy_type,
        req.remote_port, req.custom_domains, req.subdomain
    )
    
    if not valid:
        logger.warning(f"代理配置验证失败: user={req.user}, reason={reason}")
        return FRPNewProxyResponse(
            reject=True,
            reject_reason=reason
        ).model_dump()
    
    # 注册隧道
    tunnel = FRPService.register_tunnel(
        db, user.id, req.proxy_name, req.proxy_type,
        req.remote_port, req.custom_domains, req.subdomain
    )
    
    if tunnel:
        logger.info(f"隧道注册成功: user={req.user}, proxy={req.proxy_name}")
    
    return FRPNewProxyResponse().model_dump()


async def handle_close_proxy(body: dict, db: Session) -> dict:
    """处理关闭代理请求"""
    req = FRPCloseProxyRequest(content=body.get("content", {}))
    
    # 获取用户
    user = FRPService.get_user_by_email(db, req.user)
    if not user:
        logger.warning(f"用户不存在: user={req.user}")
        return FRPCloseProxyResponse(
            reject=True,
            reject_reason="用户不存在"
        ).model_dump()
    
    # 注销隧道
    success = FRPService.unregister_tunnel(
        db, user.id, req.proxy_name
    )
    
    if success:
        logger.info(f"隧道注销成功: user={req.user}, proxy={req.proxy_name}")
    
    return FRPCloseProxyResponse().model_dump()


async def handle_ping(body: dict, db: Session) -> dict:
    """处理心跳请求"""
    return FRPPingResponse().model_dump()
