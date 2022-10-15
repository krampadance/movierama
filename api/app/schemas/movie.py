import datetime
from datetime import timezone, datetime
from pydantic import BaseModel
from typing import Optional

from .user import User


class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None


class Movie(MovieBase):
    id: int
    user_id: int
    owner: User
    created_at: datetime
    likes_count: int
    hates_count: int

    class Config:
        orm_mode = True
        json_encoders = {
            # Encode datetime into a utc timestamp
            datetime: lambda d: int(d.replace(tzinfo=timezone.utc).timestamp() * 1000)
        }
