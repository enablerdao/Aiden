import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings."""
    PROJECT_NAME: str = "Aiden AI System"
    API_V1_STR: str = "/api"
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAIAPI", "")
    
    # Anthropic settings
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # GitHub settings
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
