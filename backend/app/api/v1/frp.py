from fastapi import APIRouter

router = APIRouter()

@router.post("/validate")
async def validate_user():
    return {"message": "验证用户"}

@router.post("/tunnel/register")
async def register_tunnel():
    return {"message": "隧道上线"}

@router.post("/tunnel/unregister")
async def unregister_tunnel():
    return {"message": "隧道下线"}
