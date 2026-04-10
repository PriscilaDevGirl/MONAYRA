import os

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


database_url = settings.database_url

# Vercel Functions do not provide a writable project filesystem, so we fall back
# to a temporary SQLite database when no external DATABASE_URL is configured.
if database_url == "sqlite:///./monayra.db" and os.getenv("VERCEL"):
    database_url = "sqlite:////tmp/monayra.db"

connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
engine = create_engine(database_url, echo=False, connect_args=connect_args)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
