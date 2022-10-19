# Movierama
A social sharing platform where users can share their favorite movies.

# Repository Structure
The repo consists of the following structure:

## api folder
The folder where the code for the backend lies. 
The backend is a [fastAPI](https://fastapi.tiangolo.com) server that connects to postgresql using [SQLALchemy](https://www.sqlalchemy.org/).

## frontend folder
In the src file there are the different elements of the app.

* components, holds the code for the various components used
* pages, holds the files for the various pages of the app.
* redux, has everything related with the react-redux state
* services, has the calls to the api
* utils, includes several utility functions
