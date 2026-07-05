/**
 * =====================================================
 * LETTER ENGINE
 * =====================================================
 */

"use strict";

const LETTER = `Happy Birthday, Rudaba. ❤️

Today isn't just another date on the calendar—it's the day the world became a little more beautiful because you became a part of it.

I don't know what the future holds, but I truly hope it brings you every happiness you've ever wished for, every dream you've quietly carried in your heart, and every smile you deserve.

May your days always be filled with peace, your heart with endless joy, and your life with people who value you as much as you deserve to be valued.

This little surprise isn't just made with code. It's made with time, patience, countless thoughts, and a heart that wanted to create something as special as you.

On your birthday, I don't wish for anything extraordinary.

I simply wish that you never lose your beautiful smile, your kind heart, and the light that makes you uniquely you.

No matter how many birthdays pass, I hope every new year of your life becomes even more beautiful than the last.

Happy Birthday, Rudaba.

May Allah bless you with happiness, success, good health, peace, and countless reasons to smile. Ameen. 🌸

— Ghulam Asghar`;

// Re-initialize every time the screen becomes active
document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "letterScreen") initLetterScreen();
});

function initLetterScreen() {

    const screen = document.getElementById("letterScreen");

    screen.innerHTML = `
        <div class="letter-container">
            <div id="envelope">
                <div class="envelope-back"></div>
                <div class="envelope-flap"></div>
                <div class="wax-seal">❤️</div>
                <div class="letter-paper"><div id="letterContent"></div></div>
            </div>
        </div>
        <p class="envelope-hint">Click the envelope to open 💌</p>
    `;

    const env = document.getElementById("envelope");

    gsap.fromTo(env,
        { y: 300, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.4)",
          onComplete: () => {
              gsap.to(env, { y: -12, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
              env.addEventListener("click", openLetter, { once: true });
          }
        }
    );
}

function openLetter() {

    const env = document.getElementById("envelope");
    const screen = document.getElementById("letterScreen");

    gsap.killTweensOf(env);

    const hint = screen.querySelector(".envelope-hint");
    if (hint) gsap.to(hint, { opacity: 0, duration: 0.3 });

    gsap.timeline()

        .to(".wax-seal", {
            scale: 0,
            rotation: 360,
            duration: 0.6,
            ease: "back.in"
        })

        .to(".envelope-flap", {
            rotationX: -180,
            duration: 0.8,
            ease: "power2.inOut"
        })

        .to("#envelope", {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in"
        })

        .call(() => showLetterPage());
}

function showLetterPage() {

    const screen = document.getElementById("letterScreen");

    screen.innerHTML = `
        <div class="letter-page">
            <div class="letter-border-wrap">
                <div class="letter-corner tl"></div>
                <div class="letter-corner tr"></div>
                <div class="letter-corner bl"></div>
                <div class="letter-corner br"></div>
            </div>
            <div class="letter-body">
                <div id="letterContent"></div>
                <div class="letter-back-wrap">
                    <button class="letter-back-btn" onclick="Scenes.show('cakeScreen')">Continue to Cake 🎂</button>
                </div>
            </div>
        </div>
    `;

    gsap.fromTo(".letter-page",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out",
          onComplete: () => typeLetter()
        }
    );
}

function typeLetter() {

    const screen  = document.getElementById("letterScreen");
    const content = document.getElementById("letterContent");
    content.innerHTML = "";

    // Blinking cursor
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.textContent = "|";
    content.appendChild(cursor);

    // Scroll hint
    const scrollHint = screen.querySelector(".letter-body");
    if (scrollHint) scrollHint.setAttribute("data-scroll-hint", "scroll to read ↓");

    let i = 0;

    const timer = setInterval(() => {

        const char = LETTER.charAt(i);
        cursor.insertAdjacentText("beforebegin", char === "\n" ? "" : char);
        if (char === "\n") cursor.insertAdjacentHTML("beforebegin", "<br>");

        i++;

        content.parentElement.scrollTop = content.parentElement.scrollHeight;

        if (i >= LETTER.length) {
            clearInterval(timer);
            cursor.remove();
            const btn = screen.querySelector(".letter-back-wrap");
            if (btn) gsap.fromTo(btn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });
        }

    }, 22);
}
