from fastapi import HTTPException, status

from sqlalchemy.orm import Session

from ..models.user import User
from ..schemas.user import UserCreate

from ..models.movie import Movie
from ..schemas.token import TokenData

from ..utils import verify_password, get_hashed_password, verify_token


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(email=user.email, hashed_password=get_hashed_password(user.password), first_name=user.first_name, last_name=user.last_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_movies(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist")
    return db.query(Movie).filter(Movie.user_id == user_id).all()


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_email(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_current_user(db: Session, token: str):
    token_data : TokenData = verify_token(token)
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
