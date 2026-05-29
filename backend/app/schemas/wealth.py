from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

# --- PROFILE SCHEMAS ---
class ProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    pan_number: Optional[str] = None
    dob: Optional[date] = None
    mobile_number: Optional[str] = None
    
    # dependents
    spouse_name: Optional[str] = None
    spouse_dob: Optional[date] = None
    spouse_pan: Optional[str] = None
    children_count: int = 0

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    
    class Config:
        from_attributes = True

# --- SALARY SCHEMAS ---
class SalaryBase(BaseModel):
    person_type: str = Field(description="Must be 'self' or 'spouse'")
    basic_salary: float = 0.0
    employee_pf: float = 0.0
    employer_pf: float = 0.0
    opted_vpf: bool = False
    vpf_amount: float = 0.0
    opted_nps: bool = False
    variable_pay: float = 0.0
    ctc: float = 0.0

class SalaryCreate(SalaryBase):
    pass

class SalaryResponse(SalaryBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True

# --- INVESTMENT SCHEMAS ---
class InvestmentBase(BaseModel):
    type: str = Field(description="Must be 'mutual_fund' or 'equity'")
    asset_name: str
    units: Optional[float] = None
    investment_value: float = 0.0
    current_value: float = 0.0
    folio_number: Optional[str] = None
    investor_name: Optional[str] = None
    sip_amount: float = 0.0
    investment_date: Optional[date] = None

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True

# --- INSURANCE SCHEMAS ---
class InsuranceBase(BaseModel):
    policy_name: str
    policy_type: Optional[str] = None
    premium_pa: float = 0.0
    premium_paying_term: Optional[int] = None
    start_date: Optional[date] = None
    maturity_date: Optional[date] = None
    life_cover: float = 0.0
    surrender_value: float = 0.0
    maturity_value: float = 0.0
    riders: Optional[str] = None
    nominee: Optional[str] = None

class InsuranceCreate(InsuranceBase):
    pass

class InsuranceResponse(InsuranceBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True

# --- CREDIT CARD SCHEMAS ---
class CreditCardBase(BaseModel):
    card_name: str

class CreditCardCreate(CreditCardBase):
    pass

class CreditCardResponse(CreditCardBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True

# --- NET WORTH SCHEMAS ---
class NetWorthBase(BaseModel):
    residential_property: float = 0.0
    vehicle: float = 0.0
    jewellery: float = 0.0
    inheritance_expected: float = 0.0
    liquid_savings: float = 0.0
    fixed_deposits: float = 0.0
    recurring_deposits: float = 0.0
    receivables: float = 0.0
    ppf: float = 0.0
    sukanya_samridhi: float = 0.0
    sovereign_gold: float = 0.0
    real_estate_investments: float = 0.0
    crypto: float = 0.0
    
    home_loan: float = 0.0
    vehicle_loan: float = 0.0
    personal_loan: float = 0.0
    other_loans: float = 0.0

class NetWorthCreate(NetWorthBase):
    pass

class NetWorthResponse(NetWorthBase):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True
