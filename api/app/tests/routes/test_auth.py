import json
from  schemas.user import User


def test_signup(client):
    data = {
        "first_name":"test", 
        "last_name": "user", 
        "email":"testuser@nofoobar.com",
        "password":"testing"}
    response = client.post("/auth/signup",json.dumps(data))
    assert response.status_code == 200
    res = User(**response.json())
    assert res.email == "testuser@nofoobar.com"
    assert res.id > 0
    assert res.first_name == "test"
    assert res.last_name == "user"


def test_signup_existing(client):
    data = {
        "first_name":"test", 
        "last_name": "user", 
        "email":"testuser@nofoobar.com",
        "password":"testing"}
    response = client.post("/auth/signup",json.dumps(data))
    assert response.status_code == 400
    response.json()["detail"] == "Email already registered"
