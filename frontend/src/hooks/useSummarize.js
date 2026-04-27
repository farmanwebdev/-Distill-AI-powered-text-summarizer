import { useState, useCallback } from "react";

export function useSummarize() {
  const [state, setState] = useState({
    summary: null,
    wordCount: null,
    originalWordCount: null,
    loading: false,
    error: null,
  });

  const summarize = useCallback(async (text, style) => {
    setState((s) => ({ ...s, loading: true, error: null, summary: null }));
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setState({ summary: data.summary, wordCount: data.wordCount, originalWordCount: data.originalWordCount, loading: false, error: null });
    } catch (err) {
      const message = err.name === "TypeError"
        ? "Cannot reach the server. Make sure the backend is running on port 5000."
        : err.message;
      setState((s) => ({ ...s, loading: false, error: message, summary: null }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ summary: null, wordCount: null, originalWordCount: null, loading: false, error: null });
  }, []);

  return { ...state, summarize, reset };
}
