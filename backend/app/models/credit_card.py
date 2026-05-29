from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(UUID(as_uuid=True), primary key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    card_name = Column(String, nullable=False) # e.g. HDFC BizFirst, ICICI MMT
