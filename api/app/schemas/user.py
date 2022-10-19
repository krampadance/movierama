from typing import List

from pydantic import BaseModel

from .vote import Vote


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str


class User(UserBase):
    id: int
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class UserVotes(User):
    votes: List[Vote] = []


class UserData(User):
    liked_movies: List[int] = []
    hated_movies: List[int] = []
