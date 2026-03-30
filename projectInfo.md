# 📘 Syllabus2Success — Complete Project Information

> **Project Name:** Syllabus2Success  
> **Type:** Full-Stack MERN Web Application  
> **Purpose:** Hackathon Project — AI-powered Study Plan Generator  
> **Status:** ✅ Functional & Deployed Locally  

---

## 🧠 What Is This Project?

**Syllabus2Success** is a production-ready MERN stack web application that helps students convert their syllabus into a personalized, day-wise study plan using Generative AI.

A student simply pastes their syllabus text (or uploads a PDF/TXT file), enters their exam date, how many hours per day they can study, and their difficulty preference. The AI then generates a structured study plan — with topic distribution, revision sessions every 3rd day, and full revision buffer days before the exam — and saves it to MongoDB for future reference.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework with fast HMR |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first CSS with custom design tokens |
| **HTTP Client** | Axios | API communication from frontend to backend |
| **Routing** | React Router DOM v6 | Client-side page navigation |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas + Mongoose | Cloud NoSQL database for saving plans |
| **AI Model** | NVIDIA NIM — `meta/llama-3.3-70b-instruct` | Generates structured study plans |
| **AI SDK** | OpenAI SDK (pointed at NVIDIA's base URL) | NVIDIA NIM is OpenAI-API-compatible |
| **File Parsing** | `pdf-parse` + Multer | Extracts text from uploaded PDF files |
| **Environment** | `dotenv` | Loads `.env` secrets safely |
| **Dev Server** | Nodemon | Auto-restarts backend on file changes |

---

## 📁 Complete Project Structure

```
c:\AMMU\Project\
│
├── start.bat                         ← One-click Windows launcher
├── README.md                         ← GitHub readme
├── .gitignore                        ← Excludes node_modules, .env, dist
├── projectInfo.md                    ← THIS FILE
│
├── server/                           ← Node.js + Express Backend
│   ├── server.js                     ← App entry point, MongoDB connect, CORS
│   ├── .env                          ← Secrets (not in git)
│   ├── package.json                  ← Backend dependencies
│   │
│   ├── controllers/
│   │   └── planController.js         ← Core logic: AI call, file upload, save, progress
│   │
│   ├── models/
│   │   └── StudyPlan.js              ← Mongoose schema for study plans
│   │
│   ├── routes/
│   │   └── planRoutes.js             ← REST endpoint definitions
│   │
│   └── utils/
│       ├── aiPrompt.js               ← Prompt engineering for NVIDIA NIM
│       └── pdfParser.js              ← PDF text extraction using pdf-parse
│
└── client/                           ← React + Vite Frontend
    ├── index.html                    ← App HTML shell, meta tags, Google Fonts
    ├── vite.config.js                ← Vite config with Tailwind plugin + host:true
    ├── .env                          ← Frontend env (VITE_API_URL)
    ├── package.json                  ← Frontend dependencies
    │
    ├── public/
    │   └── Syllabus2Success.png      ← Official project logo (used as favicon too)
    │
    └── src/
        ├── main.jsx                  ← React app entry point
        ├── App.jsx                   ← Router setup (routes + 404 page)
        ├── index.css                 ← Global CSS: design tokens, glassmorphism,
        │                               animations, custom components
        │
        ├── services/
        │   └── api.js                ← Axios instance + all API call functions
        │
        ├── components/
        │   ├── Navbar.jsx            ← Sticky glassmorphism navbar with logo
        │   ├── Loader.jsx            ← Animated loading state with spinning logo
        │   ├── SyllabusForm.jsx      ← Main input form (text/file toggle, difficulty)
        │   └── PlanDisplay.jsx       ← Day card grid + stats + progress bar
        │
        └── pages/
            ├── HomePage.jsx          ← Landing page with hero, features, how-it-works
            ├── GeneratePage.jsx      ← Form page with error handling
            └── ResultPage.jsx        ← Displays generated plan with actions
```

---

## 🌐 Environment Variables

### `server/.env` *(never commit this)*
```env
PORT=5000
MONGO_URI=mongodb+srv://sai:sai123@genai.yssaj7f.mongodb.net/syllabus2success?retryWrites=true&w=majority&appName=GenAI
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx
```

### `client/.env` *(never commit this)*
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `GET` | `/` | — | Health check |
| `POST` | `/api/generate-plan` | `syllabus`, `examDate`, `hoursPerDay`, `difficulty` (JSON or FormData with `file`) | Generate & save a study plan |
| `GET` | `/api/plans` | — | Get all saved plans (latest 20) |
| `GET` | `/api/plans/:id` | `:id` param | Get a single plan by MongoDB ID |
| `PATCH` | `/api/plans/:id/progress` | `{ dayIndex, completed }` | Toggle day completion |

### Sample Request
```json
POST /api/generate-plan
{
  "syllabus": "Unit 1: Arrays\nUnit 2: Linked Lists\nUnit 3: Trees",
  "examDate": "2026-04-30",
  "hoursPerDay": 3,
  "difficulty": "medium"
}
```

### Sample Response
```json
{
  "id": "660abc123def",
  "daysAvailable": 31,
  "plan": [
    { "day": 1, "topics": ["Arrays - Introduction", "Array Operations"], "duration": "3 hours", "revision": false },
    { "day": 2, "topics": ["Linked Lists - Singly Linked List"], "duration": "3 hours", "revision": false },
    { "day": 3, "topics": ["Revision: Arrays, Linked Lists"], "duration": "1.5 hours", "revision": true },
    ...
    { "day": 30, "topics": ["Full Revision - All Topics"], "duration": "1.5 hours", "revision": true },
    { "day": 31, "topics": ["Full Revision - Mock Test Prep"], "duration": "1.5 hours", "revision": true }
  ]
}
```

---

## 🤖 How AI Integration Works

### Model
- **NVIDIA NIM** — `meta/llama-3.3-70b-instruct`
- Access via **OpenAI-compatible SDK** pointed at `https://integrate.api.nvidia.com/v1`

### Prompt Engineering Strategy (`utils/aiPrompt.js`)
The prompt is dynamically built with:
- The full syllabus text
- Number of days until the exam (calculated server-side)
- Hours per day (user's input)
- Difficulty (easy = 3 topics/day, medium = 2, hard = 1)

**System message:** Forces the model to return ONLY valid JSON, no markdown, no explanation.

**Rules enforced in prompt:**
1. Break syllabus into specific logical topics
2. Distribute topics evenly across days
3. Revision every 3rd day (revision: true)
4. Last 2 days always Full Revision
5. Study days = `hoursPerDay hours`, revision days = `1.5 hours`

**JSON Safety:** After receiving AI output, the backend:
- Strips accidental markdown fences (` ```json `)
- Runs `JSON.parse()` inside a try/catch
- Returns a 500 error with the raw response if parsing fails

---

## 🎨 Frontend Design System

The entire UI is built using a **custom CSS design system** in `index.css`:

### Color Palette (CSS Variables)
| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#6366f1` (Indigo) | Buttons, active states, links |
| `--secondary` | `#06b6d4` (Cyan) | Gradients, accents |
| `--accent` | `#f59e0b` (Amber) | Revision badges |
| `--bg-dark` | `#0f0f1a` | Page background |
| `--bg-card` | `#1a1a2e` | Card backgrounds |
| `--success` | `#10b981` | Completed states |
| `--revision` | `#f59e0b` | Revision day indicator |

### Key Design Patterns
- **Glassmorphism:** `.glass-card` — `backdrop-filter: blur(12px)` with semi-transparent background
- **Gradient Text:** `.gradient-text` — Indigo → Cyan → Amber gradient clipped to text
- **Gradient Button:** `.btn-primary` — Linear gradient with hover lift + glow shadow
- **Animations:** `fadeInUp`, `pulse-glow`, `spin`, `bounce` — used throughout
- **Stagger Animation:** `.stagger-children` — child elements animate in with increasing delays

### Pages & Components
| Page/Component | What It Does |
|----------------|--------------|
| `HomePage` | Hero with logo, features grid (6 cards), how-it-works steps, CTA, footer |
| `GeneratePage` | Form wrapper with error banner and tips panel |
| `ResultPage` | Displays plan header, legend, stats grid, day cards, bottom CTA |
| `SyllabusForm` | Text/file mode toggle, drag-and-drop upload, date picker, difficulty selector |
| `PlanDisplay` | 4 stat cards, progress bar, animated day card grid |
| `Navbar` | Sticky frosted glass bar with logo and nav links |
| `Loader` | Spinning ring around logo + bouncing dots + message |

---

## 🐛 Bugs Found & Fixed During Audit

| # | File | Issue | Fix Applied |
|---|------|-------|-------------|
| 1 | `server/.env` | MongoDB URI missing database name — data saved to default `test` DB | Added `/syllabus2success` to URI |
| 2 | `server/server.js` | CORS hardcoded to `localhost:5173` — blocked phone access | Dynamic CORS allowing all LAN IPs (`192.168.x`, `10.x`, `172.x`) |
| 3 | `server/server.js` | `app.listen` not binding to `0.0.0.0` — server not reachable on network | Changed to `app.listen(PORT, '0.0.0.0', ...)` |
| 4 | `server/server.js` | Health check still said "AI Study Plan Generator" | Updated to "Syllabus2Success" |
| 5 | `utils/aiPrompt.js` | JSDoc comment still said "for Gemini" (stale after AI switch) | Updated to reference NVIDIA NIM / LLaMA 3.3 |
| 6 | `PlanDisplay.jsx` | `progressPercent` = `completedCount / localPlan.length` — division by zero if plan is empty | Added guard: `localPlan.length > 0 ? ... : 0` |
| 7 | `SyllabusForm.jsx` | `hoursPerDay` is a string from `<input>` — `< 1` comparison works inconsistently | Explicitly cast to `Number()`, added `isNaN` check |

---

## ✅ What Is Done

- [x] Full backend (Express, MongoDB Atlas, Mongoose)
- [x] NVIDIA NIM AI integration (`meta/llama-3.3-70b-instruct`)
- [x] PDF & TXT file upload with Multer + pdf-parse
- [x] Prompt engineering with strict JSON output enforcement
- [x] MongoDB save & retrieve for all generated plans
- [x] Day progress tracking (PATCH endpoint + frontend toggle)
- [x] Full frontend (React + Vite + Tailwind CSS v4)
- [x] 3 pages: Home, Generate, Result
- [x] 4 components: Navbar, Loader, SyllabusForm, PlanDisplay
- [x] Syllabus2Success logo integrated everywhere
- [x] Responsive mobile-first design
- [x] Dark theme with glassmorphism, gradients, animations
- [x] Network URL support (phone access over Wi-Fi)
- [x] One-click `start.bat` Windows launcher
- [x] `.gitignore` protecting secrets
- [x] GitHub repository pushed
- [x] Full code audit & 7 bugs fixed

---

## 🔧 What Could Be Improved / TODO

- [ ] **JWT Authentication** — Login/Register so users can only see their own plans
- [ ] **PDF Export** — Download the study plan as a formatted PDF (`jsPDF`)
- [ ] **Dark/Light Mode Toggle** — Button to switch between themes
- [ ] **Plan History Page** — `/history` page listing all past plans with dates
- [ ] **Plan Editing** — Allow users to manually edit topics or durations
- [ ] **Email Reminders** — Send daily study topic reminders via email (Nodemailer)
- [ ] **Calendar View** — Display plan as a calendar grid instead of cards
- [ ] **Progress Persistence on Refresh** — Progress currently persists in MongoDB but UI reloads blank on hard refresh (needs to `GET /api/plans/:id` on load)
- [ ] **Deployment** — Deploy backend to Render/Railway, frontend to Vercel/Netlify
- [ ] **Rate Limiting** — Add `express-rate-limit` to prevent API abuse
- [ ] **Input Sanitization** — Sanitize syllabus input before sending to AI
- [ ] **Multiple Plans** — Allow users to juggle multiple active study plans

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works)
- NVIDIA NIM API key (free at `build.nvidia.com`)

### Step 1 — Clone
```bash
git clone https://github.com/Maganti-Praveen/gen-ai.git
cd gen-ai
```

### Step 2 — Configure .env files

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/syllabus2success?retryWrites=true&w=majority
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### Step 3 — Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### Step 4 — Start
**Option A** — Double-click `start.bat` (Windows)  
**Option B** — Manual:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev -- --host
```

### Access
| Device | URL |
|--------|-----|
| Browser (local) | http://localhost:5173 |
| Phone (same Wi-Fi) | http://192.168.x.x:5173 |
| Backend API | http://localhost:5000 |

---

## 📦 Dependencies

### Backend (`server/package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19 | Web framework |
| `mongoose` | ^8.4 | MongoDB ODM |
| `dotenv` | ^16.4 | Environment variables |
| `cors` | ^2.8 | Cross-origin requests |
| `multer` | ^1.4 | File upload middleware |
| `openai` | latest | NVIDIA NIM API client |
| `pdf-parse` | ^1.1 | PDF text extraction |
| `nodemon` | ^3.1 | Dev auto-restart |

### Frontend (`client/package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18 | UI library |
| `react-dom` | ^18 | DOM rendering |
| `react-router-dom` | ^6 | Client-side routing |
| `axios` | ^1 | HTTP requests |
| `vite` | ^8 | Build tool & dev server |
| `@vitejs/plugin-react` | latest | React support in Vite |
| `tailwindcss` | ^4 | CSS framework |
| `@tailwindcss/vite` | ^4 | Tailwind Vite integration |

---

## 🔐 Security Notes

- `.env` files are in `.gitignore` — API keys and DB credentials are **never committed**
- MongoDB Atlas IP whitelist should be configured (currently set to allow all `0.0.0.0/0` for dev)
- NVIDIA API key is server-side only — never exposed to the browser/frontend
- No passwords are stored (no auth implemented yet)

---

## 🏆 Hackathon Summary

This project was built as a hackathon submission demonstrating:
- Full-stack MERN architecture
- Real AI integration (NVIDIA NIM / LLaMA 3.3 70B)
- Prompt engineering for structured JSON output
- File upload & PDF parsing
- Modern UI with custom design system
- Progress tracking with MongoDB persistence
- Mobile-accessible via network URL

**Built by:** Maganti Praveen  
**Repository:** https://github.com/Maganti-Praveen/gen-ai  
**Stack:** MongoDB · Express · React · Node.js · NVIDIA NIM AI
