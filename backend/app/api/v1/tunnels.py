from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.tunnel_service import TunnelService
from app.schemas.tunnel import TunnelCreate, TunnelUpdate, TunnelResponse
from typing import List

router = APIRouter()

@router.get("", response_model=List[TunnelResponse])
async def get_tunnels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TunnelService.get_user_tunnels(db, current_user.id)

@router.post("", response_model=TunnelResponse)
async def create_tunnel(
    tunnel_data: TunnelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TunnelService.create_tunnel(db, tunnel_data, current_user.id)

@router.get("/{tunnel_id}", response_model=TunnelResponse)
async def get_tunnel(
    tunnel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TunnelService.get_tunnel(db, tunnel_id, current_user.id)

@router.put("/{tunnel_id}", response_model=TunnelResponse)
async def update_tunnel(
    tunnel_id: int,
    tunnel_data: TunnelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TunnelService.update_tunnel(db, tunnel_id, current_user.id, tunnel_data)

@router.delete("/{tunnel_id}")
async def delete_tunnel(
    tunnel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TunnelService.delete_tunnel(db, tunnel_id, current_user.id)
