document.addEventListener('DOMContentLoaded', async () => {
    
    const API_URL = 'http://localhost:5000/api';
    
    // Get logged in user from localStorage
    const getAuthUser = () => {
        const user = localStorage.getItem('skillSprintUser');
        return user ? JSON.parse(user) : null;
    };

    const authUser = getAuthUser();
    const isLoggedIn = !!authUser;
    
    // --- Scroll Progress Tracker ---
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // --- Background Data Particles ---
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float-particle ${Math.random() * 10 + 10}s linear infinite`;
            particle.style.animationDelay = Math.random() * 5 + 's';
            particleContainer.appendChild(particle);
        }
    }

    // --- Mouse Parallax for Tech Nodes ---
    const techNodes = document.querySelectorAll('.tech-node');
    if (techNodes.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            techNodes.forEach(node => {
                const depth = node.getAttribute('data-depth') || 0.1;
                const moveX = (window.innerWidth / 2 - clientX) * depth;
                const moveY = (window.innerHeight / 2 - clientY) * depth;
                node.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // --- Cinematic Logout Logic ---
    window.performLogout = (redirectUrl = 'index.html') => {
        const overlay = document.createElement('div');
        overlay.id = 'logout-overlay';
        overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none';
        overlay.innerHTML = `
            <div class="relative flex flex-col items-center">
                <div class="relative w-32 h-32 mb-8">
                    <div class="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                    <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    <div class="absolute inset-4 rounded-full border-2 border-sky-400 border-b-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="bi bi-shield-lock-fill text-4xl text-indigo-500 animate-pulse"></i>
                    </div>
                </div>
                <h2 class="text-2xl font-black text-white tracking-widest uppercase mb-2">De-authenticating</h2>
                <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <p class="text-indigo-200/60 font-mono text-xs mt-6 tracking-widest">SECURE_SESSION_TERMINATING...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.classList.remove('pointer-events-none');
            overlay.classList.add('opacity-100');
        });
        setTimeout(() => {
            localStorage.removeItem('skillSprintUser');
            localStorage.removeItem('skillSprintToken');
            window.location.href = redirectUrl;
        }, 2200);
    };

    // --- Video Modal Logic ---
    window.openVideoModal = () => {
        const modal = document.getElementById('video-modal');
        const video = document.getElementById('how-it-works-video');
        if (modal && video) {
            modal.classList.remove('hidden');
            video.play();
        }
    };
    window.closeVideoModal = () => {
        const modal = document.getElementById('video-modal');
        const video = document.getElementById('how-it-works-video');
        if (modal && video) {
            modal.classList.add('hidden');
            video.pause();
            video.currentTime = 0;
        }
    };

    // --- Scroll Animations (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3D Hover Effect ---
    const heroCard = document.querySelector('.hero-3d-card');
    if(heroCard) {
        document.addEventListener('mousemove', (e) => {
            let xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            let yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        document.addEventListener('mouseleave', () => {
            heroCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }

    // --- Navbar logic ---
    const nav = document.getElementById('main-nav');
    if(nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md', 'bg-white/80');
            } else {
                nav.classList.remove('shadow-md', 'bg-white/80');
            }
        });
    }

    // --- Utility: Fetch Profile ---
    const getSavedData = async () => {
        if (!authUser) return null;
        try {
            const response = await fetch(`${API_URL}/profile/${authUser.id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (e) {
            console.error('API Fetch Error:', e);
            return null;
        }
    };

    // --- Page Specific Logic ---
    const studentForm = document.getElementById('student-form');
    if (studentForm && authUser) {
        try {
            const data = await getSavedData();
            if (data) {
                if(document.getElementById('name')) document.getElementById('name').value = data.name || '';
                if(document.getElementById('cgpa')) document.getElementById('cgpa').value = data.cgpa || '';
                if(document.getElementById('branch')) document.getElementById('branch').value = data.branch || '';
                if(document.getElementById('year')) document.getElementById('year').value = data.year || '';
                if(document.getElementById('tech-skills')) document.getElementById('tech-skills').value = data.techSkills || '';
                if(document.getElementById('tools')) document.getElementById('tools').value = data.tools || '';
                if (data.interests) {
                    data.interests.forEach(interest => {
                        const cb = document.querySelector(`input[name="interests"][value="${interest}"]`);
                        if (cb) cb.checked = true;
                    });
                }
            }
        } catch(e) {}

        const gatherFormData = () => {
            const interests = [];
            document.querySelectorAll('input[name="interests"]:checked').forEach(cb => interests.push(cb.value));
            return {
                name: document.getElementById('name').value,
                cgpa: document.getElementById('cgpa').value,
                branch: document.getElementById('branch').value,
                year: document.getElementById('year').value,
                techSkills: document.getElementById('tech-skills').value,
                tools: document.getElementById('tools').value,
                interests: interests
            };
        };

        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await fetch(`${API_URL}/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...gatherFormData(), userId: authUser.id })
                });
                window.location.href = 'dashboard.html';
            } catch (err) { alert('Save failed.'); }
        });
    }

    const dashboardContainer = document.getElementById('dashboard-data');
    if (dashboardContainer && authUser) {
        console.log('Dashboard Initializing... Time:', new Date().toLocaleTimeString());
        const data = await getSavedData();
        
        const showErrorState = () => {
            const containers = ['company-matches-container', 'mindmap-container'];
            containers.forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    el.innerHTML = `
                        <div class="col-span-full py-10 text-center">
                            <div class="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100 max-w-md mx-auto shadow-lg">
                                <i class="bi bi-hdd-network-fill text-4xl mb-3 block"></i>
                                <h4 class="font-black mb-1">Database Connection Lost</h4>
                                <p class="text-xs font-medium opacity-80 mb-4 tracking-wide">The backend server (server.js) is not responding. Please ensure you have run <code class="bg-rose-100 px-2 py-0.5 rounded">node server.js</code> in your terminal.</p>
                                <button onclick="window.location.reload()" class="px-8 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-200 hover:scale-105 active:scale-95 transition-all">
                                    Refresh Connection
                                </button>
                            </div>
                        </div>
                    `;
                }
            });
        };

        if (data) {
            // Update Headers
            if(data.name && document.getElementById('dash-name')) document.getElementById('dash-name').textContent = data.name.split(' ')[0];
            if(document.getElementById('dash-cgpa')) document.getElementById('dash-cgpa').textContent = data.cgpa || 'N/A';
            if(document.getElementById('dash-branch')) document.getElementById('dash-branch').textContent = data.branch || 'N/A';

            // Skill Gap Logic
            const userSkills = ((data.techSkills || '') + ',' + (data.tools || '')).toLowerCase().split(',').map(s => s.trim()).filter(s => s);
            let requiredSkills = ['javascript', 'python', 'sql', 'dsa', 'git'];
            if (data.interests) {
                if (data.interests.includes('AI/ML')) requiredSkills.push('machine learning', 'tensorflow');
                if (data.interests.includes('Web Dev')) requiredSkills.push('react', 'node.js');
            }
            requiredSkills = [...new Set(requiredSkills)];
            const skillsHave = requiredSkills.filter(req => userSkills.some(u => u.includes(req)));
            const skillsMissing = requiredSkills.filter(req => !userSkills.some(u => u.includes(req)));

            if (document.getElementById('skills-have')) {
                document.getElementById('skills-have').innerHTML = skillsHave.map(s => `<span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">${s}</span>`).join('');
            }
            if (document.getElementById('skills-missing')) {
                document.getElementById('skills-missing').innerHTML = skillsMissing.map(s => `<span class="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-100">${s}</span>`).join('');
            }

            // --- Real AI Analysis Integration ---
            const fetchAIAnalysis = async () => {
                try {
                    const response = await fetch(`${API_URL}/ai/analyze`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userData: data })
                    });
                    if (!response.ok) throw new Error('API Error');
                    const aiData = await response.json();
                    
                    // Render Companies
                    const companyContainer = document.getElementById('company-matches-container');
                    if(companyContainer && aiData.companies) {
                        companyContainer.innerHTML = aiData.companies.map((c, i) => `
                            <div class="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-lg shadow-slate-200/50 hover-lift relative overflow-hidden group reveal-scale" style="animation-delay: ${i * 0.1}s">
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div class="relative z-10">
                                    <div class="flex items-center justify-between mb-6">
                                        <div class="flex items-center gap-4">
                                            <div class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                <i class="bi ${c.icon || 'bi-building'}"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-black text-2xl text-slate-800">${c.name}</h3>
                                                <p class="text-sm font-bold text-slate-400">${c.role}</p>
                                            </div>
                                        </div>
                                        <span class="bg-emerald-100 text-emerald-700 text-lg font-black px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm flex items-center gap-2">
                                            <i class="bi bi-fire text-orange-500"></i> ${c.score}%
                                        </span>
                                    </div>
                                    <div class="mt-6">
                                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Required Tech Stack</p>
                                        <div class="flex flex-wrap gap-2">
                                            ${c.stack.map(s => `<span class="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm">${s}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }

                    // Render Mindmap
                    const mmContainer = document.getElementById('mindmap-container');
                    if(mmContainer && aiData.mindmap) {
                        let mmHTML = `
                            <div class="flex items-center min-w-max px-4">
                                <div class="relative group z-20">
                                    <button onclick="toggleMindmapNode(event, 'level-2-phases')" class="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black px-8 py-5 rounded-2xl shadow-xl shadow-indigo-300 hover:scale-105 transition-all flex items-center gap-3 border-2 border-white/50 ring-4 ring-indigo-50 outline-none hover:ring-indigo-100">
                                        <i class="bi bi-dash-circle text-xl transition-transform duration-300"></i> <span class="text-xl">Your Journey</span>
                                    </button>
                                </div>
                                <div id="level-2-phases" class="mm-node-wrapper flex flex-col gap-12 relative pl-12 z-10">
                                    <div class="mm-line-h absolute -left-12 w-12 h-[3px] bg-indigo-200"></div>
                                    <div class="mm-line-v absolute left-0 top-[2.5rem] bottom-[2.5rem] w-[4px] bg-indigo-200 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]"></div>
                        `;

                        aiData.mindmap.forEach((phase, idx) => {
                            const phaseId = `phase-${idx}-children`;
                            mmHTML += `
                                <div class="mm-leaf relative flex items-center">
                                    <div class="absolute left-0 w-8 h-[3px] bg-indigo-300"></div>
                                    <button onclick="toggleMindmapNode(event, '${phaseId}')" class="bg-white border-2 border-indigo-200 text-slate-700 font-bold px-6 py-4 rounded-xl shadow-md hover:border-indigo-400 hover:shadow-lg transition-all flex items-center gap-3 group outline-none ml-8 z-20 hover:-translate-y-1 w-64 justify-between">
                                        <div class="flex items-center gap-2">
                                            <i class="bi bi-dash-circle text-indigo-500 text-lg transition-transform"></i> 
                                            <span class="text-lg">${phase.phase}</span>
                                        </div>
                                        <span class="text-xs font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">${phase.duration}</span>
                                    </button>
                                    <div id="${phaseId}" class="mm-node-wrapper flex flex-col gap-4 relative pl-12 z-10">
                                        <div class="mm-line-h absolute -left-12 w-12 h-[3px] bg-indigo-200"></div>
                                        <div class="mm-line-v absolute left-0 top-[1.5rem] bottom-[1.5rem] w-[3px] bg-indigo-200 rounded-full"></div>
                                        ${phase.tasks.map(task => `
                                            <label class="mm-leaf relative flex items-center gap-3 bg-white border border-slate-200 p-3 pr-6 rounded-xl shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all hover:-translate-y-0.5 w-max group/chk ml-8">
                                                <div class="absolute -left-8 w-8 h-[3px] bg-indigo-200"></div>
                                                <input type="checkbox" class="mm-checkbox w-5 h-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 cursor-pointer">
                                                <span class="font-bold text-slate-700">${task}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        });

                        mmHTML += `</div></div>`;
                        mmContainer.innerHTML = mmHTML;
                    }
                } catch (e) { 
                    console.error('AI Analysis Error:', e);
                    showErrorState();
                }
            };
            fetchAIAnalysis();
        } else {
            showErrorState();
        }
    }

    // --- Auth Header Sync ---
    const authContainer = document.getElementById('nav-auth-container');
    if (isLoggedIn && authContainer) {
        const data = await getSavedData();
        const displayUsername = data && data.name ? data.name : authUser.username;
        const initials = displayUsername.substring(0, 2).toUpperCase();
        
        authContainer.innerHTML = `
            <a href="dashboard.html" class="px-5 py-2.5 bg-indigo-50 rounded-xl text-indigo-600 font-bold text-sm flex items-center gap-2">
                <i class="bi bi-grid-1x2-fill"></i> Dashboard
            </a>
            <div class="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold relative group cursor-pointer">
                ${initials}
                <div class="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                    <p class="px-3 py-2 text-xs font-bold text-slate-400 border-b border-slate-50 mb-1">${displayUsername}</p>
                    <a href="form.html" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 rounded-lg"><i class="bi bi-person"></i> Profile</a>
                    <button onclick="performLogout()" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"><i class="bi bi-box-arrow-right"></i> Logout</button>
                </div>
            </div>
        `;
    }

    // --- CTA Sync ---
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.href = isLoggedIn ? "form.html" : "login.html";
        const ctaText = document.getElementById('cta-text');
        if(ctaText && isLoggedIn) ctaText.textContent = "Edit My Profile";
    }

    // --- Form Submission Logic ---
    const handleAuthSubmit = (formId, isSignup = false) => {
        const form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Processing...';
            
            const data = Object.fromEntries(new FormData(form).entries());
            try {
                const res = await fetch(`${API_URL}/auth/${isSignup ? 'signup' : 'login'}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error);
                
                if (!isSignup) {
                    localStorage.setItem('skillSprintToken', result.token);
                    localStorage.setItem('skillSprintUser', JSON.stringify(result.user));
                    window.location.href = 'form.html';
                } else {
                    // Celebration Pop up for Signup
                    showSuccessPopup('Account Created!', 'Welcome to the Squad. Redirecting to Login...', () => {
                        window.location.href = 'login.html';
                    });
                }
            } catch (err) {
                alert(err.message);
                btn.disabled = false;
                btn.innerHTML = isSignup ? 'Create Account' : 'Login';
            }
        });
    };

    window.showSuccessPopup = (title, message, callback) => {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/80 backdrop-blur-3xl opacity-0 transition-opacity duration-700';
        popup.innerHTML = `
            <div class="relative max-w-sm w-full mx-4 transform scale-90 transition-all duration-700">
                <!-- Outer Glow Aura -->
                <div class="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                
                <!-- Main Glass Card -->
                <div class="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[3.5rem] shadow-[0_0_80px_rgba(79,70,229,0.3)] text-center overflow-hidden">
                    <!-- Tech Confetti Particles -->
                    <div class="absolute inset-0 pointer-events-none opacity-50">
                        <div class="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                        <div class="absolute bottom-10 right-20 w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping [animation-delay:1s]"></div>
                        <div class="absolute top-20 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping [animation-delay:0.5s]"></div>
                    </div>

                    <!-- Animated HUD Checkmark -->
                    <div class="relative w-32 h-32 mx-auto mb-8">
                        <div class="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                        <div class="absolute inset-2 bg-emerald-500/30 rounded-full animate-pulse"></div>
                        <div class="absolute inset-0 flex items-center justify-center text-6xl text-emerald-400">
                            <i class="bi bi-shield-check-fill drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]"></i>
                        </div>
                        <!-- Rotating Ring -->
                        <svg class="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="60" stroke="white" stroke-width="2" fill="transparent" stroke-dasharray="377" stroke-dashoffset="377" class="animate-[draw_1.5s_ease-out_forwards] opacity-20"></circle>
                        </svg>
                    </div>

                    <h3 class="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">${title}</h3>
                    <p class="text-indigo-100/70 font-medium leading-relaxed text-lg mb-8">${message}</p>
                    
                    <!-- Progress Loader HUD -->
                    <div class="relative h-1.5 bg-white/10 rounded-full overflow-hidden w-48 mx-auto">
                        <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-sky-400 animate-[progress_2s_ease-in-out_forwards]"></div>
                    </div>
                    <p class="text-[10px] font-mono text-indigo-300/50 mt-4 tracking-[0.3em] uppercase">Initializing_Secure_Protocol</p>
                </div>
            </div>
            <style>
                @keyframes draw { to { stroke-dashoffset: 0; } }
                @keyframes progress { from { width: 0%; } to { width: 100%; } }
            </style>
        `;
        document.body.appendChild(popup);
        
        requestAnimationFrame(() => {
            popup.classList.add('opacity-100');
            popup.querySelector('div').classList.replace('scale-90', 'scale-100');
        });

        setTimeout(() => {
            popup.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                popup.remove();
                if(callback) callback();
            }, 700);
        }, 2800);
    };
    handleAuthSubmit('login-form');
    handleAuthSubmit('signup-form', true);

    // --- Password Visibility Toggle ---
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.password-toggle');
        if (toggle) {
            const input = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        }
    });
});
