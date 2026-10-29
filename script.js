/* ═══════════════════════════════════════════════════════
   ZALEA ECUESTRE — Script
   Floating particles + subtle parallax
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Particles ───
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedY = -(Math.random() * 0.3 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.003 + 0.001;
      this.life = 0;
      this.maxLife = Math.random() * 600 + 300;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      // Fade in/out based on life
      const lifeRatio = this.life / this.maxLife;
      if (lifeRatio < 0.1) {
        this.currentOpacity = this.opacity * (lifeRatio / 0.1);
      } else if (lifeRatio > 0.8) {
        this.currentOpacity = this.opacity * ((1 - lifeRatio) / 0.2);
      } else {
        this.currentOpacity = this.opacity;
      }

      if (this.life >= this.maxLife || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 195, 170, ${this.currentOpacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    // Fewer particles for elegance
    const count = Math.min(Math.floor((width * height) / 18000), 60);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    animFrameId = requestAnimationFrame(animate);
  }

  // ─── Subtle mouse parallax on logo ───
  const logo = document.getElementById('logo');
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function parallaxLoop() {
    // Smooth lerp
    currentX += (mouseX - currentX) * 0.04;
    currentY += (mouseY - currentY) * 0.04;

    if (logo) {
      const moveX = currentX * 8;
      const moveY = currentY * 6;
      logo.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    requestAnimationFrame(parallaxLoop);
  }

  // ─── Init ───
  resize();
  initParticles();
  animate();
  parallaxLoop();

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 200);
  });

  // ─── Video playback fallback ───
  const video = document.getElementById('bg-video');
  if (video) {
    video.play().catch(() => {
      // Some browsers block autoplay; ensure it plays on first interaction
      const playOnInteraction = () => {
        video.play();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('touchstart', playOnInteraction);
    });
  }
})();
