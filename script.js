/**
 * INFINITE VIBE ENGINE v3
 * Dedication: Israt Jahan Emu & A. S. M. Shishir
 */

const app = (() => {
    
    // --- State ---
    const state = {
        loveLevel: parseInt(localStorage.getItem('loveLevel')) || 1,
        currentView: 'hub',
        isMusicPlaying: false,
        particles: [],
        quotes: [
            "Every heartbeat belongs to you.",
            "You are the rhythm of my soul.",
            "In your eyes, I found my universe.",
            "Forever is a short time when I'm with you.",
            "You are the most beautiful chapter of my life.",
            "My love for you grows with every loop."
        ],
        secrets: {
            'shishir': 'You are my world, Emu. ❤️',
            '1402': 'Happy Valentine\'s Day! (Retroactive Love)',
            '2026': 'The year our story becomes legendary.'
        }
    };

    // --- Core Methods ---
    const init = () => {
        setupCanvas();
        setupAudio();
        updateHub();
        bindEvents();
        animateBackground();
    };

    const nav = (view) => {
        const oldEl = document.getElementById(`${state.currentView}-screen`);
        const newEl = document.getElementById(`${view}-screen`);

        gsap.to(oldEl, { opacity: 0, scale: 0.9, duration: 0.5, onComplete: () => {
            oldEl.classList.remove('active');
            newEl.classList.add('active');
            gsap.fromTo(newEl, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.5 });
            state.currentView = view;
            
            if (view === 'arcade') startArcade();
            if (view === 'letter') startLetter();
        }});
    };

    const updateHub = () => {
        document.getElementById('love-level-val').innerText = state.loveLevel;
        document.getElementById('hub-quote').innerText = state.quotes[Math.floor(Math.random() * state.quotes.length)];
        
        // Dynamic theme change
        const hue = (state.loveLevel * 20) % 360;
        document.body.style.setProperty('--bg-start', `hsl(${hue}, 40%, 5%)`);
        document.body.style.setProperty('--bg-end', `hsl(${(hue + 40) % 360}, 40%, 15%)`);
    };

    const addLove = (amount = 1) => {
        state.loveLevel += amount;
        localStorage.setItem('loveLevel', state.loveLevel);
        updateHub();
        
        // Feedback animation
        gsap.from('.love-status', { scale: 1.5, duration: 0.5, ease: 'back.out' });
    };

    // --- Background Engine ---
    const setupCanvas = () => {
        const canvas = document.getElementById('heart-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Heart {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 50;
                this.size = Math.random() * 15 + 5;
                this.speed = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.wiggle = Math.random() * 2;
                this.wiggleSpeed = Math.random() * 0.05;
            }
            update() {
                this.y -= this.speed;
                this.x += Math.sin(this.y * this.wiggleSpeed) * this.wiggle;
                if (this.y < -50) this.init();
            }
            draw() {
                ctx.fillStyle = `rgba(255, 106, 136, ${this.opacity})`;
                ctx.font = `${this.size}px Arial`;
                ctx.fillText('❤️', this.x, this.y);
            }
        }

        for (let i = 0; i < 30; i++) state.particles.push(new Heart());

        window.heartCanvas = { canvas, ctx };
    };

    const animateBackground = () => {
        const { canvas, ctx } = window.heartCanvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateBackground);
    };

    // --- Audio System ---
    const setupAudio = () => {
        const btn = document.getElementById('music-btn');
        const audio = document.getElementById('bg-audio');

        btn.addEventListener('click', () => {
            if (state.isMusicPlaying) {
                audio.pause();
                btn.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                audio.play().catch(e => console.log('Autoplay blocked'));
                btn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            state.isMusicPlaying = !state.isMusicPlaying;
        });
    };

    // --- Arcade Engine ---
    const startArcade = () => {
        const stage = document.getElementById('game-stage');
        stage.innerHTML = '';
        document.getElementById('game-overlay').classList.add('hidden');

        // Randomly pick a game
        const gameType = Math.random() > 0.5 ? 'catch' : 'chase';
        
        if (gameType === 'catch') {
            let score = 0;
            const target = 5;
            stage.innerHTML = `<p style="text-align:center; padding:20px;">Catch ${target} Falling Hearts!</p>`;
            
            const spawn = () => {
                if (score >= target) return showGameWin();
                const h = document.createElement('div');
                h.className = 'game-heart';
                h.innerText = '❤️';
                h.style.left = Math.random() * 80 + 10 + '%';
                h.style.top = '-50px';
                stage.appendChild(h);

                gsap.to(h, { y: 550, duration: 3, ease: 'none', onComplete: () => h.remove() });
                h.onclick = () => {
                    score++;
                    h.remove();
                    addLove(1);
                    if (score >= target) showGameWin();
                };
                setTimeout(spawn, 1000);
            };
            spawn();
        } else {
            stage.innerHTML = `<p style="text-align:center; padding:20px;">Tap the heart to catch it!</p>`;
            const h = document.createElement('div');
            h.className = 'game-heart';
            h.innerText = '❤️';
            h.style.left = '50%';
            h.style.top = '50%';
            stage.appendChild(h);

            let taps = 0;
            h.onclick = () => {
                taps++;
                gsap.to(h, { 
                    left: Math.random() * 80 + 10 + '%', 
                    top: Math.random() * 80 + 10 + '%',
                    duration: 0.3 
                });
                addLove(1);
                if (taps >= 7) showGameWin();
            };
        }
    };

    const showGameWin = () => {
        document.getElementById('game-overlay').classList.remove('hidden');
        gsap.from('#game-overlay', { opacity: 0, duration: 0.5 });
    };

    const finishGame = () => {
        nav('hub');
    };

    // --- Letter Engine ---
    const startLetter = () => {
        const content = document.getElementById('letter-content');
        content.innerHTML = '';
        const fullText = "To my dearest Emu, every time you come back to this universe, my love for you has grown. You are the heartbeat of this application and the rhythm of my life. A. S. M. Shishir will always be yours, looping in this endless love... ❤️";
        
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                content.innerHTML += fullText.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        type();
    };

    // --- Secret System ---
    const checkSecret = () => {
        const val = document.getElementById('secret-key').value.toLowerCase();
        const reveal = document.getElementById('secret-reveal');
        
        if (state.secrets[val]) {
            reveal.innerText = state.secrets[val];
            reveal.classList.remove('hidden');
            gsap.from(reveal, { y: 10, opacity: 0, duration: 0.5 });
            addLove(5);
        } else {
            alert('Wrong key... try a special date or name! 💔');
        }
    };

    const bindEvents = () => {
        // resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('heart-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Pulsing interaction on nodes
        document.querySelectorAll('.heart-shape').forEach(node => {
            node.onclick = () => {
                gsap.to(node, { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 });
                addLove(1);
            };
        });
    };

    return { init, nav, finishGame, checkSecret };
})();

// Start the universe
window.onload = app.init;
