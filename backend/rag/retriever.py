from langchain.schema import BaseRetriever
from llm.provider import get_embeddings
from config import settings

_retriever: BaseRetriever | None = None


def get_retriever() -> BaseRetriever:
    global _retriever
    if _retriever is None:
        embeddings = get_embeddings()

        if settings.vector_db == "pgvector":
            from langchain_postgres import PGVector
            vectorstore = PGVector(
                embeddings=embeddings,
                collection_name="resume",
                connection=settings.database_url,
            )
        else:
            import chromadb
            from langchain_chroma import Chroma
            client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)
            vectorstore = Chroma(
                client=client,
                collection_name="resume",
                embedding_function=embeddings,
            )

        _retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": settings.retrieval_top_k},
        )
    return _retriever
