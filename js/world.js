/**
 * ==========================================================
 * PROJECT AURORA — World of Love
 * Pakistan's Northern Beauty Galaxy World
 * ==========================================================
 */

"use strict";

const WORLD_PLACES = [
    { img: "images/world/hunza.jpg",        name: "Hunza Valley",          desc: "Heaven on Earth  •  Gilgit-Baltistan", orbit: 1 },
    { img: "images/world/fairy_meadows.jpg",name: "Fairy Meadows",         desc: "Gateway to Nanga Parbat  •  KPK",      orbit: 2 },
    { img: "images/world/naran.jpg",        name: "Naran Kaghan",          desc: "Valley of Dreams  •  KPK",             orbit: 3 },
    { img: "images/world/skardu.jpg",       name: "Skardu",                desc: "Land of Giants  •  Gilgit-Baltistan",  orbit: 4 },
    { img: "images/world/swat.jpg",         name: "Swat Valley",           desc: "Switzerland of Pakistan  •  KPK",      orbit: 5 },
    { img: "images/world/k2.jpg",           name: "K2 — The Savage Mountain", desc: "Second Highest Peak on Earth",      orbit: 6 }
];

const LOVE_WORDS = [
    "LOVE", "PEACE", "HOPE", "LIGHT", "DREAM",
    "محبت", "امن", "خوشی", "روشنی", "خواب",
    "KINDNESS", "BEAUTY", "GRACE", "FAITH", "JOY"
];

// ── Portal HTML helper (used in gallery + fireworks) ──
function worldPortalHTML() {
    return `
        <div class="world-portal-wrap" id="worldPortalWrap">
            <div class="world-portal-orb" id="worldPortalOrb">
                <div class="orb-ring"></div>
                <div class="orb-ring"></div>
                <div class="orb-ring"></div>
                <div class="orb-core"></div>
            </div>
            <p class="world-portal-label">Enter the World of Love</p>
            <p class="world-portal-hint">✦ tap to journey within ✦</p>
        </div>
    `;
}

// ── Attach portal click after render ──
function attachPortalClick() {
    const orb = document.getElementById("worldPortalOrb");
    if (orb) orb.addEventListener("click", enterWorld, { once: true });
}

// ── Cinematic warp tunnel entry ──
function enterWorld() {

    const overlay = document.getElementById("warpOverlay");

    // Build tunnel layers
    overlay.innerHTML = `<div class="warp-tunnel"></div><div class="warp-flash"></div>`;

    const tunnel = overlay.querySelector(".warp-tunnel");
    const flash  = overlay.querySelector(".warp-flash");

    gsap.set(overlay, { opacity: 0, clearProps: "scale" });
    gsap.set(flash,   { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
        onComplete: () => {
            overlay.innerHTML = "";
            gsap.set(overlay, { opacity: 0 });
        }
    });

    // 1 — tunnel spins in
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.in" })

    // 2 — flash blooms from centre
    .to(flash, { opacity: 1, scale: 6, duration: 0.55, ease: "power4.in" }, "-=0.05")

    // 3 — switch scene at peak white
    .call(() => Scenes.show("worldScreen"))

    // 4 — fade out
    .to(overlay, { opacity: 0, duration: 0.9, ease: "power3.out" });
}

// ── Scene listener ──
document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "worldScreen") initWorldScreen();
});

// ── Main init ──
function initWorldScreen() {

    const screen = document.getElementById("worldScreen");

    screen.innerHTML = `
        <div class="world-nebula world-nebula-1"></div>
        <div class="world-nebula world-nebula-2"></div>
        <div class="world-nebula world-nebula-3"></div>

        <canvas id="worldCanvas"></canvas>

        <canvas id="auroraCanvas"></canvas>

        <div class="world-title-wrap">
            <p class="world-title">A World of Love 🌸</p>
            <p class="world-subtitle">✦  no hate  •  no jealousy  •  only peace  ✦</p>
        </div>

        <div class="solar-system" id="solarSystem">
            <div class="world-sun" id="worldSun"></div>
        </div>

        <div class="world-bottom-nav">
            <button class="world-nav-btn" onclick="Scenes.show('letterScreen')">Open Letter 💌</button>
            <button class="world-nav-btn" onclick="Scenes.show('apologyScreen')">Read Apology 🤍</button>
            <button class="world-nav-btn" onclick="Scenes.show('cakeScreen')">Cake 🎂</button>
        </div>

        <div class="world-lightbox" id="worldLightbox">
            <button class="world-lightbox-close" id="lightboxClose">✕</button>
            <img id="lightboxImg" src="" alt="">
            <p class="world-lightbox-name" id="lightboxName"></p>
            <p class="world-lightbox-desc" id="lightboxDesc"></p>
        </div>
    `;

    startWorldCanvas();
    startAurora();
    buildOrbits();
    spawnLoveWords();
    animateWorldIn();

    // Sun hint pulse ring
    const sunHint = document.createElement("div");
    sunHint.className = "sun-hint-ring";
    document.getElementById("worldSun").appendChild(sunHint);

    // Sun — confetti burst on click
    document.getElementById("worldSun").addEventListener("click", () => {
        confetti({
            particleCount: 140,
            spread: 360,
            startVelocity: 28,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#FFD166","#FF4D8D","#8B5CF6","#fff","#06b6d4"]
        });
    });

    // Lightbox close — button
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

    // Lightbox close — backdrop click
    document.getElementById("worldLightbox").addEventListener("click", (e) => {
        if (e.target.id === "worldLightbox") closeLightbox();
    });
}

// ── Star canvas ──
function startWorldCanvas() {

    const canvas = document.getElementById("worldCanvas");
    if (!canvas) return;

    const ctx    = canvas.getContext("2d");
    const mobile = window.innerWidth < 600;
    const COUNT  = mobile ? 80 : 380;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        a: Math.random(),
        d: (Math.random() > 0.5 ? 1 : -1) * 0.005
    }));

    let animId;

    // Stop loop when screen changes to free memory
    document.addEventListener("sceneChanged", () => { cancelAnimationFrame(animId); }, { once: true });

    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        stars.forEach(s => {
            s.a += s.d;
            if (s.a > 1 || s.a < 0.1) s.d *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.a})`;
            ctx.fill();
        });
        animId = requestAnimationFrame(draw);
    })();
}

// ── Aurora Borealis canvas ──
function startAurora() {
    // Skip on mobile — too GPU intensive
    if (window.innerWidth < 768) return;

    const canvas = document.getElementById("auroraCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const bands = [
        { y: 0.25, color: "rgba(0,255,150,",  speed: 0.0008, amp: 80,  wave: 0 },
        { y: 0.35, color: "rgba(100,80,255,",  speed: 0.0006, amp: 60,  wave: 1.5 },
        { y: 0.20, color: "rgba(0,220,255,",   speed: 0.001,  amp: 50,  wave: 3 },
        { y: 0.42, color: "rgba(180,50,255,",  speed: 0.0005, amp: 70,  wave: 0.8 }
    ];

    let t = 0;
    let auroraAnimId;

    document.addEventListener("sceneChanged", () => cancelAnimationFrame(auroraAnimId), { once: true });

    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 1;

        bands.forEach(b => {
            const baseY = canvas.height * b.y;
            ctx.beginPath();

            for (let x = 0; x <= canvas.width; x += 4) {
                const y = baseY
                    + Math.sin(x * 0.008 + t * b.speed * 60 + b.wave) * b.amp
                    + Math.sin(x * 0.003 + t * b.speed * 40) * (b.amp * 0.4);

                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, baseY - b.amp, 0, baseY + b.amp * 2);
            grad.addColorStop(0,   b.color + "0)");
            grad.addColorStop(0.3, b.color + "0.06)");
            grad.addColorStop(0.6, b.color + "0.03)");
            grad.addColorStop(1,   b.color + "0)");

            ctx.fillStyle = grad;
            ctx.fill();
        });

        auroraAnimId = requestAnimationFrame(draw);
    })();
}

// ── Build orbit rings + planets ──
function buildOrbits() {

    const system = document.getElementById("solarSystem");
    if (!system) return;

    const mobile     = window.innerWidth < 600;
    const radii      = [100, 160, 225, 295, 370, 450];
    const mobileRadii= [65,  105, 147, 192, 240, 290];

    WORLD_PLACES.forEach((place, i) => {

        const orbitEl = document.createElement("div");
        orbitEl.className = `orbit orbit-${place.orbit}`;

        const wrap = document.createElement("div");
        wrap.className = "planet-wrap";

        const r = mobile ? mobileRadii[i] : radii[i];
        wrap.style.cssText = `margin-left:${r}px; margin-top:-27px;`;

        const planet = document.createElement("div");
        planet.className = "planet";

        // Larger invisible tap area for mobile
        planet.style.cssText += ";padding:10px;margin:-10px;box-sizing:content-box;";

        const img = document.createElement("img");
        img.src     = place.img;
        img.alt     = place.name;
        img.loading = "lazy";
        img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;pointer-events:none;";

        planet.appendChild(img);

        const label = document.createElement("span");
        label.className   = "planet-label";
        label.textContent = place.name;

        wrap.appendChild(planet);
        wrap.appendChild(label);
        orbitEl.appendChild(wrap);
        system.appendChild(orbitEl);

        planet.addEventListener("click", (e) => {
            e.stopPropagation();
            openLightbox(place);
        });

        // Touch support — use touchstart for snappier iOS response
        planet.addEventListener("touchend", (e) => {
            e.stopPropagation();
            openLightbox(place);
        }, { passive: true });
    });
}

// ── Lightbox open ──
function openLightbox(place) {

    const lb   = document.getElementById("worldLightbox");
    const img  = document.getElementById("lightboxImg");
    const name = document.getElementById("lightboxName");
    const desc = document.getElementById("lightboxDesc");

    img.src          = place.img;
    name.textContent = place.name;
    desc.textContent = place.desc;

    lb.classList.add("open");

    gsap.fromTo(img,  { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" });
    gsap.fromTo(name, { y: 20, opacity: 0 },       { y: 0, opacity: 1, duration: 0.5, delay: 0.2 });
    gsap.fromTo(desc, { y: 10, opacity: 0 },       { y: 0, opacity: 1, duration: 0.5, delay: 0.35 });
}

// ── Lightbox close ──
function closeLightbox() {

    const lb = document.getElementById("worldLightbox");
    if (!lb) return;

    lb.classList.remove("open");
}

// ── Floating love words ──
function spawnLoveWords() {

    const screen = document.getElementById("worldScreen");
    if (!screen) return;

    LOVE_WORDS.forEach((word) => {
        const el = document.createElement("span");
        el.className   = "love-word";
        el.textContent = word;
        const dur   = 18 + Math.random() * 20;
        const delay = Math.random() * 15;
        el.style.cssText = `
            left:${5 + Math.random() * 90}%;
            bottom:-40px;
            animation-duration:${dur}s;
            animation-delay:${delay}s;
            --r:${-15 + Math.random() * 30}deg;
        `;
        screen.appendChild(el);
    });
}

// ── Entrance animation ──
function animateWorldIn() {

    gsap.from(".world-title-wrap", { y: -40, opacity: 0, duration: 1.2, delay: 0.3, ease: "power3.out" });
    gsap.from(".world-sun",        { scale: 0, opacity: 0, duration: 1.4, delay: 0.5, ease: "elastic.out(1,.6)" });
    gsap.from(".world-bottom-nav", { y: 40, opacity: 0, duration: 1, delay: 1.2, ease: "power3.out" });

    document.querySelectorAll(".orbit").forEach((o, i) => {
        gsap.from(o, { scale: 0, opacity: 0, duration: 1, delay: 0.6 + i * 0.15, ease: "power3.out" });
    });
}
