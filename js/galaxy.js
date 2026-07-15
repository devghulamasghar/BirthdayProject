/**
 * ==========================================================
 * PROJECT AURORA
 * Galaxy Engine
 * Version : 1.0
 * ==========================================================
 */

"use strict";

// =========================================
// Canvas Setup
// =========================================

const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

const stars = [];
const STAR_COUNT = window.innerWidth < 600 ? 120 : 700;
const isMobile = window.innerWidth < 600;

const STAR_COLORS = [
    "255,255,255",
    "165,243,252",  // soft blue
    "253,230,138",  // soft gold
    "216,180,254",  // soft purple
    "255,182,255"   // soft pink
];

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

// =========================================
// Resize Canvas
// =========================================

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    bgGradient = null; // invalidate cached gradient on resize

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

// =========================================
// Star Class
// =========================================

class Star {

    constructor() {

        this.reset();

    }

    reset() {

        this.x = Math.random() * width;

        this.y = Math.random() * height;

        this.radius = Math.random() * 2 + 0.3;

        this.alpha = Math.random();

        this.speed = Math.random() * 0.12 + 0.01;

        this.twinkle = Math.random() * 0.018;

        this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    }

    update() {

        this.alpha += this.twinkle;

        if (this.alpha >= 1 || this.alpha <= 0.2) {

            this.twinkle *= -1;

        }

        this.y += this.speed;

        if (this.y > height) {

            this.y = 0;
            this.x = Math.random() * width;

        }

    }

    draw() {

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;

        ctx.fill();

    }

}

// =========================================
// Create Stars
// =========================================

function createStars() {

    stars.length = 0;

    for (let i = 0; i < STAR_COUNT; i++) {

        stars.push(new Star());

    }

}

createStars();

// Batch-draw glowing stars once per frame using a single shadowBlur pass
function drawStars() {
    // Pass 1: all stars without shadow (fast)
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Pass 2: only large stars get glow (desktop only, max 60 stars)
    if (!isMobile) {
        ctx.save();
        ctx.shadowBlur = 10;
        const glowStars = stars.filter(s => s.radius > 1.5);
        const limit = Math.min(glowStars.length, 60);
        for (let i = 0; i < limit; i++) {
            const s = glowStars[i];
            ctx.shadowColor = `rgba(${s.color},0.9)`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color},${s.alpha})`;
            ctx.fill();
        }
        ctx.restore();
    }
}

// =========================================
// Shooting Stars
// =========================================

const shootingStars = [];

class ShootingStar {

    constructor() {

        this.reset();

    }

    reset() {

        this.x = Math.random() * width + 200;

        this.y = Math.random() * height / 2;

        this.length = Math.random() * 180 + 100;

        this.speed = Math.random() * 10 + 12;

        this.life = 0;

        this.maxLife = 60;

    }

    update() {

        this.x -= this.speed;

        this.y += this.speed * 0.4;

        this.life++;

        if (this.life > this.maxLife) {

            this.reset();

        }

    }

    draw() {

        ctx.beginPath();

        ctx.moveTo(this.x, this.y);

        ctx.lineTo(

            this.x + this.length,

            this.y - this.length * 0.4

        );

        ctx.strokeStyle = "rgba(255,255,255,.8)";

        ctx.lineWidth = 2;

        if (!isMobile) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ffffff";
        }

        ctx.stroke();

    }

}

for (let i = 0; i < (isMobile ? 1 : 3); i++) {

    shootingStars.push(new ShootingStar());

}

// =========================================
// Mouse Movement
// =========================================

window.addEventListener("mousemove", e => {

    mouse.x = e.clientX;

    mouse.y = e.clientY;

});

// Touch support for mobile
window.addEventListener("touchmove", e => {

    mouse.x = e.touches[0].clientX;

    mouse.y = e.touches[0].clientY;

}, { passive: true });

// =========================================
// Background
// =========================================

// Cache gradient — recreating every frame causes GC pressure
let bgGradient = null;

function drawBackground() {

    if (!bgGradient) {
        bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0,   "#020617");
        bgGradient.addColorStop(.5,  "#071321");
        bgGradient.addColorStop(1,   "#000000");
    }

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

}

// =========================================
// Moon
// =========================================

function drawMoon() {

    const moonX = Math.min(width - 80, width - 180);

    const moonY = 130;

    const moonRadius = window.innerWidth < 600 ? 35 : 55;

    ctx.beginPath();

    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(

        moonX - 15,

        moonY - 15,

        10,

        moonX,

        moonY,

        moonRadius

    );

    gradient.addColorStop(0, "#ffffff");

    gradient.addColorStop(1, "#cccccc");

    ctx.fillStyle = gradient;

    if (!isMobile) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#ffffff";
    }

    ctx.fill();

}

// =========================================
// Aurora Blobs on Canvas
// =========================================

const auroraBlobs = [
    { x: -100, y: -80,  w: 700, h: 500, color: "139,92,246",  alpha: 0, phase: 0,    speed: 0.008 },
    { x: null, y: null, w: 600, h: 600, color: "255,77,141",  alpha: 0, phase: 2.1,  speed: 0.006 },
    { x: null, y: null, w: 500, h: 400, color: "6,182,212",   alpha: 0, phase: 4.2,  speed: 0.01  }
];

function initAuroraBlobs() {
    auroraBlobs[1].x = width - 200;
    auroraBlobs[1].y = height - 200;
    auroraBlobs[2].x = width * 0.4;
    auroraBlobs[2].y = height * 0.4;
}

initAuroraBlobs();
window.addEventListener("resize", initAuroraBlobs);

function drawAuroraBlobs() {
    if (isMobile) return;
    auroraBlobs.forEach(b => {
        b.phase += b.speed;
        const ox = Math.sin(b.phase) * 60;
        const oy = Math.cos(b.phase * 0.7) * 50;
        const grad = ctx.createRadialGradient(
            b.x + ox, b.y + oy, 0,
            b.x + ox, b.y + oy, Math.max(b.w, b.h) / 2
        );
        grad.addColorStop(0,   `rgba(${b.color},.13)`);
        grad.addColorStop(0.5, `rgba(${b.color},.06)`);
        grad.addColorStop(1,   `rgba(${b.color},0)`);
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(b.x + ox, b.y + oy, b.w / 2, b.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// =========================================
// Animation Loop
// =========================================

function animateGalaxy() {

    requestAnimationFrame(animateGalaxy);

    drawBackground();

    drawAuroraBlobs();

    drawMoon();

    drawStars();

    shootingStars.forEach(star => {

        star.update();

        star.draw();

    });

}

animateGalaxy();