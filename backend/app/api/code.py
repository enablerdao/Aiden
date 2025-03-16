from fastapi import APIRouter, HTTPException
from app.models import CodeRequest, CodeResponse
from app.services.code_service import code_service

router = APIRouter()


@router.post("/generate", response_model=CodeResponse)
async def generate_code(request: CodeRequest):
    """
    Generate code based on the provided task and context.
    """
    try:
        result = await code_service.generate_code(
            language=request.language,
            task=request.task,
            context=request.context
        )
        
        return CodeResponse(
            code=result["code"],
            explanation=result["explanation"],
            suggestions=result["suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/review", response_model=CodeResponse)
async def review_code(request: CodeRequest):
    """
    Review the provided code and offer suggestions.
    """
    if not request.code:
        raise HTTPException(status_code=400, detail="Code is required for review")
    
    try:
        result = await code_service.review_code(
            code=request.code,
            language=request.language,
            context=request.context
        )
        
        return CodeResponse(
            code=result["code"],
            explanation=result["explanation"],
            suggestions=result["suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fix", response_model=CodeResponse)
async def fix_code(request: CodeRequest):
    """
    Fix issues in the provided code.
    """
    if not request.code:
        raise HTTPException(status_code=400, detail="Code is required for fixing")
    
    try:
        result = await code_service.fix_code(
            code=request.code,
            language=request.language,
            task=request.task,
            context=request.context
        )
        
        return CodeResponse(
            code=result["code"],
            explanation=result["explanation"],
            suggestions=result["suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
