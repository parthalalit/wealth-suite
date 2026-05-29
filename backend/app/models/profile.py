from sqlalchemy import Column, String, Date, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.db import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary key=True, index=True) # Matches secure Supabase User UUID
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    pan_number = Column(String, nullable=True)
    dob = Column(Date, nullable=True)
    mobile_number = Column(String, nullable=True)
    
    # Dependent/Spouse Details
    spouse_name = Column(String, nullable=True)
    spouse_dob = Column(Date, nullable=True)
    spouse_pan = Column(String, nullable=True)
    children_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
