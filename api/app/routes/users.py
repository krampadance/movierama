from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud.user import get_user_movies, get_current_user
from ..schemas.movie import Movie
from ..schemas.user import User
from .dependencies import oauth2_scheme, get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/{user_id}/movies", response_model=list[Movie])
def get_movies(user_id: int, db: Session = Depends(get_db)):
    return get_user_movies(db=db, user_id=user_id)

@router.get("/me/", response_model=User)
def get_own_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user(db, token)