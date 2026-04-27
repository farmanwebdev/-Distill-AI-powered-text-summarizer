/**
 * summarize.js
 * Calls the Anthropic Claude API to summarize text.
 * Falls back to a demo summary if no API key is set.
 */

const STYLE_PROMPTS = {
  concise: "Summarize the following text in 2-3 clear, concise sentences. Capture only the most important points.",
  detailed: "Provide a detailed summary of the following text in 4-6 sentences. Cover the main ideas, key details, and any conclusions.",
  bullets: "Summarize the following text as a bullet-point list. Use 3-6 bullet points, each starting with '• '. Each bullet should be a single clear sentence.",
};

export async function summarizeText(text, style = "concise") {
  const originalWordCount = text.trim().split(/\s+/).length;

  // Demo mode if no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    const demo = getDemoSummary(text, style);
    return { summary: demo, wordCount: demo.split(/\s+/).length, originalWordCount };
  }

  const prompt = `${STYLE_PROMPTS[style]}\n\nText to summarize:\n"""\n${text}\n"""`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.error?.message || "API request failed");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const summary = data.content?.[0]?.text?.trim() || "Could not generate a summary.";
  const wordCount = summary.split(/\s+/).length;

  return { summary, wordCount, originalWordCount };
}

function getDemoSummary(text, style) {
  const words = text.trim().split(/\s+/);
  const snippet = words.slice(0, 8).join(" ");

  if (style === "bullets") {
    return `• This is a demo summary — add your ANTHROPIC_API_KEY to .env to enable real AI summaries.\n• The text begins with: "${snippet}..."\n• Your original text contained ${words.length} words.`;
  }
  if (style === "detailed") {
    return `[Demo Mode] This is a placeholder summary. To get real AI-powered summaries, add your ANTHROPIC_API_KEY to the server/.env file. Your text starts with "${snippet}..." and contains ${words.length} words. The actual summary would cover all major themes and details from your text.`;
  }
  return `[Demo Mode] Add ANTHROPIC_API_KEY to .env for real summaries. Text preview: "${snippet}..." (${words.length} words total).`;
}
