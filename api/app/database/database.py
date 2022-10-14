from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..Config import Config

def get_postgres_url():
        return "postgresql://{}:{}@{}:{}/{}".format(
            Config.POSTGRES_USER, Config.POSTGRES_PASSWORD, Config.POSTGRES_HOST, Config.POSTGRES_PORT, Config.DATABASE)

engine = create_engine(get_postgres_url())
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# declarative_base() that returns a class. We inherit from this class to create each of the database models or classes
Base = declarative_base()
