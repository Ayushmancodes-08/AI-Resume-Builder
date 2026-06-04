from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.auth.dependencies import get_current_active_user
from backend.models.user import User
from backend.services import ai_service

router = APIRouter(prefix="/ai", tags=["AI Services"])

class ImproveSummaryRequest(BaseModel):
    summary: str
    role: str

class ImproveExperienceRequest(BaseModel):
    experience_text: str

class SuggestSkillsRequest(BaseModel):
    job_title: str
    current_skills: list[str] = []

class OptimizeATSRequest(BaseModel):
    resume_content: str
    job_description: str

@router.post("/improve-summary")
async def improve_summary(
    request: ImproveSummaryRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        improved_text = await ai_service.improve_summary(request.summary, request.role)
        return {"improved_summary": improved_text}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@router.post("/improve-experience")
async def improve_experience(
    request: ImproveExperienceRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        improved_text = await ai_service.improve_experience(request.experience_text)
        return {"improved_experience": improved_text}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@router.post("/suggest-skills")
async def suggest_skills(
    request: SuggestSkillsRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        suggestions = await ai_service.suggest_skills(request.job_title, request.current_skills)
        return {"suggested_skills": suggestions}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@router.post("/optimize-ats")
async def optimize_ats(
    request: OptimizeATSRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        analysis = await ai_service.optimize_for_ats(request.resume_content, request.job_description)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

class ParseResumeRequest(BaseModel):
    text: str

@router.post("/parse-resume")
async def parse_resume(
    request: ParseResumeRequest,
    current_user: User = Depends(get_current_active_user)
):
    try:
        data = await ai_service.parse_resume_text(request.text)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
