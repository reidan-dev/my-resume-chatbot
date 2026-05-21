import os
from typing import AsyncIterator
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from rag.retriever import get_retriever
from llm.provider import get_llm
from llm.prompts import SYSTEM_PROMPT_TEMPLATE
from config import settings


def _load_personality() -> str:
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'personality.md')
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return ""


class RAGChain:
    def __init__(self):
        self._llm = None
        self._retriever = None
        self.histories: dict[str, list] = {}
        self.last_sources: dict[str, list[str]] = {}
        self._personality = _load_personality()

    @property
    def llm(self):
        if self._llm is None:
            self._llm = get_llm()
        return self._llm

    @property
    def retriever(self):
        if self._retriever is None:
            self._retriever = get_retriever()
        return self._retriever

    def _format_history(self, session_id: str) -> str:
        history = self.histories.get(session_id, [])
        if not history:
            return "No prior conversation."
        cutoff = settings.session_memory_turns * 2
        lines = []
        for msg in history[-cutoff:]:
            role = "User" if isinstance(msg, HumanMessage) else "Assistant"
            lines.append(f"{role}: {msg.content}")
        return "\n".join(lines)

    async def astream(self, query: str, session_id: str) -> AsyncIterator[str]:
        docs = await self.retriever.ainvoke(query)

        context = "\n\n---\n\n".join(
            f"[{doc.metadata.get('section', 'General')}]\n{doc.page_content}"
            for doc in docs
        )
        self.last_sources[session_id] = list(dict.fromkeys(
            doc.metadata.get("section", "General") for doc in docs
        ))

        prompt = SYSTEM_PROMPT_TEMPLATE.format(
            bot_name=settings.bot_name,
            owner_name=settings.contact_name,
            contact_email=settings.contact_email,
            personality=self._personality,
            context=context,
            history=self._format_history(session_id),
        )

        messages = [SystemMessage(content=prompt), HumanMessage(content=query)]

        full_response = ""
        async for chunk in self.llm.astream(messages):
            token = chunk.content if hasattr(chunk, "content") else str(chunk)
            if token:
                full_response += token
                yield token

        history = self.histories.setdefault(session_id, [])
        history.append(HumanMessage(content=query))
        history.append(AIMessage(content=full_response))

        max_msgs = settings.session_memory_turns * 2
        if len(history) > max_msgs:
            self.histories[session_id] = history[-max_msgs:]

    def clear_history(self, session_id: str) -> None:
        self.histories.pop(session_id, None)
        self.last_sources.pop(session_id, None)
