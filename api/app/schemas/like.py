from pydantic import BaseModel


class Like(BaseModel):
    id: int
    movie_id: int
    user_id: int

    class Config:
        orm_mode = True
