# 🚀 SkillSprint

> A futuristic AI-powered career and placement preparation platform that helps students understand their skill gaps, discover suitable target companies, and generate personalized learning roadmaps.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://krt-mb45.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📌 About the Project

SkillSprint is a full-stack student career-preparation platform built around a **hybrid intelligence approach**.

Students can create a profile containing their academic information, technical skills, tools, interests, and target roles. The platform then combines a **Google Gemini-powered analysis layer** with a **local rule-based fallback engine** to produce company recommendations, compatibility scores, skill-gap insights, and a staged preparation roadmap.

The project uses a lightweight vanilla frontend and a Node.js/Express backend, with MongoDB and Mongoose for persistence.

## ✨ Key Features

- 🔐 **Authentication** – Signup/login flow with password hashing using `bcryptjs` and JWT-based authentication.
- 👤 **Profile Management** – Store and update academic details, skills, tools, interests, and career targets.
- 🤖 **Hybrid AI Analysis** – Uses Google Gemini for AI-generated career analysis, with a local reasoning fallback when the AI service is unavailable.
- 🏢 **Company Matching** – Compares student skills and CGPA against a built-in company/role dataset.
- 📊 **Skill Gap Analysis** – Highlights relevant skills and areas that need improvement.
- 🧠 **Trajectory Mindmap** – Generates Foundation, Acceleration, and Final Push phases with actionable learning tasks.
- 📚 **Personalized Syllabus** – Produces a structured preparation plan based on the student's target role and missing skills.
- 🎨 **Modern UI** – Glassmorphism, responsive layouts, animations, hover effects, particles, parallax interactions, and theme-aware design.
- 📱 **Mobile-ready architecture** – The project can be wrapped for Android/iOS using Capacitor when the native folders/configuration are added.
- 🌐 **Single Express Server** – Backend APIs and static frontend files are served from the same Node.js application.

---

## 🧰 Technology Stack

### Frontend

| Technology | Usage |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Custom styling, responsive layouts, animations and visual effects |
| **JavaScript (ES6+)** | Frontend logic, API calls, DOM manipulation and interactive UI |
| **Tailwind CSS CDN** | Utility-first UI styling used directly from the browser |
| **Bootstrap Icons** | UI icons and visual indicators |
| **Fetch API** | Communication with backend REST endpoints |
| **Browser APIs** | Local interactions, animations, storage/download helpers and responsive behavior |

### Backend

| Technology | Usage |
|---|---|
| **Node.js** | JavaScript runtime for the server |
| **Express.js** | REST API, middleware and static-file serving |
| **Mongoose** | MongoDB object modeling and database access |
| **MongoDB** | User and profile data persistence |
| **bcryptjs** | Password hashing and credential verification |
| **jsonwebtoken (JWT)** | Token generation for authentication |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |

### AI & Logic

| Technology / Technique | Usage |
|---|---|
| **Google Gemini API** | AI-powered student profile and career analysis |
| **Prompt Engineering** | Structured prompts for company matching and roadmap generation |
| **Hybrid Intelligence** | AI output + deterministic local fallback reasoning |
| **Rule-based Scoring** | Skill/CGPA compatibility calculations in the local engine |
| **JSON Parsing** | Converts AI responses into structured dashboard data |

### Engineering Techniques

- RESTful API design
- MVC-style separation with Mongoose models
- Async/await and promise-based server operations
- Middleware-based request processing
- Environment-based configuration
- Responsive web design
- Progressive enhancement for interactive UI
- Client-side DOM event handling
- Dynamic data rendering
- Fallback/error-tolerant AI architecture
- Static asset serving with Express

---

## 📂 Project Structure

```text
krt/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Registration page
├── form.html               # Student profile/skill setup form
├── dashboard.html          # AI placement dashboard
├── app.js                  # Frontend interactions and API integration
├── script.js               # Additional frontend logic
├── style.css               # Custom styles and animations
│
├── server.js               # Express server, REST APIs and AI engine
│
├── models/
│   ├── User.js             # User schema
│   └── Profile.js          # Profile schema
│
├── assests/
│   ├── image.png           # Project/favicon image
│   └── Recording ...mp4    # Demo/media asset
│
├── package.json            # Dependencies and npm scripts
├── package-lock.json       # Locked dependency versions
└── README.md               # Project documentation
```

> Note: The repository currently uses the `assests/` directory name exactly as committed. Do not change it to `assets/` unless you also update the references in the frontend.

---

## ⚙️ Prerequisites

Before running the project locally, install:

