from sqlalchemy import Column, String, ForeignKey, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class SalaryBreakdown(Base):
    __tablename__ = "salary_breakdowns"

    id = Column(String, primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    person_type = Column(String, nullable=False) # 'self' or 'spouse'
    
    basic_salary = Column(Numeric(15, 2), default=0.00)
    employee_pf = Column(Numeric(15, 2), default=0.00)
    employer_pf = Column(Numeric(15, 2), default=0.00)
    
    opted_vpf = Column(Boolean, default=False)
    vpf_amount = Column(Numeric(15, 2), default=0.00)
    
    opted_nps = Column(Boolean, default=False)
    variable_pay = Column(Numeric(15, 2), default=0.00)
    ctc = Column(Numeric(15, 2), default=0.00)
