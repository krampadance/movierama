from pydantic import BaseModel


class Hate(BaseModel):
    id: int
    movie_id: int
    user_id: int

    class Config:
        orm_mode = True  # This configuration makes it possible to access keys with x.y notation
