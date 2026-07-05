// Cake Screen — tap candles to blow them out
"use strict";

document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "cakeScreen") initCakeScreen();
});

function initCakeScreen() {
    const screen = document.getElementById("cakeScreen");
    screen.innerHTML = `
        <div class="cake-screen-wrap">
            <p class="cake-instruction">Tap each candle to blow it out 🎂</p>
            <div class="big-cake">
                <div class="big-cake-top">
                    <div class="big-candle" data-lit="true"><div class="big-flame"></div></div>
                    <div class="big-candle" data-lit="true"><div class="big-flame"></div></div>
                    <div class="big-candle" data-lit="true"><div class="big-flame"></div></div>
                    <div class="big-candle" data-lit="true"><div class="big-flame"></div></div>
                    <div class="big-candle" data-lit="true"><div class="big-flame"></div></div>
                </div>
                <div class="big-cake-mid"></div>
                <div class="big-cake-base"></div>
                <div class="big-cake-plate"></div>
            </div>
            <p class="cake-sub" id="cakeSub">Make a wish... ✨</p>
        </div>
    `;

    const candles = screen.querySelectorAll(".big-candle");
    let blown = 0;

    candles.forEach(candle => {
        candle.addEventListener("click", () => {
            if (candle.dataset.lit !== "true") return;
            candle.dataset.lit = "false";
            const flame = candle.querySelector(".big-flame");

            // Puff out animation
            gsap.to(flame, { scaleY: 2, scaleX: 0.2, opacity: 0, duration: 0.3, ease: "power2.out",
                onComplete: () => flame.style.display = "none"
            });

            // Smoke puff
            const smoke = document.createElement("div");
            smoke.className = "candle-smoke";
            candle.appendChild(smoke);
            gsap.fromTo(smoke, { opacity: 0.6, y: 0, scale: 1 }, { opacity: 0, y: -30, scale: 2, duration: 0.8,
                onComplete: () => smoke.remove()
            });

            blown++;
            const sub = document.getElementById("cakeSub");

            if (blown === candles.length) {
                sub.textContent = "🎉 Wish made! Happy Birthday Rudaba! 🌸";
                gsap.fromTo(sub, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "back.out" });
                // Confetti burst
                confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 },
                    colors: ["#8B5CF6","#FF4D8D","#FFD166","#ff9de2","#fff"] });
                setTimeout(() => Scenes.show("letterScreen"), 2800);
            } else {
                const msgs = ["", "Keep going... 🌸", "Almost there... ✨", "One more! 💫", "Last one! 🎀"];
                sub.textContent = msgs[blown] || "Keep going...";
            }
        });
    });

    gsap.from(".big-cake", { scale: 0.5, opacity: 0, duration: 1, ease: "back.out(1.4)" });
    gsap.from(".cake-instruction", { y: -20, opacity: 0, duration: 0.8, delay: 0.5 });
}
