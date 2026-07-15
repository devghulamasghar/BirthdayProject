/**
 * ==========================================================
 * PROJECT AURORA — Loading Screen
 * ==========================================================
 */

"use strict";

const EMOJIS = ["🌸","✨","🎀","⭐","💫","🌙","🎊","💝","🌺","🎈"];

// Spawn floating particles
function spawnParticles() {

    const container = document.getElementById("loadParticles");

    if (!container) return;

    for (let i = 0; i < 22; i++) {

        const el = document.createElement("span");

        el.className    = "load-particle";
        el.textContent  = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        el.style.left   = Math.random() * 100 + "vw";
        el.style.bottom = -(Math.random() * 20) + "vh";
        el.style.fontSize = (14 + Math.random() * 16) + "px";
        el.style.animationDuration  = (6 + Math.random() * 10) + "s";
        el.style.animationDelay     = (Math.random() * 8) + "s";

        container.appendChild(el);
    }
}

function startLoadingAnimation() {

    spawnParticles();

    // Set initial states
    gsap.set(".load-cake",   { opacity: 0, scale: 0.5, y: 30 });
    gsap.set(".loading-content h1", { opacity: 0, y: 50 });
    gsap.set(".load-name",   { opacity: 0, y: 30 });
    gsap.set(".load-sub",    { opacity: 0 });
    gsap.set(".load-bar-wrap", { opacity: 0 });

    const tl = gsap.timeline();

    // Cake pops in
    tl.to(".load-cake", {
        opacity: 1, scale: 1, y: 0,
        duration: 1.2, ease: "elastic.out(1, 0.55)"
    })

    // Title sweeps up
    .to(".loading-content h1", {
        opacity: 1, y: 0,
        duration: 1, ease: "power3.out"
    }, "-=0.5")

    // Name
    .to(".load-name", {
        opacity: 1, y: 0,
        duration: 0.8, ease: "power2.out"
    }, "-=0.4")

    // Subtitle + bar
    .to([".load-sub", ".load-bar-wrap"], {
        opacity: 1,
        duration: 0.6
    }, "-=0.2");

    // Animate progress bar over 5 seconds
    const bar = document.getElementById("loadBar");

    // Add percentage counter above bar
    const barWrap = document.querySelector(".load-bar-wrap");
    let percentEl = document.querySelector(".load-percent");
    if (!percentEl && barWrap) {
        percentEl = document.createElement("p");
        percentEl.className = "load-percent";
        percentEl.textContent = "0%";
        barWrap.parentNode.insertBefore(percentEl, barWrap);
    }

    let progress = 0;

    const barTimer = setInterval(() => {

        progress += 100 / (5000 / 80);
        const pct = Math.min(Math.floor(progress), 98);

        if (bar) bar.style.width = pct + "%";
        if (percentEl) percentEl.textContent = pct + "%";

        if (progress >= 98) clearInterval(barTimer);

    }, 80);

    // Gentle float on whole content
    gsap.to(".loading-content", {
        y: -10, repeat: -1, yoyo: true,
        duration: 3, ease: "sine.inOut"
    });

    setTimeout(() => leaveLoadingScreen(), 5000);
}

function leaveLoadingScreen() {

    const bar = document.getElementById("loadBar");
    if (bar) bar.style.width = "100%";
    const percentEl = document.querySelector(".load-percent");
    if (percentEl) percentEl.textContent = "100%";

    gsap.to("#loadingScreen .loading-content", {
        opacity: 0, y: -20,
        duration: 0.6, ease: "power2.in"
    });

    gsap.to("#loadingScreen", {
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
            const loadScreen = document.getElementById("loadingScreen");
            if (loadScreen) {
                loadScreen.classList.remove("active");
                loadScreen.style.display = "none";
            }
            const container = document.getElementById("loadParticles");
            if (container) container.innerHTML = "";
            Scenes.show("nameScreen");
        }
    });
}
