from pydantic import BaseModel

class VoteCreate(BaseModel):
    likes: bool  # TODO: it makes more sense to make it into type ("like", or "hate")

class Vote(BaseModel):
    id: int
    movie_id: int
    user_id: int
    is_like: bool

    class Config:
        orm_mode = True
