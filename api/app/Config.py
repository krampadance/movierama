import os


class Config(object):

    NAME = "movierama"
    VERSION = "0.0.1"
    PORT = os.getenv("PORT", 8000)

    POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "root")
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)

    DATABASE = os.getenv("DATABASE", "movierama")
