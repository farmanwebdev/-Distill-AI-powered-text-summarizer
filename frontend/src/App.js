import React, { useState } from "react";
import styles from "./App.module.css";
import TextInput from "./components/TextInput";
import StylePicker from "./components/StylePicker";
import SummaryResult from "./components/SummaryResult";
import { useSummarize } from "./hooks/useSummarize";

export default function App() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("concise");
  const { summary, wordCount, originalWordCount, loading, error, summarize, reset } = useSummarize();

  const canSubmit = text.trim().length >= 50 && !loading;

  const handleSubmit = () => {
    if (canSubmit) summarize(text, style);
  };

  const handleReset = () => {
    reset();
    setText("");
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <div className={styles.page} onKeyDown={handleKeyDown}>
      {/* Background glow */}
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>Distill</span>
        </div>
        <p className={styles.tagline}>AI-powered text summarizer</p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.heading}>
            Cut through the noise.<br />
            <em>Keep what matters.</em>
          </h1>
          <p className={styles.subheading}>
            Paste any text — articles, reports, emails — and get a clean summary in seconds.
          </p>

          {!summary ? (
            <div className={styles.form}>
              <div className={styles.section}>
                <label className={styles.label}>Your text</label>
                <TextInput value={text} onChange={setText} disabled={loading} />
                {text.trim().length > 0 && text.trim().length < 50 && (
                  <p className={styles.hint}>Need at least 50 characters ({50 - text.trim().length} more)</p>
                )}
              </div>

              <div className={styles.section}>
                <label className={styles.label}>Summary style</label>
                <StylePicker value={style} onChange={setStyle} disabled={loading} />
              </div>

              {error && (
                <div className={styles.error} role="alert">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!canSubmit}
                aria-label="Summarize text"
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Summarizing…
                  </>
                ) : (
                  <>
                    Summarize
                    <span className={styles.shortcut}>⌘↵</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className={styles.result}>
              <SummaryResult
                summary={summary}
                wordCount={wordCount}
                originalWordCount={originalWordCount}
                onReset={handleReset}
              />
              <button className={styles.newBtn} onClick={handleReset}>
                ← Summarize another text
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        Build by @FsCode 2026 Codinghub . Claude AI
        {/* Built with React · Node/Express · Claude AI */}
      </footer>
    </div>
  );
}
