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
`docker-compose up`

Run,
`uvicorn app.main:app --reload`

# Build
In order to build, you can use the Dockerfile found in the api folder.

`docker build -t tag_name .`

# Manual testing
You can use the insomnia export that you can find in the documentation folder.

# Project structure
## routes/
This folder keeps the different files for the routes of the microservice. Its route has its own file.

## crud/
A collection of the crud operations for each route.

## models/
The database models for the sqlalchemy.

## schemas/
The data structures that correspond to the database models


