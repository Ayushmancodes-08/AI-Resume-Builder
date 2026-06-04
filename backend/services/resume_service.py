from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

# Assuming standard imports
from backend.models.resume import Resume

def create_resume(db: Session, user_id: str, resume_data: dict) -> Resume:
    new_resume = Resume(user_id=user_id, **resume_data)
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

def get_resume(db: Session, resume_id: str, user_id: str) -> Resume:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume

def update_resume(db: Session, resume_id: str, user_id: str, update_data: dict) -> Resume:
    resume = get_resume(db, resume_id, user_id)
    
    for key, value in update_data.items():
        setattr(resume, key, value)
        
    db.commit()
    db.refresh(resume)
    return resume

def delete_resume(db: Session, resume_id: str, user_id: str) -> bool:
    resume = get_resume(db, resume_id, user_id)
    db.delete(resume)
    db.commit()
    return True

def list_user_resumes(db: Session, user_id: str) -> List[Resume]:
    return db.query(Resume).filter(Resume.user_id == user_id).all()
