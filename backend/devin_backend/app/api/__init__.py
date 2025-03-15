from fastapi import APIRouter
from app.api import code, github, shell, browser

api_router = APIRouter()

api_router.include_router(code.router, prefix="/code", tags=["code"])
api_router.include_router(github.router, prefix="/github", tags=["github"])
api_router.include_router(shell.router, prefix="/shell", tags=["shell"])
api_router.include_router(browser.router, prefix="/browser", tags=["browser"])
