# API

It is a python FastAPI microservice that connects to postgresql.

# Development
In order to develop you could:

Create a python virtual environment,
`python3 -m venv venv`

Activate it,
`source venv/bin/activate`

Install the requirements,
`pip3 install -r requirements.txt`

Start postgres in movierama directory
`docker-compose up -postgres`

Run,
`uvicorn app.main:app --reload`

# Build
In order to build, you can use the Dockerfile found in the api folder.

`docker build -t tag_name .`

## 
# Manual testing
You can use the insomnia export that you can find in the documentation folder. Or you can connect to the [openapi](http://localhost:8000/docs)

You can also run,
`pytest`
in api directory to run the tests

# Project structure
## routes/
This folder keeps the different files for the routes of the microservice. Its route has its own file. We also have the dependencies.py file that includes functions that are injected as dependencies in the endpoints

## crud/
A collection of the crud operations for each route.

## models/
The database models for the sqlalchemy.

## schemas/
The data structures that correspond to the database models and other models.


