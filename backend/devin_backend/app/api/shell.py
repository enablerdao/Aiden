from fastapi import APIRouter, HTTPException
from app.models import ShellRequest, ShellResponse
from app.services.shell_service import shell_service

router = APIRouter()


@router.post("/execute", response_model=ShellResponse)
async def execute_shell_command(request: ShellRequest):
    """
    Execute a shell command and return the output.
    """
    try:
        success, output, error = await shell_service.execute_command(
            command=request.command,
            working_directory=request.working_directory,
            environment_vars=request.environment_vars
        )
        
        return ShellResponse(
            success=success,
            output=output,
            error=error
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
