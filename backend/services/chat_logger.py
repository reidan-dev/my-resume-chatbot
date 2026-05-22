import asyncio
import logging
from config import settings

logger = logging.getLogger(__name__)


async def _insert(session_id: str, user_message: str, ai_response: str) -> None:
    if not settings.database_url:
        return
    try:
        import psycopg
        url = settings.database_url.replace("postgresql+psycopg://", "postgresql://")
        async with await psycopg.AsyncConnection.connect(url) as conn:
            await conn.execute(
                "INSERT INTO chat_logs (session_id, user_message, ai_response) VALUES (%s, %s, %s)",
                (session_id, user_message, ai_response),
            )
    except Exception:
        logger.exception("Failed to write chat log")


def log_chat(session_id: str, user_message: str, ai_response: str) -> None:
    asyncio.create_task(_insert(session_id, user_message, ai_response))
