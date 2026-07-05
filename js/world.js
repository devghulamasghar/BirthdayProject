/**
 * ==========================================================
 * PROJECT AURORA — World of Love
 * Pakistan's Northern Beauty Galaxy World
 * ==========================================================
 */

"use strict";

const WORLD_PLACES = [
    {
        img:   "images/world/hunza.jpg",
        name:  "Hunza Valley",
        desc:  "Heaven on Earth • Gilgit-Baltistan",
        orbit: 1
    },
    {
        img:   "images/world/fairy_meadows.jpg",
        name:  "Fairy Meadows",
        desc:  "Gateway to Nanga Parbat • KPK",
        orbit: 2
    },
    {
        img:   "images/world/naran.jpg",
        name:  "Naran Kaghan",
        desc:  "Valley of Dreams • KPK",
        orbit: 3
    },
    {
        img:   "images/world/skardu.jpg",
        name:  "Skardu",
        desc:  "Land of Giants • Gilgit-Baltistan",
        orbit: 4
    },
    {
        img:   "images/world/swat.jpg",
        name:  "Swat Valley",
        desc:  "Switzerland of Pakistan • KPK",
        orbit: 5
    },
    {
        img:   "images/world/k2.jpg",
        name:  "K2 — The Savage Mountain",
        desc:  "Second highest peak on Earth",
        orbit: 6
    }
];

const LOVE_WORDS = [
    "LOVE", "PEACE", "HOPE", "LIGHT", "DREAM",
    "محبت", "امن", "خوشی", "روشنی", "خواب",
    "KINDNESS", "BEAUTY", "GRACE", "FAITH", "JOY"
];

// ── Listen for scene change ──
document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "worldScreen") initWorldScreen();
});

// ── Warp tunnel entry ──
function enterWorld() {

    const overlay = document.getElementById("warpOverlay");

    // Phase 1: white flash + zoom in
    gsap.timeline()

        .to(overlay, {
            opacity: 1,
            duration: 0.15,
            ease: "power4.in"
        })

        .to(overlay, {
            opacity: 0,
            scale: 3,
            duration: 1.8,
            ease: "power3.out",
            onStart: () => {
                Scenes.show("worldScreen");
            }
        })

        .set(overlay, { scale: 1 });
}

// ── Main init ──
function initWorldScreen() {

    const screen = document.getElementById("worldScreen");
    screen.innerHTML = "";

    // Nebula blobs
    screen.innerHTML = `
        <div class="world-nebula world-nebula-1"></div>
        <div class="world-nebula world-nebula-2"></div>
        <div class="world-nebula world-nebula-3"></div>

        <canvas id="worldCanvas"></canvas>

        <div class="world-title-wrap">
            <p class="world-title">A World of Love 🌸</p>
            <p class="world-subtitle">NO HATE • NO JEALOUSY • ONLY PEACE</p>
        </div>

        <div class="solar-system" id="solarSystem">
            <div class="world-sun" id="worldSun" title="You are the centre of this world ✨"></div>
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
    buildOrbits();
    spawnLoveWords();
    animateWorldIn();

    // Sun tooltip
    const sun = document.getElementById("worldSun");
    sun.addEventListener("click", () => {
        confetti({
            particleCount: 120,
            spread: 360,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#FFD166","#FF4D8D","#8B5CF6","#fff","#06b6d4"]
        });
    });

    // Lightbox close
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("worldLightbox").addEventListener("click", (e) => {
        if (e.target === document.getElementById("worldLightbox")) closeLightbox();
    });
}

// ── Star canvas ──
function startWorldCanvas() {

    const canvas = document.getElementById("worldCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 600;
    const COUNT = isMobile ? 180 : 380;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        a: Math.random(),
        d: (Math.random() > 0.5 ? 1 : -1) * 0.005
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.a += s.d;
            if (s.a > 1 || s.a < 0.1) s.d *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.a})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#fff";
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    draw();
}

// ── Build orbit rings + planets ──
function buildOrbits() {

    const system = document.getElementById("solarSystem");
    if (!system) return;

    WORLD_PLACES.forEach((place, i) => {

        const orbitEl = document.createElement("div");
        orbitEl.className = `orbit orbit-${place.orbit}`;

        // Planet wrapper positioned at the right edge of the orbit
        const wrap = document.createElement("div");
        wrap.className = "planet-wrap";

        // Get orbit radius from CSS (half the orbit width)
        const radii = [100, 160, 225, 295, 370, 450];
        const isMobile = window.innerWidth < 600;
        const mobileRadii = [65, 105, 147, 192, 240, 290];
        const r = isMobile ? mobileRadii[i] : radii[i];

        wrap.style.cssText = `
            margin-left: ${r}px;
            margin-top: -27px;
        `;

        const planet = document.createElement("div");
        planet.className = "planet";

        const img = document.createElement("img");
        img.src = place.img;
        img.alt = place.name;
        img.loading = "lazy";

        planet.appendChild(img);

        const label = document.createElement("span");
        label.className = "planet-label";
        label.textContent = place.name;

        wrap.appendChild(planet);
        wrap.appendChild(label);
        orbitEl.appendChild(wrap);
        system.appendChild(orbitEl);

        // Click → lightbox
        planet.addEventListener("click", () => openLightbox(place));
    });
}

// ── Lightbox ──
function openLightbox(place) {

    const lb   = document.getElementById("worldLightbox");
    const img  = document.getElementById("lightboxImg");
    const name = document.getElementById("lightboxName");
    const desc = document.getElementById("lightboxDesc");

    img.src       = place.img;
    name.textContent = place.name;
    desc.textContent = place.desc;

    lb.classList.add("open");

    gsap.fromTo(img,
        { scale: 0.8, opacity: 0 },
        { scale: 1,   opacity: 1, duration: 0.6, ease: "back.out(1.4)" }
    );
    gsap.fromTo(name,
        { y: 20, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.5, delay: 0.2 }
    );
    gsap.fromTo(desc,
        { y: 10, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.5, delay: 0.35 }
    );
}

function closeLightbox() {
    const lb = document.getElementById("worldLightbox");
    gsap.to(lb, {
        opacity: 0, duration: 0.3,
        onComplete: () => {
            lb.classList.remove("open");
            gsap.set(lb, { opacity: 1 });
        }
    });
}

// ── Floating love words ──
function spawnLoveWords() {

    const screen = document.getElementById("worldScreen");
    if (!screen) return;

    LOVE_WORDS.forEach((word, i) => {
        const el = document.createElement("span");
        el.className = "love-word";
        el.textContent = word;
        const duration = 18 + Math.random() * 20;
        const delay    = Math.random() * 15;
        el.style.cssText = `
            left: ${5 + Math.random() * 90}%;
            bottom: -40px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --r: ${-15 + Math.random() * 30}deg;
        `;
        screen.appendChild(el);
    });
}

// ── Entrance animation ──
function animateWorldIn() {

    gsap.from(".world-title-wrap",  { y: -40, opacity: 0, duration: 1.2, delay: 0.3, ease: "power3.out" });
    gsap.from(".world-sun",         { scale: 0, opacity: 0, duration: 1.4, delay: 0.5, ease: "elastic.out(1,.6)" });
    gsap.from(".world-bottom-nav",  { y: 40,  opacity: 0, duration: 1,   delay: 1.2, ease: "power3.out" });

    // Stagger orbits in
    document.querySelectorAll(".orbit").forEach((o, i) => {
        gsap.from(o, { scale: 0, opacity: 0, duration: 1, delay: 0.6 + i * 0.15, ease: "power3.out" });
    });
}
