import React from "react";
import styles from "./StylePicker.module.css";

const OPTIONS = [
  { value: "concise", label: "Concise", desc: "2–3 sentences" },
  { value: "detailed", label: "Detailed", desc: "4–6 sentences" },
  { value: "bullets", label: "Bullets", desc: "3–6 key points" },
];

export default function StylePicker({ value, onChange, disabled }) {
  return (
    <div className={styles.wrapper} role="group" aria-label="Summary style">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.btn} ${value === opt.value ? styles.active : ""}`}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
          aria-pressed={value === opt.value}
        >
          <span className={styles.label}>{opt.label}</span>
          <span className={styles.desc}>{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}
