// Falling petals — runs globally, capped for performance
(function () {
    const petals = ["🌸", "🌺", "✨", "🌷", "💮"];
    const container = document.createElement("div");
    container.id = "petalsContainer";
    container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99998;overflow:hidden;";
    document.body.appendChild(container);

    const MAX    = 30;
    const mobile = window.innerWidth < 600;
    const RATE   = mobile ? 1200 : 700;

    function spawnPetal() {
        if (container.children.length >= MAX) return;

        const el       = document.createElement("span");
        el.textContent = petals[Math.floor(Math.random() * petals.length)];
        const size     = 14 + Math.random() * 14;
        const duration = 6 + Math.random() * 8;
        const delay    = Math.random() * 3;

        el.style.cssText = `
            position:absolute;
            left:${Math.random() * 100}%;
            top:-40px;
            font-size:${size}px;
            opacity:0;
            animation:petalFall ${duration}s ${delay}s linear forwards;
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), (duration + delay) * 1000);
    }

    const style = document.createElement("style");
    style.textContent = `
        @keyframes petalFall {
            0%   { transform:translateY(0) rotate(0deg) translateX(0);       opacity:0;  }
            5%   { opacity:.8; }
            90%  { opacity:.5; }
            100% { transform:translateY(105vh) rotate(360deg) translateX(40px); opacity:0; }
        }
    `;
    document.head.appendChild(style);

    // Don't spawn during loading — start after loading screen exits
    document.addEventListener("sceneChanged", function startPetals() {
        setInterval(spawnPetal, RATE);
        for (let i = 0; i < 5; i++) spawnPetal();
        document.removeEventListener("sceneChanged", startPetals);
    });
})();
