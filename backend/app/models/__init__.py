from app.core.db import Base
from app.models.profile import Profile
from app.models.salary import SalaryBreakdown
from app.models.investment import Investment
from app.models.insurance import InsurancePolicy
from app.models.credit_card import CreditCard
from app.models.net_worth import NetWorthSnapshot
from app.models.expense import FinancialAccount, Transaction
from app.models.goal import FinancialGoal

# Expose Base and all models cleanly
__all__ = [
    "Base",
    "Profile",
    "SalaryBreakdown",
    "Investment",
    "InsurancePolicy",
    "CreditCard",
    "NetWorthSnapshot",
    "FinancialAccount",
    "Transaction",
    "FinancialGoal",
]