- **Node.js 18+** – [Download Node.js](https://nodejs.org/)
- **MongoDB** – either a local MongoDB server or a MongoDB Atlas cluster
- A modern browser such as Chrome, Edge, Firefox, or Safari
- A **Google Gemini API key** for AI-powered analysis

---

## 🚀 How to Start the Project

### 1. Clone the repository

```bash
git clone https://github.com/amitpaul2004/krt.git
cd krt
```

### 2. Install dependencies

```bash
npm install
```

The project uses the following main backend packages: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, and `dotenv`.

### 3. Create the environment file

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
API_KEY=your_google_gemini_api_key
PORT=5000
```

For local MongoDB, you can use a connection string similar to:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/skillsprint
```

### 4. Start the application

Using the npm script:

```bash
npm start
```

Or directly:

```bash
node server.js
```

### 5. Open the application

Visit:

```text
http://localhost:5000
```

Because Express serves the frontend files from the project root, you do **not** need a separate frontend server for normal local usage.

### 6. Verify the backend

When the server starts successfully, the terminal should show the server running on the configured port. If MongoDB is available, you should also see a successful MongoDB connection message.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `API_KEY` | Yes for Gemini | Google Gemini API key |
| `PORT` | No | Server port; defaults to `5000` |

Never commit `.env` or API keys to GitHub.

---

## 🔌 Main API Endpoints

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Profile

```text
GET  /api/profile/:userId
POST /api/profile
POST /api/profile/save
```

### AI Analysis

```text
POST /api/ai/analyze
```

The AI endpoint accepts profile information such as technical skills, tools, CGPA, branch, and target interests, then returns structured company recommendations and a learning trajectory.

---

## 🧠 How the Hybrid AI Engine Works

```text
Student Profile
      │
      ▼
Express API
      │
      ▼
Gemini Prompt Builder
      │
      ├──────────────► Google Gemini API
      │                      │
      │                      ▼
      │                Structured AI Output
      │
      └──────────────► Local Reasoning Engine
                             │
                             ▼
                    Company + Skill Matching
      │
      ▼
Dashboard Response
```

The backend first attempts AI-powered generation. If the external model is unavailable, returns unusable data, or fails to produce the expected JSON structure, the application falls back to its local company database and rule-based scoring logic.

This makes the application more resilient than an AI-only workflow.

---

## 🔐 Security Techniques Used

- Passwords are hashed before storage using `bcryptjs`.
- JWT tokens are used for authentication responses.
- Secrets are loaded through environment variables using `dotenv`.
- Sensitive credentials should remain outside the source code.
- API requests are handled through Express middleware and JSON payload validation logic.

> For production use, move the JWT secret from the source code into an environment variable and add stronger authentication/authorization validation before exposing the system publicly.

---

## 🎨 UI & UX Techniques

SkillSprint uses a visual style focused on a modern technology/career dashboard experience:

- Glassmorphism and translucent panels
- CSS gradients and animated borders
- Scroll-based reveal animations
- 3D cursor/parallax effects
- Hover transformations and tilt interactions
- Particle/background effects
- Responsive layouts for desktop and mobile
- Bootstrap Icons for consistent iconography
- Tailwind CSS utilities for rapid interface styling
- Custom CSS keyframe animations

---

## 🧪 Development Notes

### Run locally

```bash
npm install
npm start
```

### Frontend-only testing

The frontend code contains logic for detecting a local `localhost:5500` development origin and redirecting API requests to `http://localhost:5000/api`. However, the recommended setup is to let Express serve the project so the application runs from a single origin:

```text
http://localhost:5000
```

### Database

The application expects the MongoDB connection string in `MONGODB_URI`. If MongoDB is not reachable, database-backed features such as signup, login, and profile persistence will not work correctly.

---

## 🌍 Deployment

The repository is configured as a Node.js application and currently has a live deployment associated with:

**Live:** https://krt-mb45.onrender.com

For platforms such as Render, configure the environment variables from the **Environment** section and use:

```bash
npm start
```

Make sure the deployment environment provides a reachable MongoDB instance and a valid Gemini API key when AI analysis is required.

---

## 📈 Future Improvements

- Refresh Gemini model names and API integration to match the latest Google AI SDK/API recommendations.
- Move the JWT secret to `JWT_SECRET` in `.env`.
- Add request validation with a schema library such as Zod/Joi.
- Add automated tests for authentication, profile APIs, and AI fallback behavior.
- Add rate limiting and stronger production security headers.
- Add role-based access control and protected middleware for private routes.
- Add a dedicated frontend build system such as Vite when the project grows.
- Add CI/CD with GitHub Actions.
- Add persistent learning progress and analytics history.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git add .
git commit -m "feat: add your feature"
```

4. Push the branch:

```bash
git push origin feature/your-feature
```

5. Open a Pull Request on GitHub.

---

## 📄 License

The repository currently does not declare an open-source license in `package.json` or the repository metadata. Add an explicit license file before distributing the project as open-source.

---

## 👨‍💻 Project

**SkillSprint** — AI-powered placement preparation and career intelligence platform.

Repository: https://github.com/amitpaul2004/krt

Live Demo: https://krt-mb45.onrender.com
