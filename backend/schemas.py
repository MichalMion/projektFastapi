from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# uzytkiownik

# podstawowy model uzytkownika
class UserBase(BaseModel):
    username: str
    email: EmailStr

# schemat do tworzenia uzytkownika(z haslem)
class UserCreate(UserBase):
    password: str

# schemat uzytkownika
class UserOut(UserBase):
    id: int
    is_admin: bool
    class Config:
        from_attributes = True

# schemat tokenu po logowaniu
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# filmy

# podstawowy model filmu
class MovieBase(BaseModel):
    title: str
    description: Optional[str] = None
    release_year: Optional[int] = None
    poster_url: Optional[str] = None
    genre: Optional[str] = None

# schemat do tworzenia filmu
class MovieCreate(MovieBase):
    pass

# schemat zwracany z API
class MovieOut(MovieBase):
    id: int
    average_rating: Optional[float] = None
    reviews: List[ReviewOut] = []
    class Config:
        from_attributes = True

# recenzje

# podstawowy model recenzji
class ReviewBase(BaseModel):
    rating: float = Field(..., ge=1, le=10)
    content: str

# schemat do tworzenia recenzji
class ReviewCreate(ReviewBase):
    movie_id: int

# schemat do aktualizacji recenzji
class ReviewUpdate(ReviewBase):
    pass

# schemat zwracany z API
class ReviewOut(ReviewBase):
    id: int
    user_id: int
    movie_id: int
    username: str
    created_at: datetime
    movie_title: Optional[str] = None
    class Config:
        from_attributes = True

# zgloszenia

# podstawowy model zgloszenia
class ReportBase(BaseModel):
    reason: str

# schemat do tworzenia zgloszenia
class ReportCreate(ReportBase):
    review_id: int

# schemat do aktualizacji zgloszenia(status)
class ReportUpdate(BaseModel):
    status: str  # pending, approved, rejected

# schemat zwracany z API
class ReportOut(ReportBase):
    id: int
    review_id: int
    reporter_id: int
    reporter_username: str
    review_content: str
    review_author: str
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    class Config:
        from_attributes = True
