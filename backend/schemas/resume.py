from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class ResumeCreate(BaseModel):
    title: str = Field(min_length=1)
    summary: str | None = None
    template_id: int

    model_config = ConfigDict(from_attributes=True)

class ResumeUpdate(BaseModel):
    title: str | None = None
    summary: str | None = None
    template_id: int | None = None

    model_config = ConfigDict(from_attributes=True)

class ResumeResponse(BaseModel):
    id: int
    title: str
    summary: str | None
    template_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)