/**
 * ==========================================================
 * PROJECT AURORA
 * Typewriter Story
 * ==========================================================
 */

"use strict";

function getStoryLines() {
    const name = (Aurora.userName || "Rudaba").trim();
    return CONFIG.STORY.map(line => line.replace(/{name}/g, name));
}

let currentLine = 0;
let activeStoryLines = [];
let typeTimer = null;

const storyText = document.getElementById("storyText");
const nextBtn = document.getElementById("storyNextBtn");

function typeStory(text, speed = 45){

    storyText.textContent = "";
    nextBtn.style.display = "none";
    if (typeTimer) clearTimeout(typeTimer);

    // Remove any previous click handler
    storyText.onclick = null;

    const words = text.split(" ");
    let i = 0;
    const delay = Math.max(speed * 3, 120);

    function revealNext() {
        if (i >= words.length) {
            typeTimer = null;
            nextBtn.style.display = "inline-block";
            gsap.from(nextBtn, { opacity:0, y:20, duration:.7, ease:"power3.out" });
            storyText.onclick = null;
            return;
        }
        const span = document.createElement("span");
        span.className = "story-word";
        span.textContent = words[i] + (i < words.length - 1 ? "\u00A0" : "");
        storyText.appendChild(span);
        i++;
        typeTimer = setTimeout(revealNext, delay);
    }

    revealNext();

    // Tap to skip — show all words instantly
    storyText.onclick = () => {
        if (typeTimer) {
            clearTimeout(typeTimer);
            typeTimer = null;
            storyText.textContent = "";
            words.forEach((w, idx) => {
                const span = document.createElement("span");
                span.className = "story-word";
                span.textContent = w + (idx < words.length - 1 ? "\u00A0" : "");
                span.style.animationDelay = (idx * 25) + "ms";
                storyText.appendChild(span);
            });
            nextBtn.style.display = "inline-block";
            gsap.from(nextBtn, { opacity:0, y:20, duration:.7, ease:"power3.out" });
            storyText.onclick = null;
        }
    };

}

function nextStory(){

    currentLine++;

    if(currentLine >= activeStoryLines.length){

        Scenes.show("galleryScreen");

        return;

    }

    nextBtn.style.display = "none";

    typeStory(activeStoryLines[currentLine]);

}

function startStory() {
    currentLine = 0;
    activeStoryLines = getStoryLines();
    nextBtn.style.display = "none";
    typeStory(activeStoryLines[0]);
}

if(nextBtn) nextBtn.addEventListener("click", nextStory);