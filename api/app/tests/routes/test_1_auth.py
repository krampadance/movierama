import json
from os import access
from  schemas.user import User
from jose import jwt
from Config import Config

def test_signup(client):
    data = {
        "first_name": "test", 
        "last_name": "user", 
        "email": "testuser@nofoobar.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "testuser@nofoobar.com"
    assert res.id == 1
    assert res.first_name == "test"
    assert res.last_name == "user"

    data = {
        "first_name": "test1", 
        "last_name": "user1", 
        "email": "testuser1@nofoobar.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "testuser1@nofoobar.com"
    assert res.id == 2
    assert res.first_name == "test1"
    assert res.last_name == "user1"

    data = {
        "first_name":"test3", 
        "last_name": "user3", 
        "email":"testuser3@nofoobar.com",
        "password":"testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "testuser3@nofoobar.com"
    assert res.id == 3
    assert res.first_name == "test3"
    assert res.last_name == "user3"

def test_signup_existing(client):
    data = {
        "first_name": "test", 
        "last_name": "user", 
        "email": "testuser@nofoobar.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "testuser@nofoobar.com",
        "password": "testing"
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    token = response.json()["access_token"]
    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
    assert "name" in payload
    assert "sub" in payload
    assert "user_id" in payload
    assert payload["sub"] == "testuser@nofoobar.com"
    assert payload["name"] == "test user"
    assert payload["user_id"] == 1

def test_login_wrong_password(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "testuser@nofoobar.com",
        "password": "wrong"
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_wrong_username(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "wrong@nofoobar.com",
        "password": "password"
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"
    