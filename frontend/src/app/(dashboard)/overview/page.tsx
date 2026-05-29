"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import { apiRequest } from "@/lib/api";
import styles from "./Overview.module.css";

export default function OverviewDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    summary: { total_assets: 0, total_liabilities: 0, net_worth: 0 },
    allocation: { personal_assets: 0, liquid_assets: 0, mutual_funds: 0, equities: 0, long_term_instruments: 0 },
    liabilities_breakdown: { home_loan: 0, vehicle_loan: 0, personal_loan: 0, other_loans: 0 }
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const res = await apiRequest("/api/wealth/net-worth/summary");
        if (res) setData(res);
      } catch (err) {
        console.error("Failed to load net worth calculations", err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getPercentage = (val: number) => {
    if (!data.summary.total_assets) return "0%";
    return `${((val / data.summary.total_assets) * 100).toFixed(1)}%`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <span className={styles.logoIcon}>💎</span>
          <h1 className={styles.title}>Wealth Suite</h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/setup" className={styles.editBtn}>
            ✏️ Update Financials
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {loading ? (
        <div className={styles.loader}>Compiling Wealth Ledger...</div>
      ) : (
        <main className={styles.grid}>
          {/* Main Net Worth Scorecard */}
          <section className={styles.worthCard}>
            <span className={styles.cardLabel}>Compiled Net Worth</span>
            <h2 className={styles.worthValue}>
              {formatCurrency(data.summary.net_worth)}
            </h2>
            <div className={styles.miniStats}>
              <div className={styles.miniStat}>
                <span>Gross Assets</span>
                <span className={styles.assetVal}>{formatCurrency(data.summary.total_assets)}</span>
              </div>
              <div className={styles.miniStatDivider} />
              <div className={styles.miniStat}>
                <span>Outstanding Liabilities</span>
                <span className={styles.debtVal}>{formatCurrency(data.summary.total_liabilities)}</span>
              </div>
            </div>
          </section>

          {/* Asset Allocation Breakdown */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Asset Allocation</h3>
            <p className={styles.cardDesc}>Visualizing your capital allocations.</p>
            
            <div className={styles.allocationList}>
              {/* Mutual Funds */}
              <div className={styles.allocRow}>
                <div className={styles.allocHeader}>
                  <span className={styles.allocName}>📈 Mutual Funds</span>
                  <span className={styles.allocPercent}>{getPercentage(data.allocation.mutual_funds)}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: getPercentage(data.allocation.mutual_funds), backgroundColor: "#2563eb" }} />
                </div>
                <span className={styles.allocVal}>{formatCurrency(data.allocation.mutual_funds)}</span>
              </div>

              {/* Equities */}
              <div className={styles.allocRow}>
                <div className={styles.allocHeader}>
                  <span className={styles.allocName}>💼 Direct Equities</span>
                  <span className={styles.allocPercent}>{getPercentage(data.allocation.equities)}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: getPercentage(data.allocation.equities), backgroundColor: "#10b981" }} />
                </div>
                <span className={styles.allocVal}>{formatCurrency(data.allocation.equities)}</span>
              </div>

              {/* Liquid Cash */}
              <div className={styles.allocRow}>
                <div className={styles.allocHeader}>
                  <span className={styles.allocName}>💵 Liquid Cash / FDs</span>
                  <span className={styles.allocPercent}>{getPercentage(data.allocation.liquid_assets)}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: getPercentage(data.allocation.liquid_assets), backgroundColor: "#f59e0b" }} />
                </div>
                <span className={styles.allocVal}>{formatCurrency(data.allocation.liquid_assets)}</span>
              </div>

              {/* Personal Assets */}
              <div className={styles.allocRow}>
                <div className={styles.allocHeader}>
                  <span className={styles.allocName}>🏡 Physical Assets</span>
                  <span className={styles.allocPercent}>{getPercentage(data.allocation.personal_assets)}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: getPercentage(data.allocation.personal_assets), backgroundColor: "#8b5cf6" }} />
                </div>
                <span className={styles.allocVal}>{formatCurrency(data.allocation.personal_assets)}</span>
              </div>
            </div>
          </section>

          {/* Liabilities Summary */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Liabilities Ledger</h3>
            <p className={styles.cardDesc}>Tracking debt distribution.</p>
            
            <div className={styles.debtsList}>
              <div className={styles.debtItem}>
                <span className={styles.debtName}>🏠 Home Loan</span>
                <span className={styles.debtAmount}>{formatCurrency(data.liabilities_breakdown.home_loan)}</span>
              </div>
              <div className={styles.debtItem}>
                <span className={styles.debtName}>🚗 Vehicle Loan</span>
                <span className={styles.debtAmount}>{formatCurrency(data.liabilities_breakdown.vehicle_loan)}</span>
              </div>
              <div className={styles.debtItem}>
                <span className={styles.debtName}>💳 Personal & Other Loans</span>
                <span className={styles.debtAmount}>
                  {formatCurrency(data.liabilities_breakdown.personal_loan + data.liabilities_breakdown.other_loans)}
                </span>
              </div>
            </div>
            
            {data.summary.total_liabilities > 0 && (
              <div className={styles.leverageWarning}>
                ⚠️ Debt-to-Asset Leverage Ratio: {((data.summary.total_liabilities / data.summary.total_assets) * 100).toFixed(1)}%
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
