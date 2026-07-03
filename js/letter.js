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

const envelope = document.getElementById("envelope");
const letterScreen = document.getElementById("letterScreen");

if (envelope) {
    envelope.addEventListener("click", openLetter);
}

function openLetter() {

    // Remove click so it doesn't fire twice
    envelope.removeEventListener("click", openLetter);

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

    letterScreen.innerHTML = `
        <div class="letter-page">
            <div class="letter-border-wrap">
                <div class="letter-corner tl"></div>
                <div class="letter-corner tr"></div>
                <div class="letter-corner bl"></div>
                <div class="letter-corner br"></div>
            </div>
            <div class="letter-body">
                <div id="letterContent"></div>
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

    const content = document.getElementById("letterContent");
    content.innerHTML = "";

    let i = 0;

    const timer = setInterval(() => {

        const char = LETTER.charAt(i);

        if (char === "\n") {
            content.innerHTML += "<br>";
        } else {
            content.innerHTML += char;
        }

        i++;

        // Auto scroll as text appears
        content.parentElement.scrollTop = content.parentElement.scrollHeight;

        if (i >= LETTER.length) {
            clearInterval(timer);
        }

    }, 22);
}
