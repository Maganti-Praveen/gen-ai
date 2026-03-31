# 📘 Syllabus2Success — Complete Project Information

> **Project Name:** Syllabus2Success  
> **Type:** Full-Stack MERN Web Application  
> **Purpose:** Hackathon Project — AI-powered Study Plan Generator  
> **Status:** ✅ Fully Featured & Production-Ready  

---

## 🧠 What Is This Project?

**Syllabus2Success** is a production-ready MERN stack web application that helps students convert their syllabus into a personalized, day-wise study plan using Generative AI.

A student simply pastes their syllabus text, uploads a PDF/TXT file, photographs it with their phone camera (OCR), or even dictates it via voice — enters their exam date, study hours, and difficulty — and the AI generates a structured study plan with topic distribution, revision sessions every 3rd day, and full revision buffer days before the exam. Everything is saved per-user with JWT authentication.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework with fast HMR |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first CSS with custom design tokens |
| **HTTP Client** | Axios | API communication with auth interceptors |
| **Routing** | React Router DOM v6 | Client-side page navigation + protected routes |
| **OCR** | Tesseract.js | Image-to-text extraction for syllabus photos |
| **PDF Export** | jsPDF + jspdf-autotable | Export study plans as styled PDF documents |
| **Voice Input** | Web Speech API | Browser-native speech recognition |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas + Mongoose | Cloud NoSQL database for users & plans |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Token-based authentication with password hashing |
| **Rate Limiting** | express-rate-limit | API abuse prevention (100 req/15min) |
| **AI Primary** | NVIDIA NIM — `meta/llama-3.3-70b-instruct` | Primary AI for plan generation (10s timeout) |
| **AI Fallback** | Groq — `llama-3.1-8b-instant` | Automatic fallback if NVIDIA is slow/down |
| **File Parsing** | `pdf-parse` + Multer | Extracts text from uploaded PDF files |
| **Environment** | `dotenv` | Loads `.env` secrets safely |

---

## 📁 Complete Project Structure

```
c:\AMMU\Project\
│
├── start.bat                           ← One-click Windows launcher
├── README.md                           ← GitHub readme
├── .gitignore                          ← Excludes node_modules, .env, dist, test/
├── projectInfo.md                      ← THIS FILE
│
├── server/                             ← Node.js + Express Backend
│   ├── server.js                       ← App entry, MongoDB, CORS, rate limiter
│   ├── .env                            ← Secrets (PORT, MONGO_URI, NVIDIA/GROQ keys, JWT)
│   ├── package.json
│   │
│   ├── controllers/
│   │   ├── authController.js           ← Register, login, getMe, updateProfile, dashboard
│   │   └── planController.js           ← Generate, extract, tips, quiz, share, edit, delete
│   │
│   ├── middleware/
│   │   └── auth.js                     ← JWT protect + optionalAuth middleware
│   │
│   ├── models/
│   │   ├── User.js                     ← User schema (bcrypt hashing, avatar initials)
│   │   └── StudyPlan.js                ← Plan schema (user ref, quizScores, shareToken)
│   │
│   ├── routes/
│   │   ├── authRoutes.js               ← Auth endpoints
│   │   └── planRoutes.js               ← Plan + AI endpoints (all protected)
│   │
│   └── utils/
│       ├── aiClient.js                 ← NVIDIA→Groq fallback with 10s timeout
│       ├── aiPrompt.js                 ← Prompt engineering for study plan
│       └── pdfParser.js                ← PDF text extraction
│
├── client/                             ← React + Vite Frontend
│   ├── index.html                      ← App shell, meta tags, Google Fonts
│   ├── vite.config.js                  ← Vite + Tailwind + host:true
│   ├── .env                            ← VITE_API_URL
│   ├── package.json
│   │
│   ├── public/
│   │   └── Syllabus2Success.png        ← Logo (favicon + brand)
│   │
│   └── src/
│       ├── main.jsx                    ← Entry: AuthProvider + ToastProvider wrappers
│       ├── App.jsx                     ← Router: all routes + ProtectedRoute wrappers
│       ├── index.css                   ← Full design system + modal/toast/auth CSS
│       │
│       ├── context/
│       │   ├── AuthContext.jsx          ← Auth state: user, token, login, register, logout
│       │   └── ToastContext.jsx         ← Toast notifications: showToast(msg, type)
│       │
│       ├── services/
│       │   └── api.js                  ← Axios + auth interceptor + all API functions
│       │
│       ├── hooks/
│       │   └── useVoiceInput.js        ← Web Speech API hook
│       │
│       ├── utils/
│       │   ├── ocrParser.js            ← Tesseract.js OCR with progress
│       │   └── exportPdf.js            ← jsPDF plan export
│       │
│       ├── components/
│       │   ├── Navbar.jsx              ← Auth-aware: login/register OR avatar dropdown
│       │   ├── Loader.jsx              ← Animated loading spinner with logo
│       │   ├── ProtectedRoute.jsx      ← Auth guard → redirect to /login
│       │   ├── SyllabusForm.jsx        ← Two-step: text/file/image/voice → topic review → generate
│       │   ├── PlanDisplay.jsx         ← Day cards + quiz/tips buttons + share/export
│       │   ├── PlanEditor.jsx          ← Drag-and-drop plan reorder + edit topics
│       │   ├── PlanAnalytics.jsx       ← Stats, weekly bars, quiz performance (pure CSS)
│       │   ├── TopicTipsModal.jsx      ← AI study tips, mnemonics, practice questions
│       │   └── QuizModal.jsx           ← 5-question MCQ quiz with scoring
│       │
│       └── pages/
│           ├── HomePage.jsx            ← Hero, 9 feature cards, how-it-works, CTA
│           ├── LoginPage.jsx           ← Glassmorphism login with show/hide password
│           ├── RegisterPage.jsx        ← Register with password strength indicator
│           ├── DashboardPage.jsx       ← User stats, recent plans, account settings
│           ├── GeneratePage.jsx        ← Form wrapper with error handling
│           ├── ResultPage.jsx          ← Plan view/edit toggle + analytics + share/export
│           ├── HistoryPage.jsx         ← All plans grid with progress + delete
│           └── SharedPlanPage.jsx      ← Public read-only shared plan view
```

---

## 🌐 Environment Variables

### `server/.env` *(never commit this)*
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/syllabus2success?retryWrites=true&w=majority
NVIDIA_API_KEY=nvapi-xxxxx
GROQ_API_KEY=gsk_xxxxx
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create account (name, email, password) |
| `POST` | `/api/auth/login` | ❌ | Login (email, password) → JWT + user |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `PUT` | `/api/auth/profile` | ✅ | Update name/email |
| `GET` | `/api/auth/dashboard` | ✅ | User stats + recent plans |

### Plan Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/generate-plan` | ✅ | Generate AI study plan (text or file) |
| `POST` | `/api/extract-topics` | ✅ | AI topic extraction from syllabus |
| `POST` | `/api/study-tips` | ✅ | AI study tips for a topic |
| `POST` | `/api/generate-quiz` | ✅ | AI-generated 5-question MCQ quiz |
| `GET` | `/api/plans` | ✅ | Get user's plans |
| `GET` | `/api/plans/:id` | ✅ | Get single plan |
| `PATCH` | `/api/plans/:id/progress` | ✅ | Toggle day completion |
| `PATCH` | `/api/plans/:id/edit` | ✅ | Update plan (drag-and-drop reorder) |
| `POST` | `/api/plans/:id/share` | ✅ | Generate share link |
| `POST` | `/api/plans/:id/quiz-score` | ✅ | Save quiz score |
| `DELETE` | `/api/plans/:id` | ✅ | Delete plan |
| `GET` | `/api/shared/:token` | ❌ | View shared plan (public) |

---

## 🤖 AI Dual-Provider System

### How It Works
```
User Request → NVIDIA NIM (10s timeout)
                  ├─ Success → Return response (provider: "nvidia")
                  └─ Timeout/Error → Groq Fallback
                                       ├─ Success → Return response (provider: "groq")
                                       └─ Error → Return 500 to user
```

### Primary: NVIDIA NIM
- **Model:** `meta/llama-3.3-70b-instruct`
- **Base URL:** `https://integrate.api.nvidia.com/v1`
- **SDK:** OpenAI SDK (API-compatible)
- **Timeout:** 10 seconds

### Fallback: Groq
- **Model:** `llama-3.1-8b-instant`
- **SDK:** Groq SDK (native)
- **Used when:** NVIDIA times out (>10s) or returns an error

### Implementation
- Centralized in `server/utils/aiClient.js`
- `callAI({ messages, temperature, max_tokens })` → `{ text, provider }`
- All 4 AI endpoints use this: generatePlan, extractTopics, getStudyTips, generateQuiz
- Console logs show which provider responded: `🔷 NVIDIA` or `🟢 Groq`

---

## ✅ All Features Implemented

### Feature 1: JWT Authentication System
- User registration with bcrypt password hashing (salt 12)
- Login with JWT token (7-day expiry)
- Protected routes — all plan endpoints require auth
- User avatar auto-generated from name initials
- Profile editing (name, email)
- Dashboard with stats

### Feature 2: Smart Syllabus Topic Extraction (Two-Step AI)
- Step 1: User enters syllabus → AI extracts topics into units with estimated hours
- Step 2: User reviews extracted topics (checkbox to include/exclude) → enters exam details → generates plan
- Step indicator with progress dots

