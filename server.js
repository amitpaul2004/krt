const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Profile = require('./models/Profile');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Auth Routes ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'skill_sprint_secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Profile Routes ---

// Get Profile
app.get('/api/profile/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save/Update Profile
app.post('/api/profile', async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;
        let profile = await Profile.findOneAndUpdate(
            { userId },
            { ...profileData, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AI Analysis Route ---
app.post('/api/ai/analyze', async (req, res) => {
    try {
        const { userData } = req.body;
        const prompt = `Act as an expert placement officer. Analyze this student:
        Name: ${userData.name}, Branch: ${userData.branch}, Skills: ${userData.techSkills}, Tools: ${userData.tools}, Interests: ${userData.interests.join(', ')}.
        
        1. Recommend 3 top companies with compatibility % and required stack.
        2. Create a 3-phase trajectory mindmap (Foundation, Intermediate, Advanced) with 3 tasks each.
        
        Return ONLY valid JSON in this format:
        {
          "companies": [{"name": "...", "role": "...", "score": 85, "stack": ["...", "..."], "icon": "bi-building"}],
          "mindmap": [
            {"phase": "Foundation", "duration": "Wk 1-4", "tasks": ["...", "...", "..."]},
            {"phase": "Intermediate", "duration": "Wk 5-8", "tasks": ["...", "...", "..."]},
            {"phase": "Advanced", "duration": "Wk 9-12", "tasks": ["...", "...", "..."]}
          ]
        }`;

        console.log('--- AI Analysis Start ---');
        console.log('Using API Key:', process.env.API_KEY ? 'Present' : 'MISSING');
        
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await aiResponse.json();
        console.log('AI Response Received');
        
        let result;
        try {
            const aiText = data.candidates[0].content.parts[0].text;
            console.log('AI Text Length:', aiText.length);
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
                console.log('JSON Parsed Successfully');
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (e) {
            console.error('AI Processing Error, using fallback:', e.message);
            result = {
                companies: [
                    { name: "Google", role: "Software Engineer", score: 85, stack: ["React", "DSA", "System Design"], icon: "bi-google" },
                    { name: "Microsoft", role: "SDE 1", score: 78, stack: ["C#", "DSA", "Cloud"], icon: "bi-microsoft" },
                    { name: "Amazon", role: "SDE Intern", score: 65, stack: ["Java", "AWS", "OOD"], icon: "bi-amazon" }
                ],
                mindmap: [
                    { phase: "Foundation", duration: "Wk 1-4", tasks: ["Data Structures", "Object-Oriented Design", "Time/Space Complexity"] },
                    { phase: "Intermediate", duration: "Wk 5-8", tasks: ["Core Frameworks", "2 Full-Stack Projects", "Database Tuning"] },
                    { phase: "Advanced", duration: "Wk 9-12", tasks: ["System Design Basics", "Mock Interviews", "Resume Polish"] }
                ]
            };
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
