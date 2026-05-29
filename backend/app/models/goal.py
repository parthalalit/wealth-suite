from sqlalchemy import Column, String, ForeignKey, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    goal_name = Column(String, nullable=False) # e.g. Retirement, Kids Education
    target_amount = Column(Numeric(15, 2), nullable=False)
    current_savings = Column(Numeric(15, 2), default=0.00)
    target_date = Column(Date, nullable=False)
    monthly_contribution = Column(Numeric(15, 2), default=0.00)
