from fastapi import APIRouter, HTTPException
from app.models import BrowserRequest, BrowserResponse
from app.services.openai_agent_service import openai_agent_service

router = APIRouter()


@router.post("/execute", response_model=BrowserResponse)
async def execute_agent_task(request: BrowserRequest):
    """
    Execute a task using the OpenAI Agents SDK.
    """
    try:
        if request.operation != "execute_task":
            return BrowserResponse(
                success=False,
                error=f"Unsupported operation: {request.operation}"
            )
            
        task = request.parameters.get("task") if request.parameters else None
        if not task:
            raise HTTPException(status_code=400, detail="Task description is required")
        
        max_steps = request.parameters.get("max_steps", 15)
        
        result = await openai_agent_service.execute_task(
            task=task,
            max_steps=max_steps
        )
        
        return BrowserResponse(
            success=result["success"],
            data=result.get("data"),
            error=result.get("error")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
