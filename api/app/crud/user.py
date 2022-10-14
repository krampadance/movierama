from fastapi import HTTPException

from sqlalchemy.orm import Session

from ..models.user import User
from ..schemas.user import UserCreate

from ..models.movie import Movie
from ..schemas.movie import MovieCreate


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = User(email=user.email, hashed_password=fake_hashed_password, first_name=user.first_name, last_name=user.last_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_movie(db: Session, movie: MovieCreate, user_id: int) -> Movie:
    db_movie = Movie(**movie.dict(), user_id=user_id)
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_user_movies(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=400, detail="User does not exist")
    return db.query(Movie).filter(Movie.user_id == user_id).all()
