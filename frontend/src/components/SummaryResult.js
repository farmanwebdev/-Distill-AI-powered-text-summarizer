import React, { useState } from "react";
import styles from "./SummaryResult.module.css";

export default function SummaryResult({ summary, wordCount, originalWordCount, onReset }) {
  const [copied, setCopied] = useState(false);

  const reduction = originalWordCount
    ? Math.round((1 - wordCount / originalWordCount) * 100)
    : 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const isBullets = summary.includes("\n•") || summary.startsWith("•");
  const lines = isBullets ? summary.split("\n").filter(Boolean) : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.badge}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {wordCount} words
          </span>
          {reduction > 0 && (
            <span className={`${styles.badge} ${styles.green}`}>
              ↓ {reduction}% shorter
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={handleCopy} title="Copy summary">
            {copied ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path d="M3 8l3.5 3.5 6.5-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 5V4a1.5 1.5 0 00-1.5-1.5h-6A1.5 1.5 0 002 4v7a1.5 1.5 0 001.5 1.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
          <button className={styles.iconBtn} onClick={onReset} title="New summary">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M2.5 8a5.5 5.5 0 119.5 3.74M2.5 8V4.5M2.5 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {isBullets && lines ? (
          <ul className={styles.bullets}>
            {lines.map((line, i) => (
              <li key={i}>{line.replace(/^•\s*/, "")}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.text}>{summary}</p>
        )}
      </div>
    </div>
  );
}
