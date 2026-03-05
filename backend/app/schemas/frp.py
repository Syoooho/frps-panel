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
        # FRP 0.67.0: metas 直接在 content 中
        metas = self.content.get("metas", {})
        if isinstance(metas, dict):
            token = metas.get("token", "")
            if token:
                return str(token)
        
        # 如果没有找到，返回空字符串
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
        user_data = self.content.get("user", "")
        
        # FRP 0.67.0: user 可能是字典 {'user': 'email', 'metas': {...}, 'run_id': '...'}
        if isinstance(user_data, dict):
            return str(user_data.get("user", ""))
        
        # 旧版本: user 是字符串
        if isinstance(user_data, str):
            return user_data
        
        # 如果都没有，尝试从 proxy_name 中提取
        proxy_name = str(self.content.get("proxy_name", ""))
        if '.' in proxy_name:
            return proxy_name.rsplit('.', 1)[0]
        
        return ""
    
    @property
    def proxy_name(self) -> str:
        """获取代理名称"""
        # FRP 0.67.0: proxy_name 直接在 content 中
        proxy_name = str(self.content.get("proxy_name", ""))
        
        # 如果没有，尝试从 proxy_info 中获取
        if not proxy_name:
            proxy_info = self.content.get("proxy_info", {})
            if isinstance(proxy_info, dict):
                proxy_name = str(proxy_info.get("proxy_name", ""))
        
        # 去掉用户前缀（格式：user.proxy_name）
        if '.' in proxy_name:
            return proxy_name.rsplit('.', 1)[1]
        
        return proxy_name
    
    @property
    def proxy_type(self) -> str:
        """获取代理类型"""
        # FRP 0.67.0: proxy_type 直接在 content 中
        proxy_type = self.content.get("proxy_type", "")
        if proxy_type:
            return str(proxy_type)
        
        # 旧版本: 在 proxy_info 中
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            return str(proxy_info.get("proxy_type", ""))
        return ""
    
    @property
    def remote_port(self) -> Optional[int]:
        """获取远程端口"""
        # FRP 0.67.0: remote_port 直接在 content 中
        port = self.content.get("remote_port")
        if port:
            return int(port)
        
        # 旧版本: 在 proxy_info 中
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            port = proxy_info.get("remote_port")
            return int(port) if port else None
        return None
    
    @property
    def custom_domains(self) -> list:
        """获取自定义域名"""
        # FRP 0.67.0: custom_domains 直接在 content 中
        domains = self.content.get("custom_domains", [])
        if isinstance(domains, list):
            return domains
        
        # 旧版本: 在 proxy_info 中
        proxy_info = self.content.get("proxy_info", {})
        if isinstance(proxy_info, dict):
            domains = proxy_info.get("custom_domains", [])
            return domains if isinstance(domains, list) else []
        return []
    
    @property
    def subdomain(self) -> str:
        """获取子域名"""
        # FRP 0.67.0: subdomain 直接在 content 中
        subdomain = self.content.get("subdomain", "")
        if subdomain:
            return str(subdomain)
        
        # 旧版本: 在 proxy_info 中
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
        user_data = self.content.get("user", "")
        
        # FRP 0.67.0: user 可能是字典
        if isinstance(user_data, dict):
            return str(user_data.get("user", ""))
        
        # 旧版本: user 是字符串
        if isinstance(user_data, str):
            return user_data
        
        # 如果都没有，尝试从 proxy_name 中提取
        proxy_name = str(self.content.get("proxy_name", ""))
        if '.' in proxy_name:
            return proxy_name.rsplit('.', 1)[0]
        
        return ""
    
    @property
    def proxy_name(self) -> str:
        """获取代理名称"""
        # FRP 0.67.0: proxy_name 直接在 content 中
        proxy_name = str(self.content.get("proxy_name", ""))
        
        # 如果没有，尝试从 proxy_info 中获取
        if not proxy_name:
            proxy_info = self.content.get("proxy_info", {})
            if isinstance(proxy_info, dict):
                proxy_name = str(proxy_info.get("proxy_name", ""))
        
        # 去掉用户前缀
        if '.' in proxy_name:
            return proxy_name.rsplit('.', 1)[1]
        
        return proxy_name


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
