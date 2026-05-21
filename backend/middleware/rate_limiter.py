from fastapi import Request, HTTPException
from datetime import datetime, timedelta, timezone
from collections import defaultdict, deque
from config import settings

RATE_LIMIT = settings.rate_limit_questions
WINDOW_DAYS = settings.rate_limit_window_days
BURST_LIMIT = settings.burst_limit  # requests per minute per IP

_store: dict[str, dict] = defaultdict(lambda: {"count": 0, "reset_at": None})
_burst: dict[str, deque] = defaultdict(deque)


def _get_ip(request: Request) -> str:
    # Use the last entry in X-Forwarded-For — Railway appends the real client IP,
    # so the last value is the one the proxy verified, not a client-claimed value.
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[-1].strip()
    return request.client.host


def _check_burst(ip: str) -> None:
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(minutes=1)
    dq = _burst[ip]
    while dq and dq[0] < window_start:
        dq.popleft()
    if len(dq) >= BURST_LIMIT:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "burst_limit_exceeded",
                "message": f"Too many requests. Max {BURST_LIMIT} questions per minute.",
            },
        )
    dq.append(now)


async def rate_limit(request: Request) -> dict:
    ip = _get_ip(request)
    _check_burst(ip)
    now = datetime.now(timezone.utc)
    rec = _store[ip]

    if rec["reset_at"] is None or now >= rec["reset_at"]:
        rec["count"] = 0
        rec["reset_at"] = now + timedelta(days=WINDOW_DAYS)

    if rec["count"] >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "rate_limit_exceeded",
                "questions_used": rec["count"],
                "limit": RATE_LIMIT,
                "reset_at": rec["reset_at"].isoformat(),
            },
        )

    rec["count"] += 1
    return {
        "remaining": RATE_LIMIT - rec["count"],
        "reset_at": rec["reset_at"].isoformat(),
        "limit": RATE_LIMIT,
    }


def get_status(ip: str) -> dict:
    rec = _store.get(ip)
    if not rec or rec["reset_at"] is None:
        return {"remaining": RATE_LIMIT, "limit": RATE_LIMIT, "reset_at": None}
    now = datetime.now(timezone.utc)
    if now >= rec["reset_at"]:
        return {"remaining": RATE_LIMIT, "limit": RATE_LIMIT, "reset_at": None}
    return {
        "remaining": max(0, RATE_LIMIT - rec["count"]),
        "limit": RATE_LIMIT,
        "reset_at": rec["reset_at"].isoformat(),
    }
