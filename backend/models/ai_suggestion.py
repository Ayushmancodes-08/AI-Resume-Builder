from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.base import Base
from datetime import datetime

class AISuggestion(Base):
    __tablename__ = 'ai_suggestions'

    id = Column(Integer, primary_key=True)
    resume_id = Column(Integer, ForeignKey('resumes.id'), nullable=False)
    original_text = Column(String(255), nullable=False)
    suggested_text = Column(String(255), nullable=False)
    suggestion_type = Column(String(50), nullable=False)  # e.g., "keyword", "formatting", "action-verb"
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship('Resume')