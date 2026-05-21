from fastapi import HTTPException
from config import settings

_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all previous",
    "disregard your instructions",
    "disregard all instructions",
    "you are now",
    "forget you are",
    "forget your instructions",
    "act as if you are",
    "pretend you are",
    "pretend to be",
    "jailbreak",
    "dan mode",
    "developer mode",
    "system prompt",
    "override your",
]


def validate_message(message: str) -> None:
    if not message or not message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    if len(message) > settings.max_message_length:
        raise HTTPException(
            status_code=400,
            detail=f"Message too long. Maximum {settings.max_message_length} characters.",
        )

    lower = message.lower()
    for pattern in _INJECTION_PATTERNS:
        if pattern in lower:
            raise HTTPException(
                status_code=400,
                detail="Message contains disallowed content.",
            )
