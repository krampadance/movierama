from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud.movie import get_movie, get_all_movies, create_user_movie, add_vote
from ..schemas.movie import Movie, MovieCreate
from ..schemas.vote import VoteCreate
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
def create_movie(movie: MovieCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return create_user_movie(db=db, movie=movie, user_id=token_data.user_id)

@router.get("/{movie_id}", response_model=Movie)
def get(movie_id: int, db: Session = Depends(get_db)):
    return get_movie(db=db, movie_id=movie_id)

@router.post("/{movie_id}/vote")
def vote(movie_id: int, vote: VoteCreate , token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    token_data = verify_token(token)
    return add_vote(db=db, movie_id=movie_id, user_id=token_data.user_id, likes=vote.likes)
