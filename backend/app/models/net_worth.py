from sqlalchemy import String, Column, ForeignKey, Numeric, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class NetWorthSnapshot(Base):
    __tablename__ = "net_worth_snapshots"

    id = Column(String, primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # Personal Assets
    residential_property = Column(Numeric(15, 2), default=0.00)
    vehicle = Column(Numeric(15, 2), default=0.00)
    jewellery = Column(Numeric(15, 2), default=0.00)
    inheritance_expected = Column(Numeric(15, 2), default=0.00)
    
    # Liquid Assets
    liquid_savings = Column(Numeric(15, 2), default=0.00)
    fixed_deposits = Column(Numeric(15, 2), default=0.00)
    recurring_deposits = Column(Numeric(15, 2), default=0.00)
    receivables = Column(Numeric(15, 2), default=0.00)
    
    # Long Term / Others
    ppf = Column(Numeric(15, 2), default=0.00)
    colors = Column(Numeric(15, 2), default=0.00) # placeholder / extra assets
    sukanya_samridhi = Column(Numeric(15, 2), default=0.00)
    sovereign_gold = Column(Numeric(15, 2), default=0.00)
    real_estate_investments = Column(Numeric(15, 2), default=0.00)
    crypto = Column(Numeric(15, 2), default=0.00)
    
    # Liabilities
    home_loan = Column(Numeric(15, 2), default=0.00)
    vehicle_loan = Column(Numeric(15, 2), default=0.00)
    personal_loan = Column(Numeric(15, 2), default=0.00)
    other_loans = Column(Numeric(15, 2), default=0.00)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
