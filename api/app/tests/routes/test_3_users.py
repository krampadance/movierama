import json


def test_get_no_user_no_movies(client):
    response = client.get("/users/10/movies")
    assert response.status_code == 400
    assert response.json()["detail"] == "User does not exist"

def test_get_user_no_movies(client):
    response = client.get("/users/3/movies")
    assert response.status_code == 200
    assert response.json() == []

def test_get_user_movies(client):
    response = client.get("/users/1/movies")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 1

    assert response_data[0]["id"] == 1
    assert response_data[0]["title"] == "Test Movie 1"
    assert response_data[0]["description"] == "Test Movie 1 description"
    assert response_data[0]["user_id"] == 1
    assert response_data[0]["owner"]["id"] == 1
    assert response_data[0]["likes_count"] == 0
    assert response_data[0]["hates_count"] == 0

