# 💰 GuLLack — FinTech Application

> **Project created by Roneet Bala**

A full-stack financial technology application built with a **Django REST Framework (DRF)** backend and a **React + TypeScript + Vite + TailwindCSS** frontend, featuring JWT authentication, light/dark themes, and preconfigured API clients.

---

## 📌 Progress & What Has Been Done So Far

### 1. 🏗️ Workspace Setup & Structure
- Extracted and reorganized all boilerplate components directly to the workspace root (`FinTechapp/`).
- Cleaned up nested folders and system artifacts.
- Verified directory separation for `backend/` and `frontend/`.

### 2. 🛠️ Backend Environment & Database (Django + DRF)
- **Virtual Environment**: Initialized isolated Python virtual environment (`venv`).
- **Dependencies Installed**:
  - `Django` (5.2.5) & `djangorestframework` (3.16.1)
  - `djangorestframework_simplejwt` & `PyJWT` for token-based authentication
  - `django-cors-headers` (configured for `http://localhost:5173`)
  - `django-jazzmin` for modern admin UI
  - `django-environ`, `shortuuid`, `tzdata`, `sqlparse`
- **Database Initialized**: Executed `python manage.py migrate` to apply authentication, session, content types, and token blacklist migrations to SQLite (`db.sqlite3`).
- **System Check**: Ran Django check (`python manage.py check`) with 0 errors.

### 3. 🌐 Frontend Environment & Customization (React + TS + Vite)
- **Dependencies Installed**: Full installation via `npm install` (React 19, Vite 6, TypeScript 5.8, TailwindCSS v4, DaisyUI, Lucide React, Framer Motion, Axios).
- **Code Fixes & Build Verification**:
  - Cleaned up unused React imports in context modules for strict TypeScript compilation.
  - Verified production build via `npm run build`.
- **Branding & UI Customization**:
  - Updated landing hero to **"Welcome to GuLLack"**.
  - Added subtitle **"Project created by Roneet Bala"**.
  - Updated application title in `index.html` to **GuLLack**.
  - Configured Light/Dark mode toggling.

---

## 📂 Project Structure

```text
FinTechapp/
├── backend/
│   ├── manage.py               # Django management utility
│   ├── db.sqlite3              # SQLite database
│   ├── requirements.txt        # Backend dependencies
│   ├── .env                    # Backend secrets & config
│   ├── .gitignore              # Ignores venv/, media/, __pycache__/
│   ├── venv/                   # Python virtual environment (local)
│   ├── backend/                # Project configuration (settings, urls, wsgi)
│   └── userauths/              # User model, authentication views & serializers
│
├── frontend/
│   ├── index.html              # HTML entry point (Title: GuLLack)
│   ├── package.json            # Node dependencies and scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS styling config
│   ├── .env                    # API endpoint configuration
│   ├── .gitignore              # Ignores node_modules/, dist/, logs
│   ├── node_modules/           # Installed npm packages (local)
│   └── src/
│       ├── App.tsx             # Main application component
│       ├── main.tsx            # React DOM mounting
│       ├── layout/             # Header, Navigation, and Theme toggles
│       ├── libs/               # Axios apiClient with JWT interceptors
│       ├── pages/base/Index.tsx# Landing page (Welcome to GuLLack)
│       └── routes/             # App route definitions
│
└── README.md                   # Project documentation & status
```

---

## 🚀 How to Run the Application

### 1️⃣ Start the Backend Server (Terminal 1)

```bash
cd backend

# Activate virtual environment (macOS/Linux)
source venv/bin/activate
# (Windows: venv\Scripts\activate)

# Ensure dependencies & migrations are ready
pip install -r requirements.txt
python manage.py migrate

# Start the Django server
python manage.py runserver
```
👉 Django API is live at: `http://127.0.0.1:8000/api/`  
👉 Django Admin is live at: `http://127.0.0.1:8000/admin/`

---

### 2️⃣ Start the Frontend Dev Server (Terminal 2)

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```
👉 Frontend is live at: `http://127.0.0.1:5173/`

---

## 🔐 API & Authentication Endpoints

The frontend connects to the backend through [frontend/src/libs/apiClient.ts](file:///Users/apple/Desktop/omi/FinTechapp/frontend/src/libs/apiClient.ts) using `VITE_API_URL=http://127.0.0.1:8000/api/v1/`:

- `POST /api/v1/user/register/` — Register a new user
- `POST /api/v1/user/login/` — Login and obtain JWT access & refresh tokens
- `POST /api/v1/user/token/refresh/` — Refresh access token
- `POST /api/v1/user/logout/` — Invalidate user token session
