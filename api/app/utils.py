from datetime import datetime, timedelta
from typing import Union
from jose import JWTError, jwt
from fastapi import HTTPException, status

from .Config import Config
from .schemas.token import TokenData

from .routes.dependencies import pwd_context


def get_hashed_password(password: str) -> str:
    """Gets password hash"""
    return pwd_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    """Verifies given password wwith hashed password stored the database"""
    return pwd_context.verify(password, hashed_pass)


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    """Creates and encodes the jwt token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """Verifies that token has sub key in payload, check if it hasn't expired and returns the token data included in the token"""
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return TokenData(email=email, user_id=payload.get("user_id"), name=payload.get("name"))
    except JWTError:
        raise credentials_exception

# Credentials exception TODO: Move it to a better place
credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
)