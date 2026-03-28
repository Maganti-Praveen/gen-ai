# gen-ai

# 🧠 AI Study Plan Generator

A full-stack MERN web application that generates personalized, day-wise study plans using **NVIDIA NIM AI** (LLaMA 3.3 70B).

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| AI | NVIDIA NIM — `meta/llama-3.3-70b-instruct` |

## 📁 Project Structure

```
gen-ai/
├── client/         # React + Vite frontend
├── server/         # Node.js + Express backend
├── start.bat       # One-click launcher (Windows)
└── README.md
```

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/Maganti-Praveen/gen-ai.git
cd gen-ai
```

### 2. Configure environment variables

**`server/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
NVIDIA_API_KEY=your_nvidia_nim_api_key
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

### 4. Run the app

**Windows (double-click):**
```
start.bat
```

**Manual:**
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

App runs at → **http://localhost:5173**

## 🎯 Features

- 📝 Paste syllabus text or upload PDF/TXT
- 📅 Set exam date and daily study hours
- 🔥 Choose difficulty (Easy / Medium / Hard)
- 🤖 AI generates a personalized day-wise study plan
- 🔄 Auto revision every 3rd day + last 2 days buffer
- ✅ Track daily progress with checkboxes
- 💾 All plans saved to MongoDB Atlas

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-plan` | Generate a study plan |
| GET | `/api/plans` | Get all saved plans |
| GET | `/api/plans/:id` | Get plan by ID |
| PATCH | `/api/plans/:id/progress` | Update day progress |
