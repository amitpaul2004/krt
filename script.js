/* =============================================
   script.js  —  White Owl Animation
   ============================================= */

/* ── Starfield canvas ─────────────────────── */
(function initStars() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 3800);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        dir:   Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    // Gradient background
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
    grad.addColorStop(0, '#0e1b3a');
    grad.addColorStop(1, '#050a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0.1) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.a})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();
})();

/* ── Floating ambient dots ───────────────── */
(function initFloatingDots() {
  const container = document.getElementById('floatingDots');
  const count = 22;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'fdot';
    const size = Math.random() * 50 + 10;
    d.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      bottom: ${-size}px;
      animation-duration: ${Math.random() * 18 + 10}s;
      animation-delay: ${Math.random() * 14}s;
    `;
    container.appendChild(d);
  }
})();

/* ── MAIN SEQUENCE ───────────────────────── */
const planeWrapper = document.getElementById('planeWrapper');
const paperStage   = document.getElementById('paperStage');
const flatPaper    = document.getElementById('flatPaper');
const panels       = document.querySelectorAll('.panel');
const msgText      = document.getElementById('comingBackText');
const underline    = document.querySelector('.underline-draw');
const tearOverlay  = document.getElementById('tearOverlay');
const nextBtn      = document.getElementById('nextPageBtn');
const prevBtn      = document.getElementById('prevPageBtn');

let currentPage = 0;
const messages = [
  { 
    text: "We Are Coming Back Again", 
    h: { desktop: "280px", tablet: "220px", mobile: "200px" },
    size: { desktop: "2.5rem", tablet: "2rem", mobile: "1.5rem" }
  },
  { 
    text: `"I solemnly swear ... the wait is over." \u2728<br/>
           "Mischief managed?" Not yet. \ud83e\ude84<br/>
           After all this time? \u23f3<br/>
           Always ... the magic returns to the halls. \ud83c\udff0<br/>
           Bigger spells, darker calls \ud83d\udd2e<br/>
           Step in ... or not at all. \ud83d\udd6f\ufe0f`,
    h: { desktop: "440px", tablet: "380px", mobile: "360px" },
    size: { desktop: "1.45rem", tablet: "1rem", mobile: "0.9rem" }
  }
];

/* Trail dots */
let trailInterval = null;
const trailContainer = document.getElementById('trail');
let cachedLetters = []; // Cache for performance!

let lastChimeTime = 0;
function playSoundThrottled(type) {
  const now = Date.now();
  if (type === 'chime' && now - lastChimeTime < 80) return;
  if (type === 'chime') lastChimeTime = now;
  playSound(type);
}

function spawnTrailDot(x) {
  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  dot.style.left = `${x}px`;
  dot.style.top  = `${(Math.random() - 0.5) * 30}px`;
  trailContainer.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
}

/* Ease helpers */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/* ── Animate the plane along a bezier-like path ── */
function animatePlane(from, to, duration, onProgress, onDone) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const rawT    = Math.min(elapsed / duration, 1);
    const t       = easeInOut(rawT);
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    // slight sine wave wobble
    const wobble = Math.sin(rawT * Math.PI * 4) * 18 * (1 - rawT);
    onProgress(x, y + wobble, t);
    if (rawT < 1) {
      requestAnimationFrame(step);
    } else {
      onDone && onDone();
    }
  }
  requestAnimationFrame(step);
}

function setPlanePos(x, y, angle) {
  planeWrapper.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
}


/* ── MAIN SHOW LOGIC ─────────────────────── */
function runSequence() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const startX  = W + 50;           // off bottom right
  const startY  = H + 50;
  const midX    = W * 0.4;          // swoop high up
  const midY    = H * 0.15;
  const loopX   = W * 0.2;          // swoop low left
  const loopY   = H * 0.65;
  
  // Dynamic end position based on wrapper size
  const endX    = W / 2 - planeWrapper.offsetWidth / 2;
  const endY    = H / 2 - planeWrapper.offsetHeight / 2;

  /* 1. Show tear overlay */
  tearOverlay.classList.add('show');

  /* 2. After tiny pause — rip the screen */
  setTimeout(() => {
    tearOverlay.classList.add('ripping');

    /* 3. Once rip opens — plane enters */
    setTimeout(() => {
      tearOverlay.classList.add('hidden');
      tearOverlay.classList.remove('ripping', 'show');

      // Spawn trail every 60ms
      trailInterval = setInterval(() => {
        const rect = planeWrapper.getBoundingClientRect();
        spawnTrailDot(-20);
      }, 60);

      // Phase 1: bottom-right → high-middle
      animatePlane(
        { x: startX, y: startY },
        { x: midX,   y: midY },
        2500,
        (x, y, t) => {
          const angle = -45 + t * 25; // Tilt upwards aggressively then level out
          setPlanePos(x, y, angle);
        },
        () => {
          // Phase 2: loop — swing down left
          animatePlane(
            { x: midX, y: midY },
            { x: loopX, y: loopY },
            1800,
            (x, y, t) => {
              const angle = -20 + t * 45; // Bank to the left
              setPlanePos(x, y, angle);
            },
            () => {
              // Phase 3: spiral into center
              animatePlane(
                { x: loopX, y: loopY },
                { x: endX, y: endY },
                2200,
                (x, y, t) => {
                  const angle = 25 - t * 25; // Level out to 0 degrees for landing
                  setPlanePos(x, y, angle);
                },
                () => {
                  clearInterval(trailInterval);
                  landPlane(endX, endY);
                }
              );
            }
          );
        }
      );
    }, 550);
  }, 350);
}

/* ── Landing + unfold ──────────────────────── */
function landPlane(x, y) {
  // Quick little "settle" bounce
  planeWrapper.style.transition = 'transform 0.35s cubic-bezier(.34,1.56,.64,1)';
  planeWrapper.style.transform  = `translate(${x}px, ${y}px) rotate(0deg) scale(1)`;

  // Shrink plane, show paper stage
  setTimeout(() => {
    planeWrapper.style.transition = 'transform 0.5s ease, opacity 0.4s ease';
    planeWrapper.style.transform  = `translate(${x + 20}px, ${y + 10}px) scale(0) rotate(10deg)`;
    planeWrapper.style.opacity    = '0';

    // Show glow ring
    const ring = document.createElement('div');
    ring.className = 'glow-ring';
    document.body.appendChild(ring);
    setTimeout(() => ring.classList.add('show'), 50);

    // Activate paper stage (will trigger the letterDrop CSS keyframe)
    paperStage.classList.add('active');

    // After scale-in/drop finishes: unfold panels
    setTimeout(() => {
      window.dropFinished = true; // Allow parallax tracking now
      playSound('thud'); // Play heavy thud sound

      panels.forEach(p => p.classList.add('open'));
      // Reveal flat paper (Wait for the 4 envelope flaps to unfold sequentially)
      setTimeout(() => {
        flatPaper.classList.add('visible');
        document.body.classList.add('magic-ready'); // Trigger background candles
        
        // Initial reveal
        setTimeout(() => {
          renderCurrentPage();
        }, 300);
      }, 2000); // Wait 2 seconds for flaps to finish
    }, 1500); // Wait 1.5s for the 3D drop to finish
  }, 400);
}

function renderCurrentPage() {
  const msg = messages[currentPage];
  msgText.classList.remove('show');
  underline.classList.remove('grow');
  
  // Update body class for button visibility
  document.body.classList.remove('on-page-0', 'on-page-1');
  document.body.classList.add(`on-page-${currentPage}`);
  
  // Dynamic Sizing
  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768 && !isMobile;
  const device = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');
  
  document.documentElement.style.setProperty('--paper-h', msg.h[device]);
  msgText.style.fontSize = msg.size[device];

  setTimeout(() => {
    msgText.innerHTML = msg.text;
    msgText.classList.add('show');
    underline.classList.add('grow');
    prepareMaraudersMap(msgText);
    
    // CACHE COORDINATES for performance
    setTimeout(() => {
      reCacheLetters();
    }, 1500); // Wait for entrance/flip animation to fully settle
  }, 400);
}

function reCacheLetters() {
  const letters = document.querySelectorAll('.magic-letter:not(.revealed)');
  cachedLetters = Array.from(letters).map(l => {
    const rect = l.getBoundingClientRect();
    return {
      el: l,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  });
}

window.addEventListener('resize', () => {
  if (window.dropFinished) reCacheLetters();
});

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentPage < messages.length - 1) {
      currentPage++;
      transitionToPage();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      transitionToPage();
    }
  });
}

function transitionToPage() {
  // Cinematic 3D Page Flip
  flatPaper.classList.add('flipping');
  playSound('swoosh');

  // Sparkle Burst!
  const rect = flatPaper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const sparkleCount = window.innerWidth <= 480 ? 15 : 30;
  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      createSprinkle(centerX + (Math.random() - 0.5) * 100, centerY + (Math.random() - 0.5) * 100, true);
    }, i * 10);
  }
  
  // At the midpoint of the flip (when paper is vertical), swap the content
  setTimeout(() => {
    renderCurrentPage();
  }, 400); // Half of the 0.8s flip animation

  // Remove class after animation finishes
  setTimeout(() => {
    flatPaper.classList.remove('flipping');
  }, 800);
}

/* ── Marauder's Map Reveal Effect ──────────────────────── */
function prepareMaraudersMap(el) {
  const originalHTML = el.innerHTML;
  el.innerHTML = '';
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  
  const temp = document.createElement('div');
  temp.innerHTML = originalHTML;
  
  const nodes = Array.from(temp.childNodes);
  
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const isMobile = window.innerWidth <= 480;
      
      if (isMobile) {
        // Optimize for mobile: Split into words instead of characters
        const words = text.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            el.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'magic-letter'; // Still use the same class for logic
            el.appendChild(span);
          }
        });
      } else {
        // Desktop: High-quality character reveal
        [...text].forEach(char => {
          if (char === ' ' || char === '\n') {
            el.appendChild(document.createTextNode(char));
          } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'magic-letter';
            el.appendChild(span);
          }
        });
      }
    } else if (node.nodeName === 'BR') {
      el.appendChild(document.createElement('br'));
    } else {
      el.appendChild(node.cloneNode(true));
    }
  });
}

/* ── Web Audio Synthesizer (Hooks) ──────────────────────── */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'swoosh') { // Wand click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'thud') { // Envelope drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    gain.gain.setValueAtTime(1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'chime') { // Ink reveal
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

/* ── Kick off after page load ─────────────── */
window.addEventListener('load', () => {
  /* ── Background Music Handling ──────────────────────── */
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.volume = 0.4; // Set a nice background volume level
    const playPromise = bgMusic.play();
    
    // Modern browsers block autoplay until the user interacts with the page.
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented. Wait for the very first click to start the music.
        const startAudio = () => {
          bgMusic.play();
          document.removeEventListener('mousedown', startAudio);
        };
        document.addEventListener('mousedown', startAudio);
      });
    }
  }

  /* ── Custom Magical Wand Cursor ─────────────────────── */
  const wand = document.createElement('div');
  wand.id = 'magicWand';
  document.body.appendChild(wand);

  let lastEmit = 0;
  let hideTimeout;
  let currentX = 0;
  let currentY = 0;

  const handleMove = (x, y) => {
    wand.classList.remove('hidden');
    currentX = x;
    currentY = y;

    wand.style.left = `${currentX}px`;
    wand.style.top = `${currentY}px`;

    const now = Date.now();
    if (now - lastEmit > 25) {
      createSprinkle(currentX, currentY);
      lastEmit = now;
    }

    // Auto-hide wand on desktop
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      wand.classList.add('hidden');
    }, 2000);

    // Parallax on the Letter
    const openingPlane = document.getElementById('openingPlane');
    if (window.dropFinished && openingPlane) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = ((currentY - cy) / Math.max(cy, 1)) * -12;
      const ry = ((currentX - cx) / Math.max(cx, 1)) * 12;
      openingPlane.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1)`;
    }

    // Reveal Effect Proximity - FAST CACHED VERSION
    const isMobile = window.innerWidth <= 480;
    if (window.dropFinished && cachedLetters.length > 0) {
      for (let i = cachedLetters.length - 1; i >= 0; i--) {
        const data = cachedLetters[i];
        if (data.el.classList.contains('revealed')) {
          cachedLetters.splice(i, 1);
          continue;
        }

        const dist = Math.hypot(data.x - currentX, data.y - currentY);
        // Larger threshold for mobile to make it feel more responsive/fluid
        const threshold = isMobile ? 150 : 80;
        
        if (dist < threshold) {
          data.el.classList.add('revealed');
          playSoundThrottled('chime');
          cachedLetters.splice(i, 1);
        }
      }
    }
  };

  document.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
  });
  
  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    
    // Spell Cast on Tap
    playSound('swoosh');
    wand.classList.remove('cast');
    void wand.offsetWidth;
    wand.classList.add('cast');
    for (let i = 0; i < 10; i++) {
      createSprinkle(currentX, currentY, true);
    }
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    e.preventDefault(); 
  }, { passive: false });

  // Spell Casting! (Click to swish and flick)
  document.addEventListener('mousedown', () => {
    playSound('swoosh');
    wand.classList.remove('hidden');
    wand.classList.remove('cast');
    void wand.offsetWidth; // Force CSS reflow to restart animation
    wand.classList.add('cast');

    // Create an explosive burst of magic
    for (let i = 0; i < 15; i++) {
      createSprinkle(currentX, currentY, true);
    }
  });

  // Remove class after flick finishes so it can return to idle
  wand.addEventListener('animationend', (e) => {
    if (e.animationName === 'wandFlick') {
      wand.classList.remove('cast');
    }
  });

  function createSprinkle(x, y, isExplosion = false) {
    const sprinkle = document.createElement('div');
    sprinkle.className = 'wand-sprinkle';
    
    // Scatter physics
    const spread = isExplosion ? 30 : 8;
    const force = isExplosion ? 150 : 80;
    
    // Slight random offset from the wand tip
    const offsetX = (Math.random() - 0.5) * spread;
    const offsetY = (Math.random() - 0.5) * spread;
    
    sprinkle.style.left = `${x + offsetX}px`;
    sprinkle.style.top = `${y + offsetY}px`;
    
    // Scatter physics (random spread and fall distance)
    sprinkle.style.setProperty('--rx', (Math.random() - 0.5) * force);
    sprinkle.style.setProperty('--ry', (Math.random() - 0.5) * (force / 2));
    
    document.body.appendChild(sprinkle);
    
    // Remove after animation completes
    setTimeout(() => {
      sprinkle.remove();
    }, 1000);
  }

  // Start the main sequence
  setTimeout(runSequence, 600);
});
