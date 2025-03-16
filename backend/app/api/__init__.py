from fastapi import APIRouter
from app.api import code, github, shell, browser, openai_agent

api_router = APIRouter()

api_router.include_router(code.router, prefix="/code", tags=["code"])
api_router.include_router(github.router, prefix="/github", tags=["github"])
api_router.include_router(shell.router, prefix="/shell", tags=["shell"])
api_router.include_router(browser.router, prefix="/browser", tags=["browser"])
api_router.include_router(openai_agent.router, prefix="/openai-agent", tags=["openai-agent"])
