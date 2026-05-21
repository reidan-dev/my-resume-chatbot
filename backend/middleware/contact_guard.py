import re
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException

CONTACT_LIMIT = 3
CONTACT_WINDOW = timedelta(hours=1)

_store: dict[str, deque] = defaultdict(deque)

_SPAM_KEYWORDS = [
    'casino', 'viagra', 'crypto', 'bitcoin', 'nft', 'forex',
    'investment opportunity', 'seo service', 'backlink', 'buy followers',
    'earn money', 'make money fast', 'work from home', 'cheap meds',
    'click here to', 'limited time offer', 'act now',
]

_URL_RE = re.compile(r'https?://|www\.', re.IGNORECASE)


async def contact_rate_limit(request: Request) -> None:
    from middleware.rate_limiter import _get_ip
    ip = _get_ip(request)
    now = datetime.now(timezone.utc)
    dq = _store[ip]
    cutoff = now - CONTACT_WINDOW
    while dq and dq[0] < cutoff:
        dq.popleft()
    if len(dq) >= CONTACT_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Too many contact submissions. Please try again later.",
        )
    dq.append(now)


def validate_contact_body(honeypot: str, name: str, email: str, message: str) -> None:
    if honeypot:
        raise HTTPException(status_code=400, detail="Invalid submission.")

    name = name.strip()
    email = email.strip()
    message = message.strip()

    if not 2 <= len(name) <= 100:
        raise HTTPException(status_code=422, detail="Name must be 2–100 characters.")
    if not 5 <= len(email) <= 254:
        raise HTTPException(status_code=422, detail="Invalid email address.")
    if not 10 <= len(message) <= 2000:
        raise HTTPException(status_code=422, detail="Message must be 10–2000 characters.")

    if len(_URL_RE.findall(message)) > 2:
        raise HTTPException(status_code=422, detail="Message contains too many links.")

    lower = message.lower()
    for kw in _SPAM_KEYWORDS:
        if kw in lower:
            raise HTTPException(status_code=422, detail="Message was flagged as spam.")
