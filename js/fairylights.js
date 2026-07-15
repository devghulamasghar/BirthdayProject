// Fairy lights strung across the top of the page — twinkles from the start,
// rebuilt responsively on resize.
(function () {
    const svgNS = "http://www.w3.org/2000/svg";

    const container = document.createElement("div");
    container.id = "fairyLightsContainer";
    document.body.appendChild(container);

    const COLORS   = ["#FFD166", "#FF4D8D", "#8B5CF6", "#06b6d4", "#ff9de2", "#ffffff"];
    const SEG_W    = 150;   // approx distance between "hook" points
    const SAG      = 34;    // how much each swag droops
    const BULBS_PER_SEGMENT = 5;

    function build() {
        const w = window.innerWidth;
        const segments   = Math.max(2, Math.round(w / SEG_W));
        const actualSegW = w / segments;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "90");
        svg.setAttribute("viewBox", `0 0 ${w} 90`);
        svg.setAttribute("preserveAspectRatio", "none");

        let colorIndex = 0;

        for (let i = 0; i < segments; i++) {
            const x1   = i * actualSegW;
            const x2   = (i + 1) * actualSegW;
            const midX = (x1 + x2) / 2;
            const midY = 6 + SAG;

            const wire = document.createElementNS(svgNS, "path");
            wire.setAttribute("d", `M ${x1} 6 Q ${midX} ${midY} ${x2} 6`);
            wire.setAttribute("stroke", "rgba(255,255,255,.22)");
            wire.setAttribute("stroke-width", "1.5");
            wire.setAttribute("fill", "none");
            svg.appendChild(wire);

            for (let b = 1; b <= BULBS_PER_SEGMENT; b++) {
                const t = b / (BULBS_PER_SEGMENT + 1);
                const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
                const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * midY + t * t * 6;

                const g = document.createElementNS(svgNS, "g");
                g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);

                const drop = document.createElementNS(svgNS, "line");
                drop.setAttribute("x1", 0); drop.setAttribute("y1", 0);
                drop.setAttribute("x2", 0); drop.setAttribute("y2", 6);
                drop.setAttribute("stroke", "rgba(255,255,255,.3)");
                drop.setAttribute("stroke-width", "1");
                g.appendChild(drop);

                const color = COLORS[colorIndex % COLORS.length];
                colorIndex++;

                const bulb = document.createElementNS(svgNS, "circle");
                bulb.setAttribute("cx", 0);
                bulb.setAttribute("cy", 10);
                bulb.setAttribute("r", 4.5);
                bulb.setAttribute("fill", color);
                bulb.classList.add("fairy-bulb");
                bulb.style.setProperty("--glow", color);
                bulb.style.animationDuration = (1.2 + Math.random() * 1.8).toFixed(2) + "s";
                bulb.style.animationDelay    = (Math.random() * 3).toFixed(2) + "s";
                g.appendChild(bulb);

                svg.appendChild(g);
            }
        }

        container.innerHTML = "";
        container.appendChild(svg);
    }

    build();

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 250);
    });
})();
