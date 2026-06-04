
from pydantic import BaseModel, Field

class TemplateBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: str = Field(..., min_length=50)
    preview_image: str = Field(..., max_length=255)
    is_premium: bool = False

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(TemplateBase):
    name: str | None = Field(None, max_length=100)
    description: str | None = Field(None, min_length=50)
    preview_image: str | None = Field(None, max_length=255)
    is_premium: bool | None = None

class TemplateResponse(TemplateBase):
    id: int

    class Config:
        orm_mode = True