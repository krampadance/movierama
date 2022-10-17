import json
from jose import jwt
from Config import Config

def login(client, username, password):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": username,
        "password": password
    }
    response = client.post("/auth/login/", data=data)
    assert response.status_code == 200
    return response.json()

def test_get_no_user_no_movies(client):
    response = client.get("/users/10/movies/")
    assert response.status_code == 200
    assert response.json() ==  []

def test_get_user_no_movies(client):
    response = client.get("/users/3/movies/")
    assert response.status_code == 200
    assert response.json() == []

def test_get_user_movies(client):
    response = client.get("/users/1/movies/")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 10

def test_get_current_user_data(client):
    # Login
    token = login(client, "user@test.com", "testing")
    payload = jwt.decode(token["access_token"], Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])

    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.get("/users/me/")
    assert response.status_code == 200
    result = response.json()
    assert result["email"] == "user@test.com"
    assert result["first_name"] == "test"
    assert result["last_name"] == "user"

    assert result["liked_movies"] == []
    assert result["hated_movies"] == []

def test_get_current_user_data(client):
    # Login
    token = login(client, "user@test.com", "testing")
    payload = jwt.decode(token["access_token"], Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])

    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.get("/users/me/")
    assert response.status_code == 200
    result = response.json()
    assert result["email"] == "user@test.com"
    assert result["first_name"] == "test"
    assert result["last_name"] == "user"

    assert result["liked_movies"] == []
    assert result["hated_movies"] == []

def test_get_current_user_data_for_user_with_votes(client):
    # Login
    token = login(client, "user1@test.com", "testing")
    payload = jwt.decode(token["access_token"], Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])

    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.get("/users/me/")
    assert response.status_code == 200
    result = response.json()
    assert result["email"] == "user1@test.com"
    assert result["first_name"] == "test1"
    assert result["last_name"] == "user1"

    assert 1 in result["liked_movies"]
    assert 2 in result["liked_movies"]
    assert 3 not in result["liked_movies"]
    assert 4 not in result["liked_movies"]
    assert 3 in result["hated_movies"]
    assert 4 in result["hated_movies"]
    assert 1 not in result["hated_movies"]
    assert 2 not in result["hated_movies"]

    token = login(client, "user2@test.com", "testing")
    payload = jwt.decode(token["access_token"], Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])

    client.headers = {
        "content-type": "application/json",
        "Authorization": "{} {}".format(token["token_type"] , token["access_token"]),
    }
    response = client.get("/users/me/")
    assert response.status_code == 200
    result = response.json()
    assert result["email"] == "user2@test.com"
    assert result["first_name"] == "test2"
    assert result["last_name"] == "user2"

    assert 1 in result["liked_movies"]
    assert 4 in result["liked_movies"]
    assert 3 not in result["liked_movies"]
    assert 2 not in result["liked_movies"]
    assert 3 in result["hated_movies"]
    assert 2 in result["hated_movies"]
    assert 1 not in result["hated_movies"]
    assert 4 not in result["hated_movies"]
