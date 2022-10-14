
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session

from ..models.movie import Movie
from ..models.like import Like
from ..models.hate import Hate
from ..schemas.movie import MovieCreate
from ..schemas.like import LikeCreate, LikeDelete
from ..schemas.hate import HateCreate, HateDelete


def get_movie(db: Session, movie_id: int):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

def add_movie_like(db: Session, movie_id: int, like=LikeCreate):
    movie = db.query(Movie).filter(Movie.id == movie_id,).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    if movie.user_id == like.user_id:
        raise HTTPException(status_code=403, detail="User cannot like own movies")
    db_like = db.query(Like).filter(Like.movie_id == movie_id, Like.user_id == like.user_id).first()
    if db_like is not None:
        raise HTTPException(status_code=403, detail="User already likes the movie")
    hate = db.query(Hate).filter(Hate.movie_id == movie_id, Hate.user_id == like.user_id).first()
    if hate is not None:
        # Remove hate
        db.delete(hate)
        db.commit()
    db_like = Like(**like.dict(), movie_id=movie_id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

def add_movie_hate(db: Session, movie_id: int, hate=HateCreate):
    movie = db.query(Movie).filter(Movie.id == movie_id,).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    if movie.user_id == hate.user_id:
        raise HTTPException(status_code=403, detail="User cannot hate own movies")
    db_hate = db.query(Hate).filter(Hate.movie_id == movie_id, Hate.user_id == hate.user_id).first()
    if db_hate is not None:
        raise HTTPException(status_code=403, detail="User already hates the movie")
    like = db.query(Like).filter(Like.movie_id == movie_id, Like.user_id == hate.user_id).first()
    if like is not None:
        # Remove hate
        db.delete(like)
        db.commit()
    db_hate = Hate(**hate.dict(), movie_id=movie_id)
    db.add(db_hate)
    db.commit()
    db.refresh(db_hate)
    return db_hate

def delete_movie_like(db: Session, movie_id: int, like_delete=LikeDelete):
    db_like = db.query(Like).filter(Like.movie_id == movie_id, Like.user_id == like_delete.user_id).first()
    if db_like is None:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(db_like)
    db.commit()
    return

def delete_movie_hate(db: Session, movie_id: int, hate_delete=HateDelete):
    db_hate = db.query(Hate).filter(Hate.movie_id == movie_id, Like.user_id == hate_delete.user_id).first()
    if db_hate is None:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(db_hate)
    db.commit()
    return


def get_movies_for_user(db: Session, user_id: int):
    return db.query(Movie).filter(Movie.user_id == user_id).all()


def get_all_movies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Movie).all()


def create_movie(db: Session, movie: MovieCreate):
    db_movie = Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie
