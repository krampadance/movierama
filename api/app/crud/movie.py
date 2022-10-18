import datetime
from fastapi import HTTPException
from sqlalchemy import desc, asc
from typing import Union
from sqlalchemy.orm import Session
from .utils import get_order_by_clause

from ..models.movie import Movie
from ..models.vote import Vote
from ..schemas.movie import MovieCreate


def get_movie(db: Session, movie_id: int):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


def add_vote(db: Session, movie_id: int, user_id: int, likes: bool):
    """ 
    User votes whether he like or not. If he has already liked and he likes, the vote is revoked.
    Same happens with hate votes.
    If he votes for first time, then the vote is registered
    """
    movie = db.query(Movie).filter(Movie.id == movie_id,).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    if movie.user_id == user_id:
        raise HTTPException(status_code=403, detail="User cannot vote own movies")
    db_vote = db.query(Vote).filter(Vote.movie_id == movie_id, Vote.user_id == user_id).first()
    if db_vote is not None:
        if db_vote.is_like == likes:  # If user already likes/hates delete existing vote
            db.delete(db_vote)
            db.commit()
            return
        else:  # Set vote
            db_vote.is_like = likes
    else:
        db_vote = Vote(user_id=user_id, movie_id=movie_id, is_like=likes)
        db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return db_vote


def get_all_movies(db: Session, order_by: Union[str, None], direction: str='asc', skip: int = 0, limit: int = 1000):
    query = db.query(Movie)
    if order_by is None:
        return query.order_by(Movie.id.asc()).offset(skip).limit(limit).all()
    if direction == 'asc':  # The extra order by id is added because when multiple movies have same value, results can be skipped because of the limit
        return query.order_by(get_order_by_clause(order_by, direction), Movie.id.asc()).offset(skip).limit(limit).all()
    return query.order_by(get_order_by_clause(order_by, direction), Movie.id.asc()).offset(skip).limit(limit).all()


def create_user_movie(db: Session, movie: MovieCreate, user_id: int) -> Movie:
    db_movie = Movie(**movie.dict(), user_id=user_id, created_at=datetime.datetime.utcnow())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie