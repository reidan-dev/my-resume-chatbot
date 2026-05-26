"""
Run with: uv run python -m rag.ingest
Resume content is sourced from frontend/src/data/resume.json (single source of truth).
Q&A context is sourced from references/hr-questions-context.md via 0__run_ingest.sh.
"""
import os
import json
import chromadb
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_core.documents import Document
from langchain_chroma import Chroma
from llm.provider import get_embeddings
from config import settings

RESUME_JSON_PATH = "../frontend/src/data/resume.json"

CONTEXT_FILES = [
    ("data/hr-questions-context.md", "context"),
]

HEADERS_TO_SPLIT = [
    ("#", "h1"),
    ("##", "h2"),
    ("###", "h3"),
]


def _json_to_markdown(data: dict) -> str:
    lines: list[str] = []
    meta = data["meta"]

    lines.append(f"# {meta['name']['first']} {meta['name']['nick']} {meta['name']['last']}")
    lines.append(f"\n**Titles**: {' | '.join(meta['titles'])}")
    lines.append(f"**Location**: {meta['location']} | **Phone**: {meta['phone']}\n")

    lines.append("## Skills\n")
    for category, items in data["skills"].items():
        lines.append(f"### {category}\n{', '.join(items)}\n")

    lines.append("## Experience\n")
    for job in data["experience"]:
        lines.append(f"### {job['title']} at {job['company']}")
        lines.append(f"Period: {job['period']} ({job['duration']})\n")
        if job.get("countries"):
            # Full country names so the chatbot recognizes them by name or code
            country_names = {
                "AU": "Australia", "ES": "Spain", "JP": "Japan",
                "PH": "Philippines", "US": "United States", "VN": "Vietnam",
            }
            collaborators = ", ".join(country_names.get(c, c) for c in job["countries"])
            lines.append(f"Countries worked with (teammates/clients): {collaborators} ({', '.join(job['countries'])})\n")
        for b in job["bullets"]:
            lines.append(f"- {b}")
        lines.append("")

    # Global summary: all collaborators across entire career
    all_countries: list[str] = []
    for job in data["experience"]:
        if job.get("countries"):
            all_countries.extend(job["countries"])
    seen: set[str] = set()
    unique: list[str] = []
    for c in all_countries:
        if c not in seen:
            seen.add(c)
            unique.append(c)
    country_names = {
        "AU": "Australia", "ES": "Spain", "JP": "Japan",
        "PH": "Philippines", "US": "United States", "VN": "Vietnam",
    }
    lines.append("## Collaborators / International Experience\n")
    names = ", ".join(country_names.get(c, c) for c in unique)
    lines.append(f"All countries Dan has worked with (teammates/clients): {names} ({', '.join(unique)})\n")

    lines.append("## Projects\n")
    lines.append(data["projects"]["note"] + "\n")
    for p in data["projects"]["items"]:
        lines.append(f"### {p['name']}")
        lines.append(f"{p['period']}\n")
        for b in p["bullets"]:
            lines.append(f"- {b}")
        lines.append("")

    lines.append("## Education\n")
    for edu in data["education"]:
        lines.append(f"### {edu['degree']}")
        lines.append(f"{edu['school']} — Graduated {edu['graduated']}\n")
        for b in edu["bullets"]:
            lines.append(f"- {b}")
        lines.append("")

    return "\n".join(lines)


def _load_resume_json_docs(splitter: MarkdownHeaderTextSplitter) -> list[Document]:
    if not os.path.exists(RESUME_JSON_PATH):
        print(f"  WARNING: {RESUME_JSON_PATH} not found — skipping resume.")
        return []

    with open(RESUME_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    markdown = _json_to_markdown(data)
    chunks = splitter.split_text(markdown)
    print(f"  {RESUME_JSON_PATH}: {len(chunks)} chunks")

    docs = []
    for chunk in chunks:
        section = " > ".join(
            filter(None, [chunk.metadata.get("h1", ""), chunk.metadata.get("h2", ""), chunk.metadata.get("h3", "")])
        ) or "General"
        docs.append(Document(
            page_content=chunk.page_content,
            metadata={"source_file": RESUME_JSON_PATH, "section": section, "type": "resume"},
        ))
    return docs


def run_ingest():
    print(f"Ingesting into {settings.vector_db}...")

    splitter = MarkdownHeaderTextSplitter(headers_to_split_on=HEADERS_TO_SPLIT)
    embeddings = get_embeddings()
    all_docs: list[Document] = _load_resume_json_docs(splitter)

    for filepath, doc_type in CONTEXT_FILES:
        if not os.path.exists(filepath):
            print(f"  WARNING: {filepath} not found — skipping.")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = splitter.split_text(content)
        print(f"  {filepath}: {len(chunks)} chunks")

        for chunk in chunks:
            section = " > ".join(
                filter(None, [
                    chunk.metadata.get("h1", ""),
                    chunk.metadata.get("h2", ""),
                    chunk.metadata.get("h3", ""),
                ])
            ) or "General"

            all_docs.append(Document(
                page_content=chunk.page_content,
                metadata={
                    "source_file": filepath,
                    "section": section,
                    "type": doc_type,
                },
            ))

    if not all_docs:
        print("No documents to ingest.")
        return

    print(f"Embedding and storing {len(all_docs)} chunks...")

    if settings.vector_db == "pgvector":
        from langchain_postgres import PGVector
        PGVector.from_documents(
            documents=all_docs,
            embedding=embeddings,
            collection_name="resume",
            connection=settings.database_url,
            pre_delete_collection=True,
        )
    elif settings.vector_db == "chroma":
        client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)
        Chroma.from_documents(
            documents=all_docs,
            embedding=embeddings,
            client=client,
            collection_name="resume",
        )

    print(f"Done. {len(all_docs)} chunks ingested into {settings.vector_db}.")


if __name__ == "__main__":
    run_ingest()
