from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud.user import create_user, get_user_by_email
from ..schemas.user import User, UserCreate
from ..utils import get_db

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/login")
async def login():
    return "login"


@router.post("/logout")
async def logout():
    return "logout"


@router.post("/signup", response_model=User)
def sign_up(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

def test_get_user_no_movies(client):
    response = client.get("/users/1/movies")
    assert response.status_code == 400
    assert response.json()["detail"] == "User does not exist"
