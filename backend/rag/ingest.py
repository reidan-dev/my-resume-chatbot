"""
Run with: uv run python -m rag.ingest
Reads from backend/data/resume.md and backend/data/hr-questions-context.md.
To update content: edit the source files in references/, copy to backend/data/, then re-run.
"""
import os
import chromadb
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain.schema import Document
from langchain_chroma import Chroma
from llm.provider import get_embeddings
from config import settings

DATA_FILES = [
    ("data/resume.md", "resume"),
    ("data/hr-questions-context.md", "context"),
]

HEADERS_TO_SPLIT = [
    ("#", "h1"),
    ("##", "h2"),
    ("###", "h3"),
]


def run_ingest():
    print(f"Ingesting into {settings.vector_db}...")
    client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)

    try:
        client.delete_collection("resume")
        print("Dropped existing collection.")
    except Exception:
        pass

    splitter = MarkdownHeaderTextSplitter(headers_to_split_on=HEADERS_TO_SPLIT)
    embeddings = get_embeddings()
    all_docs: list[Document] = []

    for filepath, doc_type in DATA_FILES:
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
        Chroma.from_documents(
            documents=all_docs,
            embedding=embeddings,
            client=client,
            collection_name="resume",
        )

    print(f"Done. {len(all_docs)} chunks ingested into {settings.vector_db}.")


if __name__ == "__main__":
    run_ingest()
