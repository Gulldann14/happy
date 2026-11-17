document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Логика переключения экранов ---
    const btn = document.getElementById('open-btn');
    const introScreen = document.getElementById('intro-screen');
    const mainScreen = document.getElementById('main-screen');

    btn.addEventListener('click', () => {
        introScreen.classList.remove('active');
        setTimeout(() => {
            mainScreen.classList.add('active');
            startTypewriter();
            // Запускаем салют с задержкой, чтобы экран успел появиться
            setTimeout(launchFireworks, 500);
        }, 800); // Ждем, пока погаснет первый экран
    });

    // --- 2. Эффект печатной машинки ---
    const textToType = "Пусть этот год будет для тебя таким же ярким, как этот салют.";
    const typeElement = document.getElementById("typewriter");
    let charIndex = 0;

    function startTypewriter() {
        if (charIndex < textToType.length) {
            typeElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(startTypewriter, 60); // Скорость печати
        }
    }

    // --- 3. Фоновая анимация звезд ---
    const starsCanvas = document.getElementById('stars-canvas');
    const ctxStars = starsCanvas.getContext('2d');
    let stars = [];

    function resizeStars() {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeStars);
    resizeStars();

    class Star {
        constructor() {
            this.x = Math.random() * starsCanvas.width;
            this.y = Math.random() * starsCanvas.height;
            this.size = Math.random() * 1.5;
            this.speed = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y -= this.speed;
            if (this.y < 0) this.y = starsCanvas.height;
        }
        draw() {
            ctxStars.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
            ctxStars.beginPath();
            ctxStars.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctxStars.fill();
        }
    }

    for (let i = 0; i < 150; i++) stars.push(new Star());

    function animateStars() {
        ctxStars.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    // --- 4. Движок САЛЮТА (Canvas API) ---
    const fireCanvas = document.getElementById('fireworks-canvas');
    const ctxFire = fireCanvas.getContext('2d');
    
    function resizeFire() {
        fireCanvas.width = window.innerWidth;
        fireCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeFire);
    resizeFire();

    let particles = [];
    let rockets = [];

    // Класс Ракеты (летит вверх, потом взрывается)
    class Rocket {
        constructor() {
            this.x = Math.random() * fireCanvas.width;
            this.y = fireCanvas.height;
            this.targetY = Math.random() * (fireCanvas.height / 2); // Взрыв в верхней половине
            this.speed = Math.random() * 5 + 5;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        }
        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
                return true; // Ракета уничтожена
            }
            return false;
        }
        draw() {
            ctxFire.beginPath();
            ctxFire.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctxFire.fillStyle = this.color;
            ctxFire.fill();
        }
        explode() {
            const numParticles = Math.floor(Math.random() * 50) + 50;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }

    // Класс Частицы (разлетаются от взрыва)
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 1;
            this.decay = Math.random() * 0.015 + 0.015;
            this.color = color;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.05; // Гравитация
            this.life -= this.decay;
            return this.life <= 0;
        }
        draw() {
            ctxFire.globalAlpha = this.life;
            ctxFire.fillStyle = this.color;
            ctxFire.beginPath();
            ctxFire.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctxFire.fill();
            ctxFire.globalAlpha = 1;
        }
    }

    function animateFireworks() {
        // Очищаем с легким шлейфом
        ctxFire.fillStyle = 'rgba(5, 8, 16, 0.2)';
        ctxFire.fillRect(0, 0, fireCanvas.width, fireCanvas.height);

        // Обновляем ракеты
        for (let i = rockets.length - 1; i >= 0; i--) {
            if (rockets[i].update()) {
                rockets.splice(i, 1);
            } else {
                rockets[i].draw();
            }
        }

        // Обновляем частицы
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        requestAnimationFrame(animateFireworks);
    }
    
    // Запускаем отрисовку салюта (даже если ракет нет, цикл работает для очистки)
    animateFireworks();

    // Функция для запуска серии салютов
    function launchFireworks() {
        // Запускаем волну ракет
        let count = 0;
        const interval = setInterval(() => {
            rockets.push(new Rocket());
            count++;
            if (count > 15) clearInterval(interval); // 15 ракет за раз
        }, 200);
        
        // Повторяем через некоторое время
        setTimeout(launchFireworks, 4000);
    }
});