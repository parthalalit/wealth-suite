import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Fetch Database URL from Environment Variable (Supabase PostgreSQL Connection)
DATABASE_URL = os.getenv("DATABASE_URL")

# If no PostgreSQL connection is defined, fallback gracefully to a local SQLite database
# so that the client/developer can test the application locally out-of-the-box!
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./wealth_suite.db"

# SQLite requires slightly different arguments for thread-safety in FastAPI
is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency helper to yield database session to FastAPI routers"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
