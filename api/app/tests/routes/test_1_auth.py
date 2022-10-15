import json
from  schemas.user import User
from jose import jwt
from Config import Config

def test_signup(client):
    data = {
        "first_name": "test", 
        "last_name": "user", 
        "email": "user@test.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "user@test.com"
    assert res.id == 1
    assert res.first_name == "test"
    assert res.last_name == "user"

    data = {
        "first_name": "test1", 
        "last_name": "user1", 
        "email": "user1@test.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "user1@test.com"
    assert res.id == 2
    assert res.first_name == "test1"
    assert res.last_name == "user1"

    data = {
        "first_name":"test2", 
        "last_name": "user2", 
        "email":"user2@test.com",
        "password":"testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "user2@test.com"
    assert res.id == 3
    assert res.first_name == "test2"
    assert res.last_name == "user2"

def test_signup_existing(client):
    data = {
        "first_name": "test", 
        "last_name": "user", 
        "email": "user@test.com",
        "password": "testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "user@test.com",
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
    assert payload["sub"] == "user@test.com"
    assert payload["name"] == "test user"
    assert payload["user_id"] == 1

def test_login_wrong_password(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "user@test.com",
        "password": "wrong"
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_login_wrong_username(client):
    client.headers["content-type"] = "application/x-www-form-urlencoded"
    data = { 
        "username": "wronguser@test.com",
        "password": "password"
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"
    