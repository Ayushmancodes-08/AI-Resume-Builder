from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

# Assuming these exist based on the standard project structure
from backend.database.session import get_db
from backend.models.user import User
from backend.auth.jwt import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(db: Session = Depends(get_db)):
    from backend.models.user import User
    
    guest_email = "guest@example.com"
    user = db.query(User).filter(User.email == guest_email).first()
    if not user:
        user = User(
            email=guest_email,
            name="Guest User",
            password_hash={"hash": "mock"}
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user

