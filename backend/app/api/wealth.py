from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.core.security import get_current_user_id
from app.models import Profile, SalaryBreakdown, Investment, InsurancePolicy, CreditCard, NetWorthSnapshot
from app.schemas.wealth import (
    ProfileCreate, ProfileResponse,
    SalaryCreate, SalaryResponse,
    InvestmentCreate, InvestmentResponse,
    InsuranceCreate, InsuranceResponse,
    CreditCardCreate, CreditCardResponse,
    NetWorthCreate, NetWorthResponse
)

router = APIRouter(prefix="/api/wealth", tags=["Wealth Core Data Collection"])

# --- 1. PROFILE API ---
@router.get("/profile", response_model=ProfileResponse)
def get_profile(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if not profile:
        # Implicitly initialize empty profile for a newly signed-up user
        profile = Profile(id=user_id, full_name="Valued Customer", email="customer@wealth.com")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.post("/profile", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if not profile:
        profile = Profile(id=user_id, **profile_data.dict())
        db.add(profile)
    else:
        for k, v in profile_data.dict().items():
            setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile

# --- 2. SALARY BREAKDOWN API ---
@router.get("/salary", response_model=List[SalaryResponse])
def get_salary(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(SalaryBreakdown).filter(SalaryBreakdown.user_id == user_id).all()

@router.post("/salary", response_model=SalaryResponse)
def add_or_update_salary(
    salary_data: SalaryCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    # Ensure profile exists first
    get_profile(user_id, db)
    
    # Check if entry already exists for self/spouse
    existing = db.query(SalaryBreakdown).filter(
        SalaryBreakdown.user_id == user_id, 
        SalaryBreakdown.person_type == salary_data.person_type
    ).first()
    
    if existing:
        for k, v in salary_data.dict().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_salary = SalaryBreakdown(user_id=user_id, **salary_data.dict())
        db.add(new_salary)
        db.commit()
        db.refresh(new_salary)
        return new_salary

# --- 3. INVESTMENTS API ---
@router.get("/investments", response_model=List[InvestmentResponse])
def get_investments(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(Investment).filter(Investment.user_id == user_id).all()

@router.post("/investments", response_model=InvestmentResponse)
def add_investment(
    investment_data: InvestmentCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    get_profile(user_id, db)
    new_inv = Investment(user_id=user_id, **investment_data.dict())
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

# --- 4. INSURANCE API ---
@router.get("/insurance", response_model=List[InsuranceResponse])
def get_insurance(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(InsurancePolicy).filter(InsurancePolicy.user_id == user_id).all()

@router.post("/insurance", response_model=InsuranceResponse)
def add_insurance(
    policy_data: InsuranceCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    get_profile(user_id, db)
    new_policy = InsurancePolicy(user_id=user_id, **policy_data.dict())
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

# --- 5. CREDIT CARDS API ---
@router.get("/credit-cards", response_model=List[CreditCardResponse])
def get_credit_cards(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(CreditCard).filter(CreditCard.user_id == user_id).all()

@router.post("/credit-cards", response_model=CreditCardResponse)
def add_credit_card(
    card_data: CreditCardCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    get_profile(user_id, db)
    new_card = CreditCard(user_id=user_id, **card_data.dict())
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

# --- 6. NET WORTH SNAPSHOT API ---
@router.get("/net-worth", response_model=NetWorthResponse)
def get_net_worth(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    snapshot = db.query(NetWorthSnapshot).filter(NetWorthSnapshot.user_id == user_id).order_by(NetWorthSnapshot.created_at.desc()).first()
    if not snapshot:
        snapshot = NetWorthSnapshot(user_id=user_id)
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
    return snapshot

@router.post("/net-worth", response_model=NetWorthResponse)
def update_net_worth(
    nw_data: NetWorthCreate, 
    user_id: str = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    get_profile(user_id, db)
    snapshot = db.query(NetWorthSnapshot).filter(NetWorthSnapshot.user_id == user_id).order_by(NetWorthSnapshot.created_at.desc()).first()
    if not snapshot:
        snapshot = NetWorthSnapshot(user_id=user_id, **nw_data.dict())
        db.add(snapshot)
    else:
        for k, v in nw_data.dict().items():
            setattr(snapshot, k, v)
    db.commit()
    db.refresh(snapshot)
    return snapshot

@router.get("/net-worth/summary")
def get_net_worth_calculations(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Auto-aggregates all recorded assets and liabilities, calculates total liquid holdings,
    and returns a beautifully structured financial payload.
    """
    nw = get_net_worth(user_id, db)
    
    # Calculate Personal Assets Sum
    personal_assets = float(nw.residential_property + nw.vehicle + nw.jewellery + nw.inheritance_expected)
    
    # Calculate Liquid Assets Sum
    liquid_assets = float(nw.liquid_savings + nw.fixed_deposits + nw.recurring_deposits + nw.receivables)
    
    # Calculate Other assets
    other_assets = float(nw.ppf + nw.sukanya_samridhi + nw.sovereign_gold + nw.real_estate_investments + nw.crypto)
    
    # Sum up investments dynamically from the ledger
    investments = db.query(Investment).filter(Investment.user_id == user_id).all()
    total_mutual_funds = sum(float(inv.current_value) for inv in investments if inv.type == "mutual_fund")
    total_equities = sum(float(inv.current_value) for inv in investments if inv.type == "equity")
    
    # Calculate total gross assets
    total_assets = personal_assets + liquid_assets + other_assets + total_mutual_funds + total_equities
    
    # Calculate total outstanding liabilities
    total_liabilities = float(nw.home_loan + nw.vehicle_loan + nw.personal_loan + nw.other_loans)
    
    net_worth = total_assets - total_liabilities
    
    return {
        "summary": {
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "net_worth": net_worth
        },
        "allocation": {
            "personal_assets": personal_assets,
            "liquid_assets": liquid_assets,
            "mutual_funds": total_mutual_funds,
            "equities": total_equities,
            "long_term_instruments": other_assets
        },
        "liabilities_breakdown": {
            "home_loan": float(nw.home_loan),
            "vehicle_loan": float(nw.vehicle_loan),
            "personal_loan": float(nw.personal_loan),
            "other_loans": float(nw.other_loans)
        }
    }
