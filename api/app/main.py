from re import M
from fastapi import FastAPI
import uvicorn

from .routes import auth, users, movies
from .models.user import Base as UserBase
from .models.movie import Base as MovieBase
from .models.like import Base as LikeBase
from .models.hate import Base as HateBase
from .database.database import engine


# Bind models to the database engine to create tables
UserBase.metadata.create_all(bind=engine)
MovieBase.metadata.create_all(bind=engine)
LikeBase.metadata.create_all(bind=engine)
HateBase.metadata.create_all(bind=engine)

app = FastAPI()

# Add routers to the app
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(movies.router)

@app.get("/")
async def root():
    return "Movierama"
