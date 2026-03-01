from fastapi import APIRouter

router = APIRouter()

@router.get("/users")
async def get_users():
    return {"message": "用户列表"}

@router.put("/users/{user_id}")
async def update_user(user_id: int):
    return {"message": f"更新用户 {user_id}"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int):
    return {"message": f"删除用户 {user_id}"}

@router.get("/stats")
async def get_stats():
    return {"message": "统计数据"}

@router.get("/config")
async def get_config():
    return {"message": "系统配置"}

@router.put("/config")
async def update_config():
    return {"message": "更新配置"}
