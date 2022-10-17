import json
from jose import jwt
from Config import Config

token = None

def login(client, username, password):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": username,
        "password": password
    }
    response = client.post("/auth/login/", data=data)
    assert response.status_code == 200
    return response.json()
    

def test_get_all_movies_empty(client):
    response = client.get("/movies/")
    assert response.status_code == 200
    assert response.json() == []

def test_add_movie(client):
    # Login
    token = login(client, "user@test.com", "testing")
    payload = jwt.decode(token["access_token"], Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])

    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    data = [{
        "title": "Test Movie {}".format(i),
        "description": "Test Movie {} description".format(i)
    } for i in range(0, 10)]

    for movie in data:
        response = client.post("/movies/", json.dumps(movie))
        assert response.status_code == 200
        response_data = response.json()
        assert "id" in response_data
        assert response_data["title"] == movie["title"]
        assert response_data["description"] == movie["description"]
        assert response_data["user_id"] == payload["user_id"]
        assert response_data["owner"]["id"] == payload["user_id"]
        assert response_data["likes_count"] == 0
        assert response_data["hates_count"] == 0


def test_get_all_movies(client):
    response = client.get("/movies/")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 10


def test_movie_cannot_vote_own(client):
    token = login(client, "user@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }

    # Like own movie
    response = client.post("/movies/1/vote/", json.dumps({"likes": True}))
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot vote own movies"

    # Hate own movie
    response = client.post("/movies/1/vote/", json.dumps({"likes": False}))
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot vote own movies"
    

def test_movie_hate(client):
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": False}))
    assert response.status_code == 200
    
    response = client.get("/movies/1/")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 0
    assert response.json()["hates_count"] == 1

def test_movie_like_when_already_hated(client):
    """When a user likes a movie he hates then the hate is deleted and replaced by a like"""
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": True}))
    assert response.status_code == 200
    
    response = client.get("/movies/1/")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

def test_movie_like(client):
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": True}))
    assert response.status_code == 200
    
    response = client.get("/movies/1/")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 2
    assert response.json()["hates_count"] == 0

def test_movie_hate_when_already_liked(client):
    """When a user likes a hates he likes then the like is deleted and replaced by a hate"""
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": False}))
    assert response.status_code == 200
    
    response = client.get("/movies/1/")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 1


def test_unhate(client):
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": False}))
    assert response.status_code == 200
    
    response = client.get("/movies/1/")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

def test_unlike(client):
    # When user votes for a like, but it already exists
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/vote/", json.dumps({"likes": True}))
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 0
    assert response.json()["hates_count"] == 0


def test_get_all_movies_order_by(client):  #TODO: Add tests for created_at and for user movies endpoint
    # Like and hate movies
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }

    data = [(1, True), (2, True), (3, False), (4, False)]
    
    for movie, like in data:
        response = client.post("/movies/{}/vote/".format(movie), json.dumps({"likes": like}))
        assert response.status_code == 200

     # Like and hate movies
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }

    data = [(1, True), (2, False), (3, False), (4, True)]
    for movie, like in data:
        response = client.post("/movies/{}/vote/".format(movie), json.dumps({"likes": like}))
        assert response.status_code == 200
    
    # Check likes_count desc
    response = client.get("/movies/?order_by=likes_count&direction=desc")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 10
    assert response_data[0]["likes_count"] == 2
    assert response_data[1]["likes_count"] == 1
    assert response_data[2]["likes_count"] == 1
    assert response_data[3]["likes_count"] == 0

    # Check hates_count desc
    response = client.get("/movies/?order_by=hates_count&direction=desc")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 10
    assert response_data[0]["hates_count"] == 2
    assert response_data[1]["hates_count"] == 1
    assert response_data[2]["hates_count"] == 1
    assert response_data[3]["hates_count"] == 0

    # Check likes_count asc with skip and limit
    response = client.get("/movies/?order_by=likes_count&direction=asc&skip=8&limit=2")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 2
    assert response_data[0]["likes_count"] == 1
    assert response_data[1]["likes_count"] == 2
    assert response_data[1]["id"] == 1

    # Check hates_count asc with skip and limit
    response = client.get("/movies/?order_by=hates_count&direction=asc&skip=8&limit=2")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 2
    assert response_data[0]["hates_count"] == 1
    assert response_data[1]["hates_count"] == 2
    assert response_data[1]["id"] == 3


    