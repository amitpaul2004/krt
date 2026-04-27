const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Profile = require('./models/Profile');

const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, './')));

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
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save/Update Profile (Handles both /api/profile and /api/profile/save)
app.post(['/api/profile', '/api/profile/save'], async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        let profile = await Profile.findOneAndUpdate(
            { userId },
            { ...profileData, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        console.log(`💾 Profile Synced for User: ${userId}`);
        res.json(profile);
    } catch (err) {
        console.error('❌ Profile Save Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- AI Analysis Route ---
app.post('/api/ai/analyze', async (req, res) => {
    try {
        const { userData } = req.body;
        console.log('--- AI Analysis Start ---');
        console.log('Analyzing Profile for:', userData.name);
        
        // Map user fields to AI prompt terms
        const prompt = `Act as an expert placement officer. Analyze this student:
        - Technical Arsenal: ${userData.techSkills}, Tools: ${userData.tools}
        - Academic Performance (CGPA): ${userData.cgpa}
        - Stream/Branch: ${userData.branch}
        - Target Roles: ${userData.interests.join(', ')}
        
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

        // --- Hybrid Intelligence Engine ---
        const localCompanyDB = [
            { name: "Google", roles: ["SDE", "Cloud Engineer"], minCGPA: 8.5, tech: ["Java", "Python", "React", "Go"], logo: "https://logo.clearbit.com/google.com", score: 95 },
            { name: "Microsoft", roles: ["Software Engineer", "Frontend Dev"], minCGPA: 8.0, tech: ["C#", "React", "Azure", "JavaScript"], logo: "https://logo.clearbit.com/microsoft.com", score: 92 },
            { name: "Amazon", roles: ["SDE Intern", "Cloud Architect"], minCGPA: 7.5, tech: ["Java", "AWS", "NoSQL", "Python"], logo: "https://logo.clearbit.com/amazon.com", score: 88 },
            { name: "TCS", roles: ["Systems Engineer", "Ninja Dev"], minCGPA: 6.0, tech: ["C", "C++", "Java", "SQL"], logo: "https://logo.clearbit.com/tcs.com", score: 75 },
            { name: "Infosys", roles: ["Power Programmer", "Systems Engineer"], minCGPA: 6.0, tech: ["Java", ".NET", "Python", "Cloud"], logo: "https://logo.clearbit.com/infosys.com", score: 72 },
            { name: "Adobe", roles: ["Product Engineer", "UI Developer"], minCGPA: 8.0, tech: ["JavaScript", "C++", "React", "System Design"], logo: "https://logo.clearbit.com/adobe.com", score: 90 },
            { name: "Netflix", roles: ["Full Stack Dev", "Backend Engineer"], minCGPA: 8.5, tech: ["Java", "React", "Node.js", "Kafka"], logo: "https://logo.clearbit.com/netflix.com", score: 94 },
            { name: "Meta", roles: ["Frontend Engineer", "Product Dev"], minCGPA: 8.0, tech: ["React", "PHP", "Python", "TypeScript"], logo: "https://logo.clearbit.com/meta.com", score: 93 }
        ];

        const modelsToTry = [
            'v1beta/models/gemini-1.5-flash',
            'v1/models/gemini-pro',
            'v1beta/models/gemini-1.5-pro'
        ];

        let aiData = null;
        for (const modelPath of modelsToTry) {
            try {
                const url = `https://generativelanguage.googleapis.com/${modelPath}:generateContent?key=${process.env.API_KEY}`;
                console.log(`📡 Probing Hybrid Engine: ${modelPath}...`);
                
                const aiResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                const tempRes = await aiResponse.json();
                if (tempRes.candidates && tempRes.candidates[0]) {
                    aiData = tempRes;
                    console.log(`✅ AI Sync Successful: ${modelPath}`);
                    break;
                }
            } catch (err) { /* Silent fail to next model */ }
        }

        let result;
        if (aiData) {
            try {
                const aiText = aiData.candidates[0].content.parts[0].text;
                const jsonMatch = aiText.match(/\{[\s\S]*\}/);
                if (jsonMatch) result = JSON.parse(jsonMatch[0]);
            } catch (e) { console.error('AI Parse Failed'); }
        }

        // --- Local Reasoning Fallback (If AI fails or returns empty) ---
        if (!result || !result.companies || result.companies.length === 0) {
            console.log('🚀 Running Local Reasoning Engine...');
            const userSkills = (userData.techSkills + "," + userData.tools).toLowerCase();
            const userCGPA = parseFloat(userData.cgpa) || 7.0;

            const matches = localCompanyDB
                .filter(c => userCGPA >= c.minCGPA - 0.5) // Slight leniency
                .map(c => {
                    let skillMatchCount = c.tech.filter(s => userSkills.includes(s.toLowerCase())).length;
                    let matchScore = Math.min(c.score, 60 + (skillMatchCount * 10));
                    return {
                        name: c.name,
                        role: c.roles[Math.floor(Math.random() * c.roles.length)],
                        score: matchScore,
                        stack: c.tech,
                        icon: `bi-building`
                    };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            // --- Dynamic Mindmap Generation based on Target Roles ---
            const targetRole = userData.interests && userData.interests[0] ? userData.interests[0] : "Software Development";
            const isHighCGPA = userCGPA >= 8.5;

            result = {
                companies: matches.length > 0 ? matches : [
                    { name: "Global Tech", role: "Software Intern", score: 70, stack: ["HTML", "CSS", "JS"], icon: "bi-globe" },
                    { name: "InnoSoft", role: "Junior Dev", score: 65, stack: ["Python", "SQL"], icon: "bi-cpu" }
                ],
                mindmap: [
                    { 
                        phase: "Foundation", 
                        duration: "Wk 1-4", 
                        tasks: [
                            `Master core concepts for ${targetRole}`, 
                            "Strengthen DSA fundamentals", 
                            "Build 2 portfolio-ready projects"
                        ] 
                    },
                    { 
                        phase: "Acceleration", 
                        duration: "Wk 5-8", 
                        tasks: [
                            `Deep dive into ${matches[0] ? matches[0].stack.slice(0,2).join(', ') : 'Modern Frameworks'}`,
                            "Practice 50+ medium-level coding challenges",
                            "Optimize LinkedIn and Resume for Tech roles"
                        ] 
                    },
                    { 
                        phase: "Final Push", 
                        duration: "Wk 9-12", 
                        tasks: [
                            isHighCGPA ? "Targeting high-package MAANG interviews" : "Focusing on Product-based company rounds",
                            "Mock interviews and soft-skill workshops",
                            "Final portfolio deployment and networking"
                        ] 
                    }
                ]
            };
        }

        console.log(`📤 Dispatching Analysis: Found ${result.companies.length} Optimal Matches.`);
        res.json(result);
    } catch (err) {
        console.error('❌ Hybrid Route Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- Final Catch-all for Frontend ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
