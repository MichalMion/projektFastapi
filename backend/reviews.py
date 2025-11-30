
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.models import Review, Movie, User
from backend.schemas import ReviewCreate, ReviewOut, ReviewUpdate
from backend.auth import get_current_user
from typing import List

# stworzenie routera dla endpointow z recenzjami
router = APIRouter(prefix="/reviews", tags=["reviews"])

# funkcja pomocnicza do pobierania bazy danych
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# tworzenie recenzji
@router.post("/", response_model=ReviewOut)
def create_review(review: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # czy juz jest recenzja
    existing = db.query(Review).filter(Review.user_id == current_user.id, Review.movie_id == review.movie_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this movie")
    db_review = Review(user_id=current_user.id, movie_id=review.movie_id, rating=review.rating, content=review.content)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

# pobranie recenzji
@router.get("/my", response_model=List[ReviewOut])
def get_my_reviews(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    return reviews

# aktualizacja recenzji
@router.put("/{review_id}", response_model=ReviewOut)
def update_review(review_id: int, review: ReviewUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # czy istnieje
    db_review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    db_review.rating = review.rating
    db_review.content = review.content
    db.commit()
    db.refresh(db_review)
    return db_review

# usuwanie recenzji
@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # czy istnieje
    db_review = db.query(Review).filter(Review.id == review_id, Review.user_id == current_user.id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    # usuniecie
    db.delete(db_review)
    db.commit()
    return
