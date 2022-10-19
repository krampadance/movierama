from pydantic import BaseModel


class VoteCreate(BaseModel):
    # TODO: it makes more sense to make it into type ("like", or "hate")
    likes: bool


class Vote(BaseModel):
    id: int
    movie_id: int
    user_id: int
    is_like: bool

    class Config:
        orm_mode = True
