from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..crud.user import get_user_movies, get_current_user
from ..schemas.movie import Movie
from ..schemas.user import UserData
from .dependencies import oauth2_scheme, get_db
from typing import Union

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/{user_id}/movies/", response_model=list[Movie])
def get_movies(user_id: int, skip: Union[int, None] = 0, limit: Union[int, None] = 1000, order_by: Union[str, None] = None, direction: Union[str, None] = None, db: Session = Depends(get_db)):
    return get_user_movies(db=db, user_id=user_id, skip=skip, limit=limit, order_by=order_by, direction=direction)


@router.get("/me/", response_model=UserData)
def get_own_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user(db, token)
