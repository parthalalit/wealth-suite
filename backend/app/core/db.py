import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Fetch Database URL from Environment Variable (Supabase PostgreSQL Connection)
# Standard Supabase Connection String format: postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/wealth_suite"
)

# Using connection pooling for production robustness
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
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
