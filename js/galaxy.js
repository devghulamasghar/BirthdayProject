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
const STAR_COUNT = window.innerWidth < 600 ? 200 : 450;

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

        this.radius = Math.random() * 2 + 0.5;

        this.alpha = Math.random();

        this.speed = Math.random() * 0.15 + 0.02;

        this.twinkle = Math.random() * 0.02;

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

        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;

        ctx.shadowBlur = 10;

        ctx.shadowColor = "#ffffff";

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

        ctx.shadowBlur = 15;

        ctx.shadowColor = "#ffffff";

        ctx.stroke();

    }

}

for (let i = 0; i < 3; i++) {

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

function drawBackground() {

    const gradient = ctx.createLinearGradient(

        0,

        0,

        0,

        height

    );

    gradient.addColorStop(0, "#020617");

    gradient.addColorStop(.5, "#071321");

    gradient.addColorStop(1, "#000000");

    ctx.fillStyle = gradient;

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

    ctx.shadowBlur = 40;

    ctx.shadowColor = "#ffffff";

    ctx.fill();

}

// =========================================
// Animation Loop
// =========================================

function animateGalaxy() {

    requestAnimationFrame(animateGalaxy);

    drawBackground();

    drawMoon();

    stars.forEach(star => {

        star.update();

        star.draw();

    });

    shootingStars.forEach(star => {

        star.update();

        star.draw();

    });

}

animateGalaxy();