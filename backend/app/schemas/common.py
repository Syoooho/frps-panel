from pydantic import BaseModel
from typing import Any, Optional

class Response(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: dict
