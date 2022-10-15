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
    response = client.post("/auth/login", data=data)
    assert response.status_code == 200
    return response.json()
    

def test_get_all_movies_empty(client):
    response = client.get("/movies")
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
    data = {
        "title": "Test Movie 1",
        "description": "Test Movie 1 description"
    }
    response = client.post("/movies/", json.dumps(data))
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["id"] == 1
    assert response_data["title"] == "Test Movie 1"
    assert response_data["description"] == "Test Movie 1 description"
    assert response_data["user_id"] == payload["user_id"]
    assert response_data["owner"]["id"] == payload["user_id"]
    assert response_data["likes_count"] == 0
    assert response_data["hates_count"] == 0

def test_get_all_movies(client):
    response = client.get("/movies")
    assert response.status_code == 200
    response_data = response.json()
    
    assert len(response_data) == 1
    assert response_data[0]["title"] == "Test Movie 1"


def test_movie_cannot_like_own(client):
    token = login(client, "user@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/like")
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot like own movies"

def test_movie_cannot_hate_own(client):
    token = login(client, "user@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/hate")
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot hate own movies"

def test_movie_hate(client):
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/hate")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
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
    response = client.post("/movies/1/like")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

def test_movie_like(client):
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.post("/movies/1/like")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
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
    response = client.post("/movies/1/hate")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 1

def test_delete_hate_non_existent(client):
    """ When a user tries to delete a hate that does not exist """
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.delete("/movies/1/hate")
    assert response.status_code == 404
    assert response.json()["detail"] == "Hate not found"

    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 1

def test_delete_hate(client):
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.delete("/movies/1/hate")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

def test_delete_like_non_existent(client):
    """ When a user tries to delete a hate that does not exist """
    token = login(client, "user2@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.delete("/movies/1/like")
    assert response.status_code == 404
    assert response.json()["detail"] == "Like not found"

    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

def test_delete_like(client):
    token = login(client, "user1@test.com", "testing")
    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.delete("/movies/1/like")
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 0
    assert response.json()["hates_count"] == 0

