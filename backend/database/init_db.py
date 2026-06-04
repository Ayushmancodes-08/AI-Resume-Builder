from sqlalchemy.orm import Session
from backend.database.base import Base
from backend.database.session import engine

# Import all models here so Alembic can discover them
from backend.models.user import User
from backend.models.resume import Resume, ResumeSection
from backend.models.template import Template
from backend.models.ai_suggestion import AISuggestion

def init_db() -> None:
    # Tables should be created with Alembic migrations
    # But if you don't have migrations, create them here:
    Base.metadata.create_all(bind=engine)

