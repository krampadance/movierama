from pydantic import BaseModel

class HateDelete(BaseModel):
    user_id: int

class HateBase(BaseModel):
    user_id: int


class HateCreate(HateBase):
    pass


class Hate(HateBase):
    id: int
    movie_id: int

    class Config:
        orm_mode = True  # This configuration makes it possible to access keys with x.y notation
