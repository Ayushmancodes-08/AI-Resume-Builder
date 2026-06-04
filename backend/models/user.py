from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, Table, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.database.base import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    password_hash = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

    # Relationship to Resumes table (One-to-Many)
    resumes = relationship('Resume', back_populates='user')

    __table_args__ = (
        Index('idx_users_email', email),
    )