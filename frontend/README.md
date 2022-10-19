# Movierama web app
The frontend that connects to the movierama api.

# How to run
Run the docker compose in the movierama folder
`docker-compose up --build` to have the server and the database running.

and start the app using:
`yarn start`

Then you connect to `http://localhost:3000`

# Linting
`yarn lint`

and you can also use
`yarn lint:fix` to fix.


# Issues
* No private routes
* No validation on password, or rules for the password

# Environment variables
* REACT_APP_API_URL: the url of the api to connect to
* REACT_APP_QUERY_LIMIT: the query limit used for the pagination of the infinite scroller component


# Demo Video
You can watch a very small demo video [here](https://drive.google.com/file/d/1NStNdbzTrkxsv_p5bGnOr9iAd0cZMg79/view?usp=sharing)