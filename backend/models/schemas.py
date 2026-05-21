from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ResetRequest(BaseModel):
    session_id: str = "default"


class RateLimitStatus(BaseModel):
    remaining: int
    limit: int
    reset_at: Optional[str] = None


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str
