import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.api.wealth import router as wealth_router

# Auto-initialize database tables in local development
# (In production, we will run Alembic migrations against Supabase Postgres)
if os.getenv("ENV", "development") == "development":
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Wealth Management Suite Core API",
    description="Backend API serving high-performance financial math, statement parses, and expense calculations.",
    version="1.0.0"
)

# Enable CORS for the Next.js frontend local port (3000) and production domains
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Wealth Suite Backend API",
        "documentation": "/docs"
    }

# Register Routers
app.include_router(wealth_router)
