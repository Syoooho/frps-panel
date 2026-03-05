"""FRP 插件相关的 Schema"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class FRPLoginRequest(BaseModel):
    """FRP 登录请求"""
    content: Dict[str, Any] = Field(..., description="frps 发送的原始内容")
    
    @property
    def user(self) -> str:
        """获取用户名"""
        return str(self.content.get("user", ""))
    
    @property
    def token(self) -> str:
        """获取 token"""
        metas = self.content.get("metas", {})
        if isinstance(metas, dict):
            return str(metas.get("token", ""))
        return ""


class FRPLoginResponse(BaseModel):
    """FRP 登录响应"""
    reject: bool = Field(False, description="是否拒绝")
    reject_reason: str = Field("", description="拒绝原因")
    unchange: bool = Field(True, description="是否不修改")


class FRPNewProxyRequest(BaseModel):
    """FRP 新建代理请求"""
    content: Dict[str, Any] = Field(..., description="frps 发送的原始内容")
    
    @property
    def user(self) -> str:
        """获取用户名"""
        return str(self.content.get("user", ""))
    
    @property
    def proxy_name(self) -> str:
        """获取代理名称"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            return str(proxy_info.get("proxy_name", ""))
        return ""
    
    @property
    def proxy_type(self) -> str:
        """获取代理类型"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            return str(proxy_info.get("proxy_type", ""))
        return ""
    
    @property
    def remote_port(self) -> Optional[int]:
        """获取远程端口"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            port = proxy_info.get("remote_port")
            return int(port) if port else None
        return None
    
    @property
    def custom_domains(self) -> list:
        """获取自定义域名"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            domains = proxy_info.get("custom_domains", [])
            return domains if isinstance(domains, list) else []
        return []
    
    @property
    def subdomain(self) -> str:
        """获取子域名"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            return str(proxy_info.get("subdomain", ""))
        return ""


class FRPNewProxyResponse(BaseModel):
    """FRP 新建代理响应"""
    reject: bool = Field(False, description="是否拒绝")
    reject_reason: str = Field("", description="拒绝原因")
    unchange: bool = Field(True, description="是否不修改")


class FRPCloseProxyRequest(BaseModel):
    """FRP 关闭代理请求"""
    content: Dict[str, Any] = Field(..., description="frps 发送的原始内容")
    
    @property
    def user(self) -> str:
        """获取用户名"""
        return str(self.content.get("user", ""))
    
    @property
    def proxy_name(self) -> str:
        """获取代理名称"""
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            return str(proxy_info.get("proxy_name", ""))
        return ""


class FRPCloseProxyResponse(BaseModel):
    """FRP 关闭代理响应"""
    reject: bool = Field(False, description="是否拒绝")
    reject_reason: str = Field("", description="拒绝原因")
    unchange: bool = Field(True, description="是否不修改")


class FRPPingRequest(BaseModel):
    """FRP Ping 请求"""
    content: Dict[str, Any] = Field(..., description="frps 发送的原始内容")


class FRPPingResponse(BaseModel):
    """FRP Ping 响应"""
    reject: bool = Field(False, description="是否拒绝")
    reject_reason: str = Field("", description="拒绝原因")
    unchange: bool = Field(True, description="是否不修改")
