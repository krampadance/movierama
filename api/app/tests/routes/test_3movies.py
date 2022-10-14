import json


def test_movie_no_likes_hates(client):
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 0
    assert response.json()["hates_count"] == 0

def test_movie_cannot_like_own(client):
    data = {"user_id": 1}
    response = client.post("/movies/1/like", json.dumps(data))
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot like own movies"

def test_movie_cannot_hate_own(client):
    data = {"user_id": 1}
    response = client.post("/movies/1/hate", json.dumps(data))
    assert response.status_code == 403
    assert response.json()["detail"] == "User cannot hate own movies"

def test_movie_hate(client):
    data = {"user_id": 2}
    response = client.post("/movies/1/hate", json.dumps(data))
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 0
    assert response.json()["hates_count"] == 1

def test_movie_like_when_already_hated(client):
    data = {"user_id": 2}
    response = client.post("/movies/1/like", json.dumps(data))
    assert response.status_code == 200
    
    response = client.get("/movies/1")
    assert response.status_code == 200
    assert response.json()["likes_count"] == 1
    assert response.json()["hates_count"] == 0

