import json
import pytest
from  schemas.user import User

def test_signup(client):
    data = {
        "first_name":"test", 
        "last_name": "user", 
        "email":"testuser@nofoobar.com",
        "password":"testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "testuser@nofoobar.com"
    assert res.id == 1
    assert res.first_name == "test"
    assert res.last_name == "user"

    data = {
        "first_name":"test1", 
        "last_name": "user1", 
        "email":"testuser1@nofoobar.com",
        "password":"testing"}
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
        "first_name":"test", 
        "last_name": "user", 
        "email":"testuser@nofoobar.com",
        "password":"testing"}
    response = client.post("/auth/signup", json.dumps(data))
    assert response.status_code == 400
    response.json()["detail"] == "Email already registered"
