from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud.movie import add_movie_hate, delete_movie_hate, delete_movie_like, get_movie, delete_movie_hate, get_all_movies, add_movie_like
from ..schemas.movie import Movie
from ..schemas.like import LikeCreate, LikeDelete, Like
from ..schemas.hate import HateCreate, HateDelete, Hate
from ..utils import get_db

router = APIRouter(
    prefix="/movies",
    tags=["movies"],
)

@router.get("/", response_model=list[Movie])
def get_all(db: Session = Depends(get_db)):
    return get_all_movies(db=db)

@router.get("/{movie_id}", response_model=Movie)
def get(movie_id: int, db: Session = Depends(get_db)):
    return get_movie(db=db, movie_id=movie_id)

@router.post("/{movie_id}/like", response_model=Like)
def vote(movie_id: int, like: LikeCreate, db: Session = Depends(get_db)):
    return add_movie_like(db=db, movie_id=movie_id, like=like)

@router.delete("/{movie_id}/like")
def delete_vote(movie_id: int, like_delete: LikeDelete, db: Session = Depends(get_db)):
    return delete_movie_like(db=db, movie_id=movie_id, like_delete=like_delete)

@router.post("/{movie_id}/hate", response_model=Hate)
def vote(movie_id: int, hate: HateCreate, db: Session = Depends(get_db)):
    return add_movie_hate(db=db, movie_id=movie_id, hate=hate)

@router.delete("/{movie_id}/hate")
def delete_vote(movie_id: int, like_delete: HateDelete, db: Session = Depends(get_db)):
    return delete_movie_hate(db=db, movie_id=movie_id, like_delete=like_delete)
