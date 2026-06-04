from sqlalchemy import Column, Integer, String, Boolean
from backend.database.base import Base

class Template(Base):
    __tablename__ = 'templates'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    preview_image = Column(String(255))
    is_premium = Column(Boolean, default=False)

# Ensure you also define the User and Resume models if they are not already defined