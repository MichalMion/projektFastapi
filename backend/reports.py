from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.models import Report, Review, User
from backend.schemas import ReportCreate, ReportOut, ReportUpdate
from backend.auth import get_current_user
from typing import List
import datetime

# stworzenie routera dla endpointow ze zgloszeniami
router = APIRouter(prefix="/reports", tags=["reports"])

# funkcja pomocnicza do pobierania bazy danych
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# czy uzytkownik to admin
def get_current_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# stworzenie zgloszenia
@router.post("/", response_model=ReportOut)
def create_report(report: ReportCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # czy istnieje
    review = db.query(Review).filter(Review.id == report.review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # czy juz zgloszona
    existing = db.query(Report).filter(
        Report.review_id == report.review_id,
        Report.reporter_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reported this review")
    
    # stworzenie zgloszenia
    db_report = Report(
        review_id=report.review_id,
        reporter_id=current_user.id,
        reason=report.reason
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

# pobranie zgloszen(admin)
@router.get("/", response_model=List[ReportOut])
def get_reports(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    # sortowanie
    reports = db.query(Report).filter(Report.status == "pending").order_by(Report.created_at.desc()).all()
    return reports

# aktualizacja zgloszenia(admin)
@router.put("/{report_id}")
def update_report(report_id: int, report_update: ReportUpdate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # aktualizacja
    db_report.status = report_update.status
    db_report.reviewed_by = current_user.id
    db_report.reviewed_at = datetime.datetime.utcnow()
    

    # zatwierdzenie/usuniecie zatwierdzonego
    if report_update.status == "approved":
        review = db.query(Review).filter(Review.id == db_report.review_id).first()
        if review:
            # pobranie wszystkich zgloszen zwiazanych z taka sama recenzja
            related_reports = db.query(Report).filter(Report.review_id == review.id).all()
            
            # usuniecie recenzji
            db.delete(review)
            
            # odlaczenie zgloszen (review_id = None) po usunieciu recenzji
            for report in related_reports:
                report.review_id = None
            
            db.commit()
            return {"message": "Report approved and review deleted", "status": "approved"}
        else:
            # Jeśli review już nie istnieje, tylko zaktualizuj status
            db.commit()
            return {"message": "Report approved but review already deleted", "status": "approved"}
    else:
        db.commit()
        return {"message": "Report rejected", "status": report_update.status}

