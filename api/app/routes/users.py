from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud.user import create_user_movie, get_user_movies
from ..schemas.movie import Movie, MovieCreate
from ..utils import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.post("/{user_id}/movie", response_model=Movie)
def create_movie(user_id: int, movie: MovieCreate, db: Session = Depends(get_db)):
    return create_user_movie(db=db, movie=movie, user_id=user_id)

@router.get("/{user_id}/movies", response_model=list[Movie])
def get_movies(user_id: int, db: Session = Depends(get_db)):
    return get_user_movies(db=db, user_id=user_id)
