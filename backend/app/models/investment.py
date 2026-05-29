from sqlalchemy import Column, String, ForeignKey, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class Investment(Base):
    __tablename__ = "investments"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False) # 'mutual_fund' or 'equity'
    
    asset_name = Column(String, nullable=False) # Fund Name or Script Name
    units = Column(Numeric(18, 4), nullable=True)
    investment_value = Column(Numeric(15, 2), default=0.00)
    current_value = Column(Numeric(15, 2), default=0.00)
    
    folio_number = Column(String, nullable=True)
    investor_name = Column(String, nullable=True)
    sip_amount = Column(Numeric(15, 2), default=0.00)
    investment_date = Column(Date, nullable=True)