### Feature 3: AI Study Tips Modal
- Click any topic in the plan → AI generates tips, mnemonics, common mistakes, practice questions
- YouTube search button for video learning
- Estimated mastery time

### Feature 4: AI Quiz Generator
- "Quiz" button on each day card → AI generates 5 MCQ questions
- One question at a time, color-coded correct/wrong answers
- Explanation shown after each question
- Results screen with emoji feedback (🏆/👏/📖)
- Score saved to MongoDB per plan

### Feature 5: Plan Analytics Dashboard
- Summary stats: total days, study/revision split, hours, completion %
- Weekly breakdown: pure CSS horizontal bar chart
- Quiz performance: average score, best score, quizzes taken
- Motivational message based on completion

### Feature 6: Plan Sharing via Unique Link
- "Share Plan" button → generates crypto random token
- Shareable URL: `/shared/<token>`
- Public read-only view (no auth required)
- "Create your own plan" CTA for new users

### Feature 7: PDF Export
- "Export PDF" button → downloads styled PDF
- Header with logo, metadata (difficulty, hours, exam date)
- Table with day, type, topics, duration, status columns
- Color-coded with indigo header and alternating rows

### Feature 8: Voice Input (Web Speech API)
- Microphone button next to syllabus textarea
- Continuous mode with interim results
- Pulses red when listening
- Transcript auto-appended to syllabus text

### Feature 9: Image/Photo OCR (Tesseract.js)
- "Photo" input mode alongside Text and File
- Accept images + mobile camera capture
- Image preview shown after selection
- Progress bar during OCR recognition
- Extracted text populates syllabus textarea

### Feature 10: Interactive Plan Editor (Drag & Drop)
- "Edit Plan" toggle on result page
- HTML5 drag-and-drop to reorder days (auto-renumber)
- Editable topic names per day
- Add/remove topics, add/delete days
- Toggle study/revision type
- "Save Changes" persists to MongoDB

### Feature 11: Toast Notification System
- `showToast(message, type)` via React Context
- Types: success (green), error (red), warning (amber), info (blue)
- Auto-dismiss after 4 seconds
- Slide-in animation from right
- Max 3 visible, oldest removed
- Replaces all `alert()` calls project-wide

### Bonus: Groq API Fallback
- NVIDIA NIM is primary AI provider (10s timeout)
- Groq (llama-3.1-8b-instant) auto-activates if NVIDIA is slow or down
- Zero config for the user — happens transparently
- Response includes `provider` field showing which AI responded

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas free tier
- NVIDIA NIM API key (free at build.nvidia.com)
- Groq API key (free at console.groq.com)

### Setup
```bash
# Clone
git clone https://github.com/Maganti-Praveen/gen-ai.git
cd gen-ai

# Backend
cd server && npm install
# Create server/.env with keys (see above)

# Frontend
cd ../client && npm install
# Create client/.env: VITE_API_URL=http://localhost:5000
```

### Start
**Option A:** Double-click `start.bat`  
**Option B:** Manual:
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev -- --host
```

### Access
| Device | URL |
|--------|-----|
| Browser | http://localhost:5173 |
| Phone (same Wi-Fi) | http://192.168.x.x:5173 |
| Backend API | http://localhost:5000 |

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| multer | File upload middleware |
| pdf-parse | PDF text extraction |
| openai | NVIDIA NIM client |
| groq-sdk | Groq fallback client |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| express-rate-limit | API rate limiting |
| nodemon | Dev auto-restart |

### Frontend
| Package | Purpose |
|---------|---------|
| react, react-dom | UI library |
| react-router-dom | Client-side routing |
| axios | HTTP requests with interceptors |
| vite | Build tool & dev server |
| @vitejs/plugin-react | React Vite plugin |
| tailwindcss, @tailwindcss/vite | CSS framework |
| tesseract.js | OCR image-to-text |
| jspdf | PDF generation |
| jspdf-autotable | PDF table formatting |

---

## 🔐 Security

- Passwords hashed with bcryptjs (12 salt rounds, never returned in responses)
- JWT tokens with 7-day expiry
- Protected routes validate token on every request
- Rate limiter: 100 requests per 15 minutes per IP
- API keys stored in .env (gitignored, never committed)
- CORS restricted to localhost + LAN IPs
- HTML tags stripped from all user input (sanitize function)

---

## 🏆 Summary

**Built by:** Maganti Praveen  
**Repository:** https://github.com/Maganti-Praveen/gen-ai  
**Stack:** MongoDB · Express · React · Node.js · NVIDIA NIM · Groq  
**Features:** 11 production-ready features + AI dual-provider fallback
