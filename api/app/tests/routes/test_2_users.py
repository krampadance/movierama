import json


def test_get_user_no_movies(client):
    response = client.get("/users/0/movies")
    assert response.status_code == 400
    assert response.json()["detail"] == "User does not exist"

def test_post_user_movie(client):
    data = {
        "title": "A movie test",
        "description": "A movie test description"
    }
    response = client.post("/users/1/movie", json.dumps(data))
    assert response.status_code == 200
    assert response.json()["id"] == 1

    data = {
        "title": "A movie test 2",
        "description": "A movie test description 2"
    }
    response = client.post("/users/1/movie", json.dumps(data))
    assert response.status_code == 200
    assert response.json()["id"] == 2

