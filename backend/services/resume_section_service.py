from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from backend.models.resume import ResumeSection, Resume

def create_resume_section(db: Session, user_id: str, section_data: dict) -> ResumeSection:
    # Validate resume ownership
    resume_id = section_data.get("resume_id")
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found or not owned by user")
        
    new_section = ResumeSection(**section_data)
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    return new_section

def get_resume_section(db: Session, section_id: str, user_id: str) -> ResumeSection:
    section = db.query(ResumeSection).join(Resume).filter(
        ResumeSection.id == section_id,
        Resume.user_id == user_id
    ).first()
    
    if not section:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume section not found")
    return section

def update_resume_section(db: Session, section_id: str, user_id: str, update_data: dict) -> ResumeSection:
    section = get_resume_section(db, section_id, user_id)
    
    for key, value in update_data.items():
        setattr(section, key, value)
        
    db.commit()
    db.refresh(section)
    return section

def delete_resume_section(db: Session, section_id: str, user_id: str) -> bool:
    section = get_resume_section(db, section_id, user_id)
    db.delete(section)
    db.commit()
    return True
