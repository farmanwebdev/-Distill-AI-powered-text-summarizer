import React from "react";
import styles from "./TextInput.module.css";

const MAX_CHARS = 10000;

export default function TextInput({ value, onChange, disabled }) {
  const charCount = value.length;
  const isNearLimit = charCount > MAX_CHARS * 0.85;

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your article, report, email, or any text here…"
        disabled={disabled}
        maxLength={MAX_CHARS}
        spellCheck={false}
        aria-label="Text to summarize"
      />
      <div className={`${styles.counter} ${isNearLimit ? styles.warn : ""}`}>
        {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </div>
    </div>
  );
}
