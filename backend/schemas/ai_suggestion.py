
from pydantic import BaseModel, Field
from datetime import datetime

class AISuggestionBase(BaseModel):
    resume_id: int = Field(..., description="The ID of the associated resume")
    original_text: str = Field(..., min_length=1)
    suggested_text: str = Field(..., min_length=1)
    suggestion_type: str = Field(..., max_length=50)

class AISuggestionCreate(AISuggestionBase):
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the suggestion was created")

class AISuggestionResponse(AISuggestionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True