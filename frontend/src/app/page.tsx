"use client";

import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import styles from "./Landing.module.css";

export default function Home() {
  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <span className={styles.logoIcon}>💎</span>
          <span className={styles.logoText}>Wealth Suite</span>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.mainContent}>
        <div className={styles.badge}>Live Wealth Tracking</div>
        <h1 className={styles.headline}>
          Understand Your Financial <br />
          <span className={styles.highlight}>Net Worth Instantly.</span>
        </h1>
        <p className={styles.subtext}>
          A minimalistic, secure workspace for tracking your personal assets, 
          salary cash-flows, active portfolios, and liabilities. Built for production, trusted by individuals.
        </p>

        <div className={styles.actionGroup}>
          <Link href="/setup" className={styles.primaryBtn}>
            Configure Wealth Snapshot
          </Link>
          <a href="https://github.com/parthalalit" target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
            View GitHub Profile
          </a>
        </div>

        {/* Feature Grid */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h3>🔐 Bank-Grade Security</h3>
            <p>Your session JWT details map directly to local PostgreSQL databases via secure APIs.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📊 Live Aggregations</h3>
            <p>Assets are automatically compiled against current loans in real-time calculations.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🌗 Premium Adaptive UI</h3>
            <p>Seamlessly switch themes depending on your screen settings without performance lag.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
