from pydantic import BaseModel

class VoteCreate(BaseModel):
    likes: bool

class Vote(BaseModel):
    id: int
    movie_id: int
    user_id: int
    is_like: bool

    class Config:
        orm_mode = True
