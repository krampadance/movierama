from xmlrpc.client import Boolean
from sqlalchemy import Column, ForeignKey, Integer, Boolean
from ..database.database import Base


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
    is_like = Column(Boolean)
