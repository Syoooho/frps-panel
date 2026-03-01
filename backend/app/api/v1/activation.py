from fastapi import APIRouter

router = APIRouter()

@router.post("/redeem")
async def redeem_code():
    return {"message": "兑换码激活"}

@router.post("/generate")
async def generate_codes():
    return {"message": "生成兑换码"}

@router.get("/list")
async def list_codes():
    return {"message": "兑换码列表"}

@router.delete("/{code_id}")
async def delete_code(code_id: int):
    return {"message": f"删除兑换码 {code_id}"}
