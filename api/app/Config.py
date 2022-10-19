import os


class Config(object):
    # App related variables
    NAME = "movierama"
    VERSION = "0.1.0-alpha.0"

    # Postgres related variables
    POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "root")
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)

    DATABASE = os.getenv("DATABASE", "movierama")

    # JWT Related variables
    SECRET_KEY = os.getenv("SECRET_KEY", "THISISASECRETKEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE", 100)
