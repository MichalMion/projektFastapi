
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.models import Movie, Review, User
from backend.schemas import MovieCreate, MovieOut, ReviewCreate, ReviewOut
from backend.auth import get_current_user
from typing import List, Optional

# stworzenie routera dla endpointow z filmami
router = APIRouter(prefix="/movies", tags=["movies"])

# funkcja pomocnicza do pobierania bazy danych
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# pobieranie listy filmow
@router.get("/", response_model=List[MovieOut])
def get_movies(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Movie)
    if search:
        query = query.filter(Movie.title.ilike(f"%{search}%"))
    movies = query.all()

    # srednia ocen
    for movie in movies:
        if movie.reviews:
            movie.average_rating = sum([r.rating for r in movie.reviews]) / len(movie.reviews)
        else:
            movie.average_rating = None
    return movies

# pobieranie jednego filmu
@router.get("/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # srednia ocen
    if movie.reviews:
        movie.average_rating = sum([r.rating for r in movie.reviews]) / len(movie.reviews)
    else:
        movie.average_rating = None
    return movie

# dodawanie filmu(admin)
@router.post("/", response_model=MovieOut)
def create_movie(movie: MovieCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admin can add movies")
    db_movie = Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

# aktualizacja filmu(admin)
@router.put("/{movie_id}", response_model=MovieOut)
def update_movie(movie_id: int, movie: MovieCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admin can update movies")
    # sprawdzenie czy film istnieje
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    for key, value in movie.dict().items():
        setattr(db_movie, key, value)
    db.commit()
    db.refresh(db_movie)
    return db_movie

# usuwanie filmu(admin)
@router.delete("/{movie_id}", status_code=204)
def delete_movie(movie_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admin can delete movies")
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(db_movie)
    db.commit()
    return
