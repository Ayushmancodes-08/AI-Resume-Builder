from sqlalchemy import Column, Integer, String, ForeignKey, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Resume(Base):
    __tablename__ = 'resumes'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(100))
    summary = Column(String(255))
    template_id = Column(Integer, ForeignKey('templates.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='resumes')
    sections = relationship('ResumeSection', back_populates='resume')

class ResumeSection(Base):
    __tablename__ = 'resume_sections'

    id = Column(Integer, primary_key=True)
    resume_id = Column(Integer, ForeignKey('resumes.id'), nullable=False)
    section_type = Column(String(50), nullable=False)  # e.g., "education", "experience"
    title = Column(String(100))
    content = Column(JSONB)
    display_order = Column(Integer)

    resume = relationship('Resume', back_populates='sections')

# Ensure you also define the User and Template models if they are not already defined