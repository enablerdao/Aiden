from fastapi import APIRouter, HTTPException
from app.models import BrowserRequest, BrowserResponse
from app.services.browser_service import browser_service

router = APIRouter()


@router.post("/actions", response_model=BrowserResponse)
async def browser_actions(request: BrowserRequest):
    """
    Handle browser operations like navigation, search, screenshots, etc.
    """
    try:
        if request.operation == "navigate":
            if not request.url:
                raise HTTPException(status_code=400, detail="URL is required for navigation")
            
            result = await browser_service.navigate(url=request.url)
            
            return BrowserResponse(
                success=result["success"],
                data=result.get("data"),
                error=result.get("error")
            )
        elif request.operation == "search":
            query = request.parameters.get("query") if request.parameters else None
            if not query:
                raise HTTPException(status_code=400, detail="Query is required for search")
            
            result = await browser_service.search(query=query)
            
            return BrowserResponse(
                success=result["success"],
                data=result.get("data"),
                error=result.get("error")
            )
        elif request.operation == "screenshot":
            result = await browser_service.take_screenshot(
                url=request.url
            )
            
            return BrowserResponse(
                success=result["success"],
                data=result.get("data"),
                error=result.get("error")
            )
        elif request.operation == "extract_content":
            if not request.url:
                raise HTTPException(status_code=400, detail="URL is required for content extraction")
            
            selector = request.parameters.get("selector") if request.parameters else None
            if not selector:
                raise HTTPException(status_code=400, detail="Selector is required for content extraction")
            
            result = await browser_service.extract_content(
                url=request.url,
                selector=selector
            )
            
            return BrowserResponse(
                success=result["success"],
                data=result.get("data"),
                error=result.get("error")
            )
        elif request.operation == "execute_task":
            task = request.parameters.get("task") if request.parameters else None
            if not task:
                raise HTTPException(status_code=400, detail="Task description is required")
            
            max_steps = request.parameters.get("max_steps", 15)
            
            result = await browser_service.execute_task(
                task=task,
                max_steps=max_steps
            )
            
            return BrowserResponse(
                success=result["success"],
                data=result.get("data"),
                error=result.get("error")
            )
        else:
            return BrowserResponse(
                success=False,
                error=f"Unsupported operation: {request.operation}"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
