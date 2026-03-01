from fastapi import APIRouter

router = APIRouter()

@router.get("/my")
async def get_my_subscription():
    return {"message": "我的订阅"}

@router.get("/quota")
async def get_quota():
    return {"message": "配额信息"}
