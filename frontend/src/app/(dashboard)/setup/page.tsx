"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import { apiRequest } from "@/lib/api";
import styles from "./SetupWizard.module.css";

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // --- Step Form State ---
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    pan_number: "",
    dob: "",
    mobile_number: "",
    spouse_name: "",
    spouse_dob: "",
    spouse_pan: "",
    children_count: 0
  });

  const [selfSalary, setSelfSalary] = useState({
    basic_salary: 0,
    employee_pf: 0,
    employer_pf: 0,
    opted_vpf: false,
    vpf_amount: 0,
    opted_nps: false,
    variable_pay: 0,
    ctc: 0
  });

  const [spouseSalary, setSpouseSalary] = useState({
    basic_salary: 0,
    employee_pf: 0,
    employer_pf: 0,
    opted_vpf: false,
    vpf_amount: 0,
    opted_nps: false,
    variable_pay: 0,
    ctc: 0
  });

  const [investments, setInvestments] = useState<any[]>([]);
  const [newInv, setNewInv] = useState({
    type: "mutual_fund",
    asset_name: "",
    investment_value: 0,
    current_value: 0,
    units: 0,
    folio_number: "",
    investor_name: "",
    sip_amount: 0
  });

  const [insurance, setInsurance] = useState<any[]>([]);
  const [newPolicy, setNewPolicy] = useState({
    policy_name: "",
    policy_type: "Term Plan",
    premium_pa: 0,
    premium_paying_term: 10,
    life_cover: 0,
    surrender_value: 0,
    maturity_value: 0,
    nominee: ""
  });

  const [creditCards, setCreditCards] = useState<any[]>([]);
  const [newCard, setNewCard] = useState({ card_name: "" });

  const [netWorth, setNetWorth] = useState({
    residential_property: 0,
    vehicle: 0,
    jewellery: 0,
    inheritance_expected: 0,
    liquid_savings: 0,
    fixed_deposits: 0,
    recurring_deposits: 0,
    receivables: 0,
    ppf: 0,
    sukanya_samridhi: 0,
    sovereign_gold: 0,
    real_estate_investments: 0,
    crypto: 0,
    home_loan: 0,
    vehicle_loan: 0,
    personal_loan: 0,
    other_loans: 0
  });

  // --- Fetch Baseline Data on Mount ---
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const p = await apiRequest("/api/wealth/profile");
        if (p) setProfile({ ...profile, ...p, dob: p.dob || "", spouse_dob: p.spouse_dob || "" });
        
        const salaries = await apiRequest("/api/wealth/salary");
        salaries.forEach((s: any) => {
          if (s.person_type === "self") setSelfSalary(s);
          if (s.person_type === "spouse") setSpouseSalary(s);
        });

        const invs = await apiRequest("/api/wealth/investments");
        if (invs) setInvestments(invs);

        const ins = await apiRequest("/api/wealth/insurance");
        if (ins) setInsurance(ins);

        const cc = await apiRequest("/api/wealth/credit-cards");
        if (cc) setCreditCards(cc);

        const nw = await apiRequest("/api/wealth/net-worth");
        if (nw) setNetWorth(nw);
      } catch (err) {
        console.error("Failed to load initial data profiles", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Handle Save Operations ---
  const saveStepData = async () => {
    try {
      setLoading(true);
      if (step === 1) {
        await apiRequest("/api/wealth/profile", {
          method: "POST",
          body: JSON.stringify(profile)
        });
      } else if (step === 2) {
        await apiRequest("/api/wealth/salary", {
          method: "POST",
          body: JSON.stringify({ ...selfSalary, person_type: "self" })
        });
        await apiRequest("/api/wealth/salary", {
          method: "POST",
          body: JSON.stringify({ ...spouseSalary, person_type: "spouse" })
        });
      } else if (step === 6) {
        await apiRequest("/api/wealth/net-worth", {
          method: "POST",
          body: JSON.stringify(netWorth)
        });
      }
      setSuccessMsg("Draft Auto-Saved Successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error saving data draft", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await saveStepData();
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // --- Helpers to Add Dynamic Array Items ---
  const addInvestmentItem = async () => {
    if (!newInv.asset_name) return;
    try {
      const added = await apiRequest("/api/wealth/investments", {
        method: "POST",
        body: JSON.stringify(newInv)
      });
      setInvestments([...investments, added]);
      setNewInv({
        type: "mutual_fund",
        asset_name: "",
        investment_value: 0,
        current_value: 0,
        units: 0,
        folio_number: "",
        investor_name: "",
        sip_amount: 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addInsuranceItem = async () => {
    if (!newPolicy.policy_name) return;
    try {
      const added = await apiRequest("/api/wealth/insurance", {
        method: "POST",
        body: JSON.stringify(newPolicy)
      });
      setInsurance([...insurance, added]);
      setNewPolicy({
        policy_name: "",
        policy_type: "Term Plan",
        premium_pa: 0,
        premium_paying_term: 10,
        life_cover: 0,
        surrender_value: 0,
        maturity_value: 0,
        nominee: ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addCreditCardItem = async () => {
    if (!newCard.card_name) return;
    try {
      const added = await apiRequest("/api/wealth/credit-cards", {
        method: "POST",
        body: JSON.stringify(newCard)
      });
      setCreditCards([...creditCards, added]);
      setNewCard({ card_name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <span className={styles.logoIcon}>💎</span>
          <h1 className={styles.title}>Wealth Suite</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Progress Tracker */}
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressHeader}>
          <span>Setup Progress</span>
          <span className={styles.stepBadge}>Step {step} of 6</span>
        </div>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {successMsg && <div className={styles.toastSuccess}>{successMsg}</div>}

      <main className={styles.card}>
        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Personal Details</h2>
            <p className={styles.sectionDesc}>Help us set up your financial profile credentials.</p>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profile.full_name} 
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                  placeholder="e.g. Partha Lalit"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                  placeholder="e.g. email@example.com"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>PAN Number (Tax ID)</label>
                <input 
                  type="text" 
                  value={profile.pan_number} 
                  onChange={(e) => setProfile({ ...profile, pan_number: e.target.value.toUpperCase() })} 
                  placeholder="10-digit PAN"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  value={profile.dob} 
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                />
              </div>
            </div>

            <h3 className={styles.subHeading}>Spouse & Family Details</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Spouse Name</label>
                <input 
                  type="text" 
                  value={profile.spouse_name} 
                  onChange={(e) => setProfile({ ...profile, spouse_name: e.target.value })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Spouse DOB</label>
                <input 
                  type="date" 
                  value={profile.spouse_dob} 
                  onChange={(e) => setProfile({ ...profile, spouse_dob: e.target.value })} 
                />
              </div>
            </div>
          </section>
        )}

        {/* STEP 2: SALARY BREAKDOWN */}
        {step === 2 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Salary & CTC Breakdown</h2>
            <p className={styles.sectionDesc}>Input tax-deductible salary variables for self and spouse.</p>
            
            <div className={styles.splitGrid}>
              {/* Self */}
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Your Annual Income (Self)</h3>
                <div className={styles.inputGroup}>
                  <label>Basic Salary (pa)</label>
                  <input 
                    type="number" 
                    value={selfSalary.basic_salary || ""} 
                    onChange={(e) => setSelfSalary({ ...selfSalary, basic_salary: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Employee PF Contribution (pa)</label>
                  <input 
                    type="number" 
                    value={selfSalary.employee_pf || ""} 
                    onChange={(e) => setSelfSalary({ ...selfSalary, employee_pf: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Employer PF Contribution (pa)</label>
                  <input 
                    type="number" 
                    value={selfSalary.employer_pf || ""} 
                    onChange={(e) => setSelfSalary({ ...selfSalary, employer_pf: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Variable Pay (pa)</label>
                  <input 
                    type="number" 
                    value={selfSalary.variable_pay || ""} 
                    onChange={(e) => setSelfSalary({ ...selfSalary, variable_pay: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Gross CTC (pa)</label>
                  <input 
                    type="number" 
                    value={selfSalary.ctc || ""} 
                    onChange={(e) => setSelfSalary({ ...selfSalary, ctc: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
              </div>

              {/* Spouse */}
              <div className={styles.panel}>
                <h3 className={styles.panelTitle}>Spouse Income</h3>
                <div className={styles.inputGroup}>
                  <label>Basic Salary (pa)</label>
                  <input 
                    type="number" 
                    value={spouseSalary.basic_salary || ""} 
                    onChange={(e) => setSpouseSalary({ ...spouseSalary, basic_salary: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Employee PF Contribution (pa)</label>
                  <input 
                    type="number" 
                    value={spouseSalary.employee_pf || ""} 
                    onChange={(e) => setSpouseSalary({ ...spouseSalary, employee_pf: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Gross CTC (pa)</label>
                  <input 
                    type="number" 
                    value={spouseSalary.ctc || ""} 
                    onChange={(e) => setSpouseSalary({ ...spouseSalary, ctc: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: INVESTMENTS */}
        {step === 3 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Active Portfolio Investments</h2>
            <p className={styles.sectionDesc}>List Mutual Funds folios and Equity stock stakes.</p>

            <div className={styles.addGrid}>
              <div className={styles.inputGroup}>
                <label>Asset Type</label>
                <select 
                  value={newInv.type} 
                  onChange={(e) => setNewInv({ ...newInv, type: e.target.value })}
                >
                  <option value="mutual_fund">Mutual Fund</option>
                  <option value="equity">Direct Equity (Stock)</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Asset Name</label>
                <input 
                  type="text" 
                  value={newInv.asset_name} 
                  onChange={(e) => setNewInv({ ...newInv, asset_name: e.target.value })} 
                  placeholder="e.g. HDFC Top 100 Fund"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Current Value (INR)</label>
                <input 
                  type="number" 
                  value={newInv.current_value || ""} 
                  onChange={(e) => setNewInv({ ...newInv, current_value: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <button onClick={addInvestmentItem} className={styles.addButton}>Add</button>
            </div>

            {/* List */}
            {investments.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Asset Name</th>
                      <th>Current Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((inv, i) => (
                      <tr key={i}>
                        <td className={styles.capitalize}>{inv.type.replace("_", " ")}</td>
                        <td>{inv.asset_name}</td>
                        <td>₹{inv.current_value.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* STEP 4: INSURANCE */}
        {step === 4 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Insurance Policies</h2>
            <p className={styles.sectionDesc}>Record Term Plans, Endowment plans, and Health policies.</p>

            <div className={styles.addGrid}>
              <div className={styles.inputGroup}>
                <label>Policy Name</label>
                <input 
                  type="text" 
                  value={newPolicy.policy_name} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, policy_name: e.target.value })} 
                  placeholder="e.g. HDFC Life Click2Protect"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Annual Premium (pa)</label>
                <input 
                  type="number" 
                  value={newPolicy.premium_pa || ""} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, premium_pa: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Life Cover / Sum Assured</label>
                <input 
                  type="number" 
                  value={newPolicy.life_cover || ""} 
                  onChange={(e) => setNewPolicy({ ...newPolicy, life_cover: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <button onClick={addInsuranceItem} className={styles.addButton}>Add</button>
            </div>

            {/* List */}
            {insurance.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Policy Name</th>
                      <th>Premium (pa)</th>
                      <th>Life Cover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insurance.map((ins, i) => (
                      <tr key={i}>
                        <td>{ins.policy_name}</td>
                        <td>₹{ins.premium_pa.toLocaleString("en-IN")}</td>
                        <td>₹{ins.life_cover.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* STEP 5: CREDIT CARDS */}
        {step === 5 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Active Credit Cards</h2>
            <p className={styles.sectionDesc}>Add your primary credit cards to track potential liabilities.</p>

            <div className={styles.addGrid}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>Card Name</label>
                <input 
                  type="text" 
                  value={newCard.card_name} 
                  onChange={(e) => setNewCard({ card_name: e.target.value })} 
                  placeholder="e.g. HDFC BizFirst"
                />
              </div>
              <button onClick={addCreditCardItem} className={styles.addButton}>Add Card</button>
            </div>

            {/* List */}
            {creditCards.length > 0 && (
              <div className={styles.cardList}>
                {creditCards.map((cc, i) => (
                  <div key={i} className={styles.ccChip}>
                    <span className={styles.ccIcon}>💳</span>
                    <span>{cc.card_name}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* STEP 6: NET WORTH SNAPSHOT */}
        {step === 6 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Assets & Liabilities Snapshot</h2>
            <p className={styles.sectionDesc}>Outline physical assets and outstanding loans to baseline Net Worth.</p>

            <h3 className={styles.subHeading}>Physical & Cash Assets</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Residential Property Valuation</label>
                <input 
                  type="number" 
                  value={netWorth.residential_property || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, residential_property: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Vehicle Estimated Value</label>
                <input 
                  type="number" 
                  value={netWorth.vehicle || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, vehicle: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Fixed Deposits (FD)</label>
                <input 
                  type="number" 
                  value={netWorth.fixed_deposits || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, fixed_deposits: parseFloat(e.target.value) || 0 })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Savings Account Balance</label>
                <input 
                  type="number" 
                  value={netWorth.liquid_savings || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, liquid_savings: parseFloat(e.target.value) || 0 })} 
                />
              </div>
            </div>

            <h3 className={styles.subHeading}>Active Liabilities & Loans</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Outstanding Home Loan Balance</label>
                <input 
                  type="number" 
                  value={netWorth.home_loan || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, home_loan: parseFloat(e.target.value) || 0 })} 
                  style={{ borderColor: "var(--danger)" }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Vehicle Loan Balance</label>
                <input 
                  type="number" 
                  value={netWorth.vehicle_loan || ""} 
                  onChange={(e) => setNetWorth({ ...netWorth, vehicle_loan: parseFloat(e.target.value) || 0 })} 
                  style={{ borderColor: "var(--danger)" }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button 
            onClick={handleBack} 
            className={styles.backBtn}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button 
            onClick={step === 6 ? saveStepData : handleNext} 
            className={styles.nextBtn}
            disabled={loading}
          >
            {loading ? "Saving..." : step === 6 ? "Finish Onboarding" : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}
