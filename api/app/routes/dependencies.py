from typing import Generator
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from ..database.database import SessionLocal

# Dependency functions to be passed to the fastapi

# Crypt context for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Authentication scheme that points to /auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Database session/connection to be used per request, it is passed as a dependency to the endpoints
def get_db() -> Generator:
    db = SessionLocal()
    db.current_user_id = None
    try:
        yield db
    finally:
        db.close()
