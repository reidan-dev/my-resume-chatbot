from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # LLM
    llm_provider: str = "ollama"
    ollama_model: str = "llama3"
    ollama_base_url: str = "http://localhost:11434"
    claude_api_key: str = ""
    claude_model: str = "claude-sonnet-4-6"
    openai_model: str = "gpt-4o-mini"

    # Embeddings
    embed_provider: str = "ollama"
    embed_model: str = "nomic-embed-text"
    openai_api_key: str = ""

    # Vector DB
    vector_db: str = "chroma"
    chroma_host: str = "localhost"
    chroma_port: int = 8001
    pinecone_api_key: str = ""
    pinecone_index: str = "resume"
    database_url: str = ""  # postgresql+psycopg://... for pgvector (Supabase)

    # Rate limiting
    rate_limit_questions: int = 5
    rate_limit_window_days: int = 3
    burst_limit: int = 3             # max requests per minute per IP
    global_daily_limit: int = 100    # max total questions per day across all users
    redis_url: str = ""

    # Input guard
    max_message_length: int = 300

    # LLM output cap
    llm_max_tokens: int = 500

    # Bot
    bot_name: str = "Folio"

    # SMTP (for contact form)
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""

    # Contact
    contact_name: str = "Dan Pablo"
    contact_email: str = "reinieldan@gmail.com"
    contact_linkedin: str = "https://linkedin.com/in/danpablo"
    contact_github: str = "https://github.com/reidan22"

    # App
    backend_cors_origins: str = "http://localhost:5173"
    session_memory_turns: int = 6
    retrieval_top_k: int = 4


settings = Settings()
