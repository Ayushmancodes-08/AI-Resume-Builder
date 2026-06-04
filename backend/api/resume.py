from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

# Assuming standard imports for schemas and dependencies
from backend.database.session import get_db
from backend.auth.dependencies import get_current_active_user
from backend.models.user import User
from backend.services import resume_service

# Placeholder schemas (you'd normally import these from backend.schemas.resume)
from pydantic import BaseModel
class ResumeCreate(BaseModel):
    title: str
    content: str

class ResumeUpdate(BaseModel):
    title: str = None
    content: str = None

class ResumeResponse(BaseModel):
    id: str
    title: str
    content: str
    user_id: str
    
    class Config:
        from_attributes = True

router = APIRouter()

@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_in: ResumeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return resume_service.create_resume(db=db, user_id=current_user.id, resume_data=resume_in.model_dump())

@router.get("", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return resume_service.list_user_resumes(db=db, user_id=current_user.id)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return resume_service.get_resume(db=db, resume_id=resume_id, user_id=current_user.id)

@router.patch("/{resume_id}", response_model=ResumeResponse)
def update_resume(
    resume_id: str,
    resume_in: ResumeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    update_data = resume_in.model_dump(exclude_unset=True)
    return resume_service.update_resume(db=db, resume_id=resume_id, user_id=current_user.id, update_data=update_data)

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume_service.delete_resume(db=db, resume_id=resume_id, user_id=current_user.id)
    return None
