from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .Config import Config

from .routes import auth, users, movies
from .models.user import Base as UserBase
from .models.movie import Base as MovieBase
from .models.vote import Base as VoteBase
from .database.database import engine


# Bind models to the database engine to create tables
UserBase.metadata.create_all(bind=engine)
MovieBase.metadata.create_all(bind=engine)
VoteBase.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers to the app
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(movies.router)

@app.get("/")
async def root():
    return "{}:{}".format(Config.NAME, Config.VERSION)
