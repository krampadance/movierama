from ..routes.dependencies import get_db
from ..database.database import engine
from ..models.vote import Base as VoteBase
from ..models.movie import Base as MovieBase
from ..models.user import Base as UserBase
from ..routes import auth, users, movies
from typing import Any
from typing import Generator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

import sys
import os
# this is to include backend dir in sys.path so that we can import from db,main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def start_application():
    app = FastAPI()
    # Add routers to the app
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(movies.router)
    return app


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost:5432/movieramatest"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
if not database_exists(engine.url):
    create_database(engine.url)
SessionTesting = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def app() -> Generator[FastAPI, Any, None]:
    """
    Create a fresh database on each test case.
    """
    UserBase.metadata.create_all(bind=engine)
    MovieBase.metadata.create_all(bind=engine)
    VoteBase.metadata.create_all(bind=engine)
    _app = start_application()
    yield _app
    UserBase.metadata.drop_all(bind=engine)
    MovieBase.metadata.drop_all(bind=engine)
    VoteBase.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def db_session(app: FastAPI) -> Generator[SessionTesting, Any, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionTesting(bind=connection)
    yield session  # use the session in tests.
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="session")
def client(
    app: FastAPI, db_session: SessionTesting
) -> Generator[TestClient, Any, None]:
    """
    Create a new FastAPI TestClient that uses the `db_session` fixture to override
    the `get_db` dependency that is injected into routes.
    """
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as client:
        yield client
