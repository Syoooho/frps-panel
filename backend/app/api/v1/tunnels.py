from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def get_tunnels():
    return {"message": "隧道列表"}

@router.post("")
async def create_tunnel():
    return {"message": "创建隧道"}

@router.put("/{tunnel_id}")
async def update_tunnel(tunnel_id: int):
    return {"message": f"更新隧道 {tunnel_id}"}

@router.delete("/{tunnel_id}")
async def delete_tunnel(tunnel_id: int):
    return {"message": f"删除隧道 {tunnel_id}"}

@router.get("/{tunnel_id}/status")
async def get_tunnel_status(tunnel_id: int):
    return {"message": f"隧道状态 {tunnel_id}"}
