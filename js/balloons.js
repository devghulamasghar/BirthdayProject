// Floating balloons — rise from the bottom, sway, and fade near the top.
// Runs globally, capped for performance. Mirrors js/petals.js.
(function () {
    const container = document.createElement("div");
    container.id = "balloonsContainer";
    document.body.appendChild(container);

    // [ bodyColor, shadowColor, glowColor ]
    const PALETTE = [
        ["#a78bfa", "#6d28d9", "rgba(139,92,246,.55)"],   // purple
        ["#ff6eb4", "#c2185b", "rgba(255,77,141,.55)"],   // pink
        ["#ffd166", "#e6a100", "rgba(255,209,102,.5)"],   // gold
        ["#67e8f9", "#0891b2", "rgba(6,182,212,.5)"],     // cyan
        ["#ffb3ef", "#f472b6", "rgba(255,157,226,.5)"],   // rose
    ];

    const mobile = window.innerWidth < 768;
    const MAX    = mobile ? 5 : 10;
    const RATE   = mobile ? 3800 : 2400;

    function spawnBalloon() {
        if (container.children.length >= MAX) return;

        const [c1, c2, glow] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const size     = 46 + Math.random() * 30;
        const duration = 14 + Math.random() * 8;
        const left     = 4 + Math.random() * 88;

        const wrap = document.createElement("div");
        wrap.className = "floating-balloon";
        wrap.style.cssText = `
            left:${left}%;
            --bsize:${size}px;
            --bcolor1:${c1};
            --bcolor2:${c2};
            --bglow:${glow};
            animation-duration:${duration}s;
        `;

        wrap.innerHTML = `
            <div class="balloon-shape"></div>
            <div class="balloon-string"></div>
        `;

        container.appendChild(wrap);
        setTimeout(() => wrap.remove(), duration * 1000 + 200);
    }

    // Don't spawn during loading — start once the experience actually begins
    document.addEventListener("sceneChanged", function startBalloons() {
        setInterval(spawnBalloon, RATE);
        for (let i = 0; i < 3; i++) setTimeout(spawnBalloon, i * 500);
        document.removeEventListener("sceneChanged", startBalloons);
    });
})();
