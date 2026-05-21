import json
import logging
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from config import settings
from middleware.rate_limiter import rate_limit, get_status, _get_ip
from middleware.input_guard import validate_message
from middleware.global_cap import global_daily_cap, get_daily_status
from models.schemas import ChatRequest, ResetRequest, ContactRequest
from rag.chain import RAGChain

app = FastAPI(title="Resume Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
)

rag_chain = RAGChain()


@app.get("/health")
async def health():
    model_map = {
        "openai": settings.openai_model,
        "claude": settings.claude_model,
        "ollama": settings.ollama_model,
    }
    return {
        "status": "ok",
        "model": model_map.get(settings.llm_provider, settings.llm_provider),
    }


@app.get("/rate-limit")
async def check_rate_limit(request: Request):
    ip = _get_ip(request)
    return {**get_status(ip), **get_daily_status()}


@app.post("/chat")
async def chat(
    body: ChatRequest,
    request: Request,
    rl: dict = Depends(rate_limit),
    _cap: dict = Depends(global_daily_cap),
):
    validate_message(body.message)

    async def stream():
        try:
            async for token in rag_chain.astream(body.message, body.session_id):
                yield json.dumps({"type": "token", "text": token})

            sources = rag_chain.last_sources.get(body.session_id, [])
            yield json.dumps({"type": "sources", "sources": sources})
            yield json.dumps({"type": "rate_limit", **rl})
        except Exception as e:
            logger.exception("Error during chat stream")
            yield json.dumps({"type": "error", "message": str(e)})
        finally:
            yield "[DONE]"

    response = EventSourceResponse(stream())
    response.headers["X-RateLimit-Limit"] = str(rl["limit"])
    response.headers["X-RateLimit-Remaining"] = str(rl["remaining"])
    response.headers["X-RateLimit-Reset"] = rl["reset_at"]
    return response


@app.post("/chat/reset")
async def reset_chat(body: ResetRequest):
    rag_chain.clear_history(body.session_id)
    return {"status": "ok"}


@app.post("/contact")
async def contact(body: ContactRequest):
    if not settings.smtp_user or not settings.smtp_password:
        raise HTTPException(
            status_code=503,
            detail="Contact form not configured. Email Dan directly at reinieldan@gmail.com",
        )
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Portfolio Contact: {body.name}"
        msg["From"] = settings.smtp_user
        msg["To"] = settings.contact_email
        msg["Reply-To"] = body.email
        body_text = (
            f"Name: {body.name}\n"
            f"Email: {body.email}\n\n"
            f"{body.message}"
        )
        msg.attach(MIMEText(body_text, "plain"))
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        return {"status": "sent"}
    except Exception:
        logger.exception("Failed to send contact email")
        raise HTTPException(status_code=500, detail="Failed to send email. Please try again.")


@app.post("/ingest")
async def ingest():
    from rag.ingest import run_ingest
    run_ingest()
    return {"status": "ingested"}
