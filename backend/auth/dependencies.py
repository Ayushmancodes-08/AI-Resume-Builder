from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from backend.database.session import get_db
from backend.models.user import User
from backend.auth.jwt import decode_token

# auto_error=False prevents FastAPI from automatically raising 401 if token is missing
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

def get_current_user(request: Request, db: Session = Depends(get_db)):
    # Look for the Authorization header
    token = None
    authorization: str = request.headers.get("Authorization")
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    if token:
        payload = decode_token(token)
        if payload:
            user_id = payload.get("sub")
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    return user

    # Fallback to guest user
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

