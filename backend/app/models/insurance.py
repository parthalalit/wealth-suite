from sqlalchemy import Column, String, ForeignKey, Numeric, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    policy_name = Column(String, nullable=False)
    policy_type = Column(String, nullable=True) # Term Plan, Health, Endowment, ULIP
    premium_pa = Column(Numeric(15, 2), default=0.00)
    premium_paying_term = Column(Integer, nullable=True) # PPT in years
    
    start_date = Column(Date, nullable=True)
    maturity_date = Column(Date, nullable=True)
    life_cover = Column(Numeric(15, 2), default=0.00)
    surrender_value = Column(Numeric(15, 2), default=0.00)
    maturity_value = Column(Numeric(15, 2), default=0.00)
    
    riders = Column(String, nullable=True)
    nominee = Column(String, nullable=True)
