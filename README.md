# Distill — AI Text Summarizer

A full-stack MERN app that summarizes text using the Claude AI API (Anthropic). Paste any text and get a clean, concise summary in seconds.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, CSS Modules             |
| Backend  | Node.js, Express 4                |
| AI       | Anthropic Claude API (Haiku)      |
| Styling  | Custom CSS, Google Fonts (DM Sans)|

---

## Project Structure

```
summarizer/
├── client/                  # React frontend
│   ├── public/index.html
│   └── src/
│       ├── App.js           # Main app component
│       ├── App.module.css
│       ├── index.js
│       ├── index.css        # Global styles / design tokens
│       ├── hooks/
│       │   └── useSummarize.js   # API call hook
│       └── components/
│           ├── TextInput.js      # Textarea with char counter
│           ├── StylePicker.js    # Concise / Detailed / Bullets
│           └── SummaryResult.js  # Output card with copy button
└── server/
    ├── index.js             # Express app, routes, middleware
    ├── summarize.js         # Anthropic API integration
    ├── .env.example
    └── package.json
```

---

## Setup & Run



# Client
cd ../frontend && npm install
```

### 3. Configure environment



Get your API key at: https://console.anthropic.com/

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
CLIENT_URL=http://localhost:3000
```

> **Demo mode:** If no API key is set, the app runs in demo mode with placeholder summaries so you can test the UI flow.

### 4. Start both servers

Open **two terminals**:

---

## API Reference

### `POST /api/summarize`

**Request body:**
```json
{
  "text": "Your text to summarize (50–10,000 chars)",
  "style": "concise" | "detailed" | "bullets"
}
```

**Success response:**
```json
{
  "summary": "...",
  "wordCount": 42,
  "originalWordCount": 350
}
```

**Error response:**
```json
{ "error": "Descriptive error message" }
```

### `GET /api/health`
Returns `{ "status": "ok", "timestamp": "..." }`

---

## Features

- ✅ React frontend with real-time char counter
- ✅ 3 summary styles: Concise, Detailed, Bullets  
- ✅ Loading spinner & keyboard shortcut (Cmd/Ctrl + Enter)
- ✅ Copy-to-clipboard button
- ✅ Word reduction stats (e.g. "↓ 88% shorter")
- ✅ Input validation with helpful error messages
- ✅ Rate limiting (20 req / 15 min per IP)
- ✅ Demo mode (works without an API key)
- ✅ Responsive design (mobile-first)

---

## Deploying

**Backend** → Deploy to Railway, Render, or Fly.io. Set `ANTHROPIC_API_KEY` and `CLIENT_URL` as environment variables.

**Frontend** → Run `npm run build` in `/client`, then deploy the `build/` folder to Vercel, Netlify, or any static host. Set the proxy URL to your deployed backend.
