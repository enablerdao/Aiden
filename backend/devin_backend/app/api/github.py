from fastapi import APIRouter, HTTPException
from app.models import GitHubRequest, GitHubResponse
from app.services.github_service import github_service

router = APIRouter()


@router.post("/operations", response_model=GitHubResponse)
async def github_operations(request: GitHubRequest):
    """
    Handle GitHub operations like creating PRs, reviewing code, etc.
    """
    try:
        if request.operation == "create_pr":
            result = await github_service.create_pr(
                repo=request.repo,
                content=request.content
            )
            
            return GitHubResponse(
                success=result["success"],
                message=result["message"],
                data=result.get("data")
            )
        elif request.operation == "review_pr":
            pr_number = request.content.get("pr_number")
            if not pr_number:
                raise HTTPException(status_code=400, detail="PR number is required for review")
            
            result = await github_service.review_pr(
                repo=request.repo,
                pr_number=pr_number,
                content=request.content
            )
            
            return GitHubResponse(
                success=result["success"],
                message=result["message"],
                data=result.get("data")
            )
        elif request.operation == "clone_repo":
            destination = request.content.get("destination")
            if not destination:
                raise HTTPException(status_code=400, detail="Destination is required for cloning")
            
            result = await github_service.clone_repo(
                repo=request.repo,
                destination=destination
            )
            
            return GitHubResponse(
                success=result["success"],
                message=result["message"],
                data=result.get("data")
            )
        elif request.operation == "create_branch":
            branch_name = request.content.get("branch_name")
            if not branch_name:
                raise HTTPException(status_code=400, detail="Branch name is required")
            
            base_branch = request.content.get("base_branch", "main")
            
            result = await github_service.create_branch(
                repo=request.repo,
                branch_name=branch_name,
                base_branch=base_branch
            )
            
            return GitHubResponse(
                success=result["success"],
                message=result["message"],
                data=result.get("data")
            )
        else:
            return GitHubResponse(
                success=False,
                message=f"Unsupported operation: {request.operation}"
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
