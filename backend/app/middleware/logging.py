"""日志中间件"""
import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("access")


class LoggingMiddleware(BaseHTTPMiddleware):
    """请求日志中间件"""
    
    async def dispatch(self, request: Request, call_next):
        """处理请求并记录日志"""
        start_time = time.time()
        
        # 记录请求信息
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"Client: {request.client.host if request.client else 'unknown'}"
        )
        
        # 处理请求
        response: Response = await call_next(request)
        
        # 计算处理时间
        process_time = time.time() - start_time
        
        # 记录响应信息
        logger.info(
            f"Response: {request.method} {request.url.path} "
            f"Status: {response.status_code} "
            f"Time: {process_time:.3f}s"
        )
        
        # 添加处理时间到响应头
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
