/**
 * ==========================================================
 * PROJECT AURORA — Wish Jar
 * ==========================================================
 */

"use strict";

document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "wishScreen") initWishScreen();
});

function initWishScreen() {

    const screen = document.getElementById("wishScreen");

    screen.innerHTML = `
        <div class="wish-wrap">

            <div class="wish-stars-bg" id="wishStarsBg"></div>

            <div class="wish-content" id="wishContent">
                <p class="wish-title">Make a Wish ✨</p>
                <p class="wish-subtitle">Close your eyes, feel it deeply, then write it here...</p>

                <div class="wish-jar-wrap" id="wishJarWrap">
                    <div class="wish-jar" id="wishJar">
                        <div class="jar-glow"></div>
                        <div class="jar-body">
                            <div class="jar-shine"></div>
                            <div class="jar-particles" id="jarParticles"></div>
                        </div>
                        <div class="jar-lid"></div>
                        <div class="jar-label">✦ Wish Jar ✦</div>
                    </div>
                </div>

                <div class="wish-input-section" id="wishInputSection">
                    <textarea
                        id="wishTextarea"
                        class="wish-textarea"
                        placeholder="Write your birthday wish here... 🌸"
                        maxlength="200"
                    ></textarea>
                    <p class="wish-char-count"><span id="wishCharCount">0</span> / 200</p>
                    <button class="wish-seal-btn" id="wishSealBtn">Seal My Wish 🔮</button>
                </div>
            </div>

            <div class="wish-sealed-msg" id="wishSealedMsg" style="display:none;">
                <p class="wish-sealed-title">Your wish has been sealed</p>
                <p class="wish-sealed-sub">It is now floating among the stars, carried by the universe to where it belongs 🌌</p>
                <button class="wish-continue-btn" id="wishContinueBtn">Continue the Journey ✨</button>
            </div>

        </div>
    `;

    // Spawn background stars
    spawnWishStars();

    // Animate jar in
    gsap.from(".wish-title",    { y: -30, opacity: 0, duration: 1,   delay: 0.2, ease: "power3.out" });
    gsap.from(".wish-subtitle", { y: -20, opacity: 0, duration: 0.8, delay: 0.5 });
    gsap.from(".wish-jar-wrap", { scale: 0, opacity: 0, duration: 1.2, delay: 0.7, ease: "elastic.out(1,.6)" });
    gsap.from(".wish-input-section", { y: 30, opacity: 0, duration: 0.8, delay: 1.1 });

    // Jar particle loop
    startJarParticles();

    // Char counter
    const textarea  = document.getElementById("wishTextarea");
    const charCount = document.getElementById("wishCharCount");
    textarea.addEventListener("input", () => {
        charCount.textContent = textarea.value.length;
    });

    // Seal button
    document.getElementById("wishSealBtn").addEventListener("click", sealWish);
}

function startJarParticles() {
    const container = document.getElementById("jarParticles");
    if (!container) return;

    setInterval(() => {
        if (!document.getElementById("jarParticles")) return;
        const p = document.createElement("span");
        p.textContent = ["✨","💫","⭐","🌟"][Math.floor(Math.random() * 4)];
        p.style.cssText = `
            position:absolute;
            left:${10 + Math.random() * 80}%;
            bottom:${Math.random() * 60}%;
            font-size:${8 + Math.random() * 8}px;
            opacity:0;
            pointer-events:none;
        `;
        container.appendChild(p);
        gsap.to(p, {
            y: -(20 + Math.random() * 30),
            opacity: 0.8,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => gsap.to(p, {
                y: -(50 + Math.random() * 40),
                opacity: 0,
                duration: 0.8,
                onComplete: () => p.remove()
            })
        });
    }, 400);
}

function sealWish() {

    const textarea = document.getElementById("wishTextarea");
    const wish     = textarea.value.trim();

    if (!wish) {
        gsap.fromTo(textarea,
            { x: -8 }, { x: 8, duration: 0.08, repeat: 5, yoyo: true,
              onComplete: () => gsap.set(textarea, { x: 0 }) }
        );
        return;
    }

    const sealBtn = document.getElementById("wishSealBtn");
    sealBtn.disabled = true;

    // Send wish via EmailJS
    emailjs.send("service_p6pdu4o", "template_hwa3tl6", {
        wish_message: wish,
        sent_at: new Date().toLocaleString()
    });

    // 1 — wish text floats into jar
    gsap.to(".wish-input-section", { y: 20, opacity: 0, duration: 0.5 });

    // 2 — jar glows and seals
    gsap.timeline({ delay: 0.4 })

        .to(".jar-glow", { opacity: 1, scale: 1.4, duration: 0.6, ease: "power2.out" })

        .to(".jar-lid", { y: -8, duration: 0.3, ease: "power2.out" }, "-=0.2")

        .to(".jar-lid", { y: 0,  duration: 0.4, ease: "bounce.out" })

        .to(".jar-glow", { opacity: 0.3, scale: 1, duration: 0.5 })

        // 3 — jar floats up and dissolves into stars
        .to("#wishJar", { y: -30, scale: 1.1, duration: 0.6, ease: "power2.inOut" })

        .to("#wishJar", {
            y: -200, scale: 0, opacity: 0,
            duration: 1.2, ease: "power3.in",
            onComplete: () => releaseWishStars(wish)
        });
}

function releaseWishStars(wish) {

    const screen = document.getElementById("wishScreen");
    if (!screen) return;

    // Burst of stars from centre
    for (let i = 0; i < 24; i++) {
        const s = document.createElement("span");
        s.textContent = ["✨","💫","⭐","🌟","🌸","💝"][Math.floor(Math.random() * 6)];
        s.style.cssText = `
            position:fixed;
            left:50%; top:50%;
            font-size:${14 + Math.random() * 18}px;
            pointer-events:none;
            z-index:9999;
        `;
        document.body.appendChild(s);

        const angle = (i / 24) * Math.PI * 2;
        const dist  = 120 + Math.random() * 200;

        gsap.fromTo(s,
            { x: 0, y: 0, opacity: 1, scale: 0 },
            {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 0,
                scale: 1.5,
                duration: 1.2 + Math.random() * 0.8,
                ease: "power2.out",
                onComplete: () => s.remove()
            }
        );
    }

    // Confetti burst
    confetti({
        particleCount: 100,
        spread: 360,
        startVelocity: 25,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#FFD166","#8B5CF6","#FF4D8D","#fff","#06b6d4"]
    });

    // Show sealed message
    setTimeout(() => {
        const msg = document.getElementById("wishSealedMsg");
        if (!msg) return;
        msg.style.display = "flex";
        gsap.fromTo(msg,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.4)" }
        );

        document.getElementById("wishContinueBtn").addEventListener("click", () => {
            Scenes.show("cakeScreen");
        });
    }, 1400);
}

function spawnWishStars() {
    const bg = document.getElementById("wishStarsBg");
    if (!bg) return;
    for (let i = 0; i < 60; i++) {
        const s = document.createElement("span");
        s.style.cssText = `
            position:absolute;
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            width:${1 + Math.random() * 2}px;
            height:${1 + Math.random() * 2}px;
            border-radius:50%;
            background:white;
            opacity:${0.1 + Math.random() * 0.5};
            animation: wishStarTwinkle ${2 + Math.random() * 3}s ${Math.random() * 3}s ease-in-out infinite;
        `;
        bg.appendChild(s);
    }
}
