from pydantic import BaseModel, Field, ConfigDict

class ResumeSectionCreate(BaseModel):
    resume_id: int
    section_type: str = Field(min_length=1)
    title: str = Field(min_length=1)
    content: dict  # JSONB equivalent in Pydantic
    display_order: int

    model_config = ConfigDict(from_attributes=True)

class ResumeSectionUpdate(BaseModel):
    section_type: str | None = None
    title: str | None = None
    content: dict | None = None  # JSONB equivalent in Pydantic
    display_order: int | None = None

    model_config = ConfigDict(from_attributes=True)

class ResumeSectionResponse(BaseModel):
    id: int
    resume_id: int
    section_type: str
    title: str
    content: dict  # JSONB equivalent in Pydantic
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)