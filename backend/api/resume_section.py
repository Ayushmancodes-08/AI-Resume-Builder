from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database.session import get_db
from backend.auth.dependencies import get_current_active_user
from backend.models.user import User
from backend.services import resume_section_service

class ResumeSectionCreate(BaseModel):
    resume_id: str
    section_type: str
    title: str
    content: dict

class ResumeSectionUpdate(BaseModel):
    title: str = None
    content: dict = None

class ResumeSectionResponse(BaseModel):
    id: str
    resume_id: str
    section_type: str
    title: str
    content: dict
    
    class Config:
        from_attributes = True

router = APIRouter(prefix="/resume-sections", tags=["Resume Sections"])

@router.post("", response_model=ResumeSectionResponse, status_code=status.HTTP_201_CREATED)
def create_section(
    section_in: ResumeSectionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return resume_section_service.create_resume_section(
        db=db, 
        user_id=current_user.id, 
        section_data=section_in.model_dump()
    )

@router.get("/{section_id}", response_model=ResumeSectionResponse)
def get_section(
    section_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return resume_section_service.get_resume_section(
        db=db, 
        section_id=section_id, 
        user_id=current_user.id
    )

@router.patch("/{section_id}", response_model=ResumeSectionResponse)
def update_section(
    section_id: str,
    section_in: ResumeSectionUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    update_data = section_in.model_dump(exclude_unset=True)
    return resume_section_service.update_resume_section(
        db=db, 
        section_id=section_id, 
        user_id=current_user.id, 
        update_data=update_data
    )

@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_section(
    section_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume_section_service.delete_resume_section(
        db=db, 
        section_id=section_id, 
        user_id=current_user.id
    )
    return None
