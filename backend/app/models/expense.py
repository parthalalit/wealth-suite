from sqlalchemy import Column, String, ForeignKey, Numeric, Date, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class FinancialAccount(Base):
    __tablename__ = "financial_accounts"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    account_name = Column(String, nullable=False) # e.g. HDFC Savings, ICICI Card
    account_type = Column(String, nullable=False) # bank, cash, credit_card, wallet
    balance = Column(Numeric(15, 2), default=0.00)
    currency = Column(String, default="INR")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("financial_accounts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    amount = Column(Numeric(15, 2), nullable=False)
    type = Column(String, nullable=False) # income, expense, transfer
    category = Column(String, nullable=False) # Food, Travel, Rent, Salary
    description = Column(String, nullable=True)
    
    transaction_date = Column(Date, server_default=func.current_date(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
