from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Index
from sqlalchemy.orm import relationship
from backend.database.base import Base
from datetime import datetime

class Resume(Base):
    __tablename__ = 'resumes'

    id = Column(Integer, primary_key=True)
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    title = Column(String(100))
    summary = Column(Text)
    template_id = Column(Integer, ForeignKey('templates.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='resumes')
    sections = relationship('ResumeSection', back_populates='resume')

    __table_args__ = (
        Index('idx_resumes_user', user_id),
        Index('idx_resumes_template', template_id),
    )

class ResumeSection(Base):
    __tablename__ = 'resume_sections'

    id = Column(Integer, primary_key=True)
    resume_id = Column(Integer, ForeignKey('resumes.id'), nullable=False)
    type = Column(String(50), nullable=False)  # e.g., "education", "experience"
    content = Column(JSON)

    resume = relationship('Resume', back_populates='sections')

    __table_args__ = (
        Index('idx_sections_resume', resume_id),
        Index('idx_sections_type', type),
    )