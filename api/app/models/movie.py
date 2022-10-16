from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
import sqlalchemy as sa
from sqlalchemy_utils import aggregated
from sqlalchemy.orm import relationship
import datetime

from ..database.database import Base

from .vote import Vote


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(String)
    owner = relationship("User", back_populates="movies")
    created_at = Column(DateTime(timezone=False), default=datetime.datetime.utcnow())

    # Calculating aggregate count value of related models and save them to parent model
    @aggregated('likes', Column(Integer, default=0))
    def likes_count(self):
        return sa.func.count(Vote.id).filter(Vote.is_like == True)

    @aggregated('hates', Column(Integer, default=0))
    def hates_count(self):
        return sa.func.count(Vote.id).filter(Vote.is_like == False)

    likes = relationship(
        'Vote',
        backref='likes'
    )

    hates = relationship(
        'Vote',
        backref='hates',
        viewonly=True
    )