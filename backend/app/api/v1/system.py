from fastapi import APIRouter, Depends
from app.schemas.system import SystemConfig, SystemConfigUpdate
from app.core.config import settings
from app.api.deps import get_current_admin
from app.models.user import User
import os

router = APIRouter()

@router.get("/config", response_model=SystemConfig)
async def get_system_config():
    return SystemConfig(
        frp_server_addr=settings.FRP_SERVER_ADDR,
        frp_server_port=settings.FRP_SERVER_PORT
    )

@router.put("/config", response_model=SystemConfig)
async def update_system_config(
    config: SystemConfigUpdate,
    current_user: User = Depends(get_current_admin)
):
    # 更新内存中的配置
    settings.FRP_SERVER_ADDR = config.frp_server_addr
    settings.FRP_SERVER_PORT = config.frp_server_port
    
    # 更新 .env 文件
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        updated = False
        port_updated = False
        new_lines = []
        
        for line in lines:
            if line.startswith('FRP_SERVER_ADDR='):
                new_lines.append(f'FRP_SERVER_ADDR={config.frp_server_addr}\n')
                updated = True
            elif line.startswith('FRP_SERVER_PORT='):
                new_lines.append(f'FRP_SERVER_PORT={config.frp_server_port}\n')
                port_updated = True
            else:
                new_lines.append(line)
        
        if not updated:
            new_lines.append(f'FRP_SERVER_ADDR={config.frp_server_addr}\n')
        if not port_updated:
            new_lines.append(f'FRP_SERVER_PORT={config.frp_server_port}\n')
        
        with open(env_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
    
    return SystemConfig(
        frp_server_addr=settings.FRP_SERVER_ADDR,
        frp_server_port=settings.FRP_SERVER_PORT
    )
