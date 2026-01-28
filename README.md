# Hear Me Out 🤖💬

Hear Me Out is a full-stack AI-powered chat application that allows users to have meaningful, real-time conversations with an AI assistant.
It features JWT-based authentication, Google OAuth, chat history persistence, and a modern ChatGPT-style UI with full mobile and desktop responsiveness.

---

## 🌐 Live Demo
- 👉 Frontend: https://hear-me-out-red.vercel.app

- 👉 Backend: Hosted separately (Node + Express)


## 🚀 Features

### 🔐 Authentication

- Email & password login
- Google OAuth 2.0 login
- JWT-based authentication
- Protected routes (frontend + backend)
- Persistent login using tokens  

### 💬 Chat System

- Real-time AI chat experience
- Chat history saved in MongoDB
- Multiple chat sessions
- Search & delete chat history
- Smooth typing animation for AI responses  

### 🧠 AI Integration

- AI responses powered via Groq API
- Modular service-based AI architecture

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- React Markdown
- Fetch API
- Vercel (deployment)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- GROQ API
- dotenv
- JWT Authentication

---

## 📁 Project Structure

hear-me-out/
│
├── client/                     # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images & icons
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   └── ChatInput.jsx
│   │   ├── config/
│   │   │   └── api.js           # API base URL
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── OAuthSuccess.jsx
│   │   ├── utils/
│   │   │   └── fetchWithAuth.js # Authenticated fetch helper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── chat.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Chat.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── chat.routes.js
│   │   ├── services/
│   │   │   └── groqService.js
│   │   ├── passport.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

- git clone https://github.com/Ayushsharma1908/hear-me-out.git
- cd hear-me-out

### 2️⃣ Setup Backend

- cd server
- npm install
- npm run dev

### 3️⃣ Setup Frontend

- cd client
- npm install
- npm run dev

---

### Screenshots
![Landing Page](<Screenshot 2026-01-05 204820.png>)

![Sign Up Page](<Screenshot 2026-01-05 204839.png>)

![Home Page](<Screenshot 2026-01-05 204944.png>)

---

## 👨‍💻 Author

### Ayush Kumar Sharma
### 📌 Full-Stack Developer
### 🔗 GitHub: @Ayushsharma1908

