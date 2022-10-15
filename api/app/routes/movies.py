from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud.movie import add_movie_hate, delete_movie_hate, delete_movie_like, get_movie, delete_movie_hate, get_all_movies, add_movie_like, create_user_movie
from ..schemas.movie import Movie
from ..schemas.like import Like
from ..schemas.hate import Hate
from ..utils import verify_token
from .dependencies import oauth2_scheme, get_db

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
)

@router.get("/", response_model=list[Movie])
def get_all(db: Session = Depends(get_db)):
    return get_all_movies(db=db)

@router.post("/", response_model=Movie)
def create_movie(movie: Movie, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return create_user_movie(db=db, movie=movie, user_id=token_data.user_id)

@router.get("/{movie_id}", response_model=Movie)
def get(movie_id: int, db: Session = Depends(get_db)):
    return get_movie(db=db, movie_id=movie_id)

@router.post("/{movie_id}/like", response_model=Like)
def vote(movie_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return add_movie_like(db=db, movie_id=movie_id, user_id=token_data.user_id)

@router.delete("/{movie_id}/like")
def delete_like(movie_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return delete_movie_like(db=db, movie_id=movie_id, user_id=token_data.user_id)

@router.post("/{movie_id}/hate", response_model=Hate)
def vote(movie_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return add_movie_hate(db=db, movie_id=movie_id, user_id=token_data.user_id)

@router.delete("/{movie_id}/hate")
def delete_hate(movie_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return delete_movie_hate(db=db, movie_id=movie_id, user_id=token_data.user_id)
