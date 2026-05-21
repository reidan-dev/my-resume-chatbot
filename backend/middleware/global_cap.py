from datetime import date
from threading import Lock
from fastapi import HTTPException
from config import settings


class _GlobalDailyCap:
    def __init__(self):
        self._count = 0
        self._date = date.today()
        self._lock = Lock()

    def check_and_increment(self) -> dict:
        with self._lock:
            today = date.today()
            if today != self._date:
                self._count = 0
                self._date = today

            limit = settings.global_daily_limit
            if self._count >= limit:
                raise HTTPException(
                    status_code=503,
                    detail={
                        "error": "daily_limit_exceeded",
                        "message": "This chatbot has reached its daily limit. Please try again tomorrow.",
                        "limit": limit,
                    },
                )

            self._count += 1
            return {"daily_remaining": limit - self._count, "daily_limit": limit}

    def get_status(self) -> dict:
        with self._lock:
            today = date.today()
            if today != self._date:
                return {"daily_remaining": settings.global_daily_limit, "daily_limit": settings.global_daily_limit}
            limit = settings.global_daily_limit
            return {"daily_remaining": max(0, limit - self._count), "daily_limit": limit}


_cap = _GlobalDailyCap()


async def global_daily_cap() -> dict:
    return _cap.check_and_increment()


def get_daily_status() -> dict:
    return _cap.get_status()
