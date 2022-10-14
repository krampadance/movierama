from pydantic import BaseModel

class LikeDelete(BaseModel):
    user_id: int

class LikeBase(BaseModel):
    user_id: int


class LikeCreate(LikeBase):
    pass


class Like(LikeBase):
    id: int
    movie_id: int

    class Config:
        orm_mode = True
