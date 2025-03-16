from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class CodeRequest(BaseModel):
    """Request model for code generation and analysis."""
    code: Optional[str] = None
    language: str
    task: str
    context: Optional[str] = None


class CodeResponse(BaseModel):
    """Response model for code generation and analysis."""
    code: str
    explanation: Optional[str] = None
    suggestions: Optional[List[str]] = None


class GitHubRequest(BaseModel):
    """Request model for GitHub operations."""
    repo: str
    operation: str  # 'create_pr', 'review_pr', etc.
    content: Dict[str, Any]


class GitHubResponse(BaseModel):
    """Response model for GitHub operations."""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None


class ShellRequest(BaseModel):
    """Request model for shell command execution."""
    command: str
    working_directory: Optional[str] = None
    environment_vars: Optional[Dict[str, str]] = None


class ShellResponse(BaseModel):
    """Response model for shell command execution."""
    success: bool
    output: str
    error: Optional[str] = None


class BrowserRequest(BaseModel):
    """Request model for browser operations."""
    url: Optional[str] = None
    operation: str  # 'navigate', 'search', 'screenshot', etc.
    parameters: Optional[Dict[str, Any]] = None


class BrowserResponse(BaseModel):
    """Response model for browser operations."""
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
