// Fireworks + Ending Screen
"use strict";

document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "fireworksScreen") initFireworks();
});

function initFireworks() {

    const screen = document.getElementById("fireworksScreen");

    screen.innerHTML = `
        <div class="ending-wrap">
            <div class="ending-stars" id="endingStars"></div>
            <div class="ending-content">
                <p class="ending-from">From Ghulam Asghar, with love 💜</p>
                <h1 class="ending-title">Happy Birthday</h1>
                <p class="ending-name">Rudaba 🌸</p>
                <p class="ending-age" id="endingAge"></p>
                <p class="ending-msg">May every day of your life be as beautiful as you are.<br>This little world was built just for you —<br>because you deserve the whole universe. 🌌</p>
                <p class="ending-dua">اللہ تمہیں ہمیشہ خوش رکھے ❤️</p>

                <div class="ending-portal-section">
                    <p class="ending-portal-invite">A world of love awaits you...</p>
                    ${worldPortalHTML()}
                </div>

                <div class="ending-actions">
                    <button class="ending-share-btn" id="endingShareBtn">Share this World 🔗</button>
                    <button class="ending-replay-btn" onclick="Scenes.backToStart()">Replay from Start 🎀</button>
                </div>
            </div>
        </div>
    `;

    // Fireworks loop
    let fw = 0;
    const interval = setInterval(() => {
        confetti({
            particleCount: 80,
            angle: 60 + Math.random() * 60,
            spread: 70,
            origin: { x: Math.random(), y: Math.random() * 0.5 },
            colors: ["#8B5CF6","#FF4D8D","#FFD166","#ff9de2","#06b6d4","#fff"]
        });
        fw++;
        if (fw >= 12) clearInterval(interval);
    }, 500);

    // Animate content in
    gsap.from(".ending-from",           { y: 30, opacity: 0, duration: 0.8, delay: 0.3 });
    gsap.from(".ending-title",          { y: 40, opacity: 0, duration: 1,   delay: 0.7, ease: "back.out" });
    gsap.from(".ending-name",           { y: 30, opacity: 0, duration: 0.8, delay: 1.1 });
    gsap.from(".ending-age",            { y: 20, opacity: 0, duration: 0.8, delay: 1.3 });
    gsap.from(".ending-msg",            { y: 20, opacity: 0, duration: 0.8, delay: 1.5 });
    gsap.from(".ending-dua",            { y: 20, opacity: 0, duration: 0.8, delay: 2.0 });
    gsap.from(".ending-portal-section", { y: 30, opacity: 0, duration: 1,   delay: 2.6, ease: "power3.out" });
    gsap.from(".ending-actions",        { y: 20, opacity: 0, duration: 0.8, delay: 3.2 });

    // Birthday age line — change birth year to Rudaba's actual year
    const birthYear = 2002;
    const age = new Date().getFullYear() - birthYear;
    const ageEl = document.getElementById("endingAge");
    if (ageEl) ageEl.textContent = `✦ Turning ${age} today ✦`;

    // Share button
    const shareBtn = document.getElementById("endingShareBtn");
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            const url = "https://devghulamasghar.github.io/BirthdayProject/";
            if (navigator.share) {
                navigator.share({ title: "Happy Birthday Rudaba 🌸", url });
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    shareBtn.textContent = "Link Copied! ✓";
                    setTimeout(() => { shareBtn.textContent = "Share this World 🔗"; }, 2500);
                });
            }
        });
    }

    // Attach portal click directly
    const portalOrb = document.getElementById("worldPortalOrb");
    if (portalOrb) {
        portalOrb.addEventListener("click", enterWorld, { once: true });
    }

    // Floating stars
    const starsEl = document.getElementById("endingStars");
    for (let i = 0; i < 18; i++) {
        const s = document.createElement("span");
        s.textContent = ["⭐","✨","🌟","💫"][Math.floor(Math.random() * 4)];
        s.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${12+Math.random()*16}px;opacity:0;`;
        starsEl.appendChild(s);
        gsap.to(s, {
            opacity: 0.7, duration: 1, delay: Math.random() * 2,
            onComplete: () => gsap.to(s, { y: -20, opacity: 0.3, duration: 2 + Math.random() * 2, yoyo: true, repeat: -1, ease: "sine.inOut" })
        });
    }
}
