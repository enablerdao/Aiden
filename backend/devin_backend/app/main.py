from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from app.api import api_router

app = FastAPI(title="Devin AI System", description="AI-powered software development assistant")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "name": "Devin AI System",
        "version": "0.1.0",
        "description": "AI-powered software development assistant"
    }

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
