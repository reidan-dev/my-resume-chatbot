import json
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from config import settings
from middleware.rate_limiter import rate_limit, get_status, _get_ip
from middleware.input_guard import validate_message
from middleware.global_cap import global_daily_cap, get_daily_status
from models.schemas import ChatRequest, ResetRequest
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
    return {"status": "ok"}


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


@app.post("/ingest")
async def ingest():
    from rag.ingest import run_ingest
    run_ingest()
    return {"status": "ingested"}
