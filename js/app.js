/**
 * ==========================================================
 * PROJECT AURORA
 * Main Application Controller
 * Version : 2.0
 * Author  : Ghulam Asghar
 * ==========================================================
 */

"use strict";

const Aurora = {

    userName: "",

    musicChoice: "",

    started: false

};

// Scripts are at bottom of body, DOM is ready
Scenes.registerAll();

const continueBtn = document.getElementById("continueBtn");
const nameInput = document.getElementById("nameInput");

if (continueBtn) {
    continueBtn.addEventListener("click", saveName);
}

if (nameInput) {
    nameInput.addEventListener("keydown", e => { if (e.key === "Enter") saveName(); });
}

function saveName() {

    const value = nameInput.value.trim();

    if (value === "") {
        nameInput.focus();
        return;
    }

    Aurora.userName = value;
    localStorage.setItem("aurora_name", value);

    // Confetti burst on Let's Begin
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 },
        colors: ["#8B5CF6","#FF4D8D","#FFD166","#ff9de2","#fff"] });

    Scenes.show("musicScreen");

}

window.addEventListener("load", () => {

    console.log(CONFIG.APP_NAME + " started");

    Aurora.started = true;

    // Inject aurora layer
    const auroraLayer = document.createElement("div");
    auroraLayer.id = "auroraLayer";
    auroraLayer.innerHTML = `
        <div class="aurora-blob a1"></div>
        <div class="aurora-blob a2"></div>
        <div class="aurora-blob a3"></div>
    `;
    document.body.appendChild(auroraLayer);

    // Cursor glow trail
    const glow = document.createElement("div");
    glow.id = "cursorGlow";
    document.body.appendChild(glow);

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });

    (function animateCursor() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        glow.style.left = cx + "px";
        glow.style.top  = cy + "px";
        requestAnimationFrame(animateCursor);
    })();

    // Hide cursor glow on touch devices
    window.addEventListener("touchstart", () => { glow.style.opacity = "0"; }, { once: true });

    startLoadingAnimation();

});
