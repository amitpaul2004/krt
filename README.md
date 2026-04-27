# SkillSprint v2.0 - Full-Stack Implementation

SkillSprint is now a full-stack platform with a Node.js backend and MongoDB database integration. Follow these steps to get everything running.

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have Node.js installed. Open your terminal in the project directory (`d:\krt`) and run:
```bash
npm install
```
*(Note: I have already initialized the package.json with express, mongoose, cors, bcryptjs, and jsonwebtoken.)*

### 2. Start the Backend Server
The server handles your authentication and database storage.
```bash
node server.js
```
You should see: `✅ MongoDB Connected` and `🚀 Server running on port 5000`.

### 3. Launch the Application
Simply open `index.html` in your browser (via Live Server or just double-clicking the file).

---

## 🛠️ How to Use

1.  **Sign Up:** Go to the landing page and click "Sign Up". Create a new account. Your details are now stored in **MongoDB**.
2.  **Configure Profile:** After signing up, you will be taken to the **Profile Form**. Fill in your CGPA, Branch, Skills, and Interests. Click "Launch Dashboard".
3.  **Explore Dashboard:** View your personalized skill gaps and trajectory mindmap. 
4.  **AI Detailed Plan:** Click "AI Detailed Plan" on the dashboard. The system will analyze your real skills from the database and generate a custom 6-week roadmap using Gemini 1.5.
5.  **Persistence:** You can now log out and log back in. Your profile and progress will be waiting for you!

## 📂 Project Structure
- `server.js`: The Express backend logic.
- `models/`: MongoDB database schemas (User & Profile).
- `app.js`: Frontend logic updated for API integration.
- `.env`: Contains your MongoDB connection string and Gemini API Key.

---
**Build for the future of placement. - SkillSprint Team**
