from sqlite3 import Timestamp
from pydantic import BaseModel
from typing import Optional


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
