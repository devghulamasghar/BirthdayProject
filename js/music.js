/**
 * ==========================================================
 * PROJECT AURORA — Music Controller
 * ==========================================================
 */

"use strict";

const bgMusic       = document.getElementById("bgMusic");
const myChoiceCard  = document.getElementById("myChoiceCard");
const myChoiceList  = document.getElementById("myChoiceList");
const songContinueBtn = document.getElementById("songContinueBtn");

document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "musicScreen") {
        // Reset card selections and sub-list on replay
        document.querySelectorAll(".music-card").forEach(c => c.classList.remove("selected"));
        document.querySelectorAll(".song-item").forEach(s => {
            s.classList.remove("playing");
            s.querySelector(".song-item-hint").textContent = "play";
        });
        myChoiceList.classList.remove("open");
        myChoiceCard.querySelector(".my-choice-arrow").style.transform = "";
        songContinueBtn.style.display = "none";
    }
});

/* ── Regular cards (birthday, piano, silent) ── */
document.querySelectorAll(".music-card:not(#myChoiceCard)").forEach(card => {

    card.addEventListener("click", () => {

        const song = card.dataset.song;

        selectCard(card);
        Aurora.musicChoice = song;

        if (song !== "silent") playMusic(song);

        setTimeout(() => goToStory(), 600);

    });

});

/* ── My Choice card — toggle sub-list ── */
myChoiceCard.addEventListener("click", () => {

    const open = myChoiceList.classList.toggle("open");

    myChoiceCard.querySelector(".my-choice-arrow").style.transform = open ? "rotate(90deg)" : "";

    // Deselect other cards visually
    if (open) {
        document.querySelectorAll(".music-card:not(#myChoiceCard)").forEach(c => c.classList.remove("selected"));
        myChoiceCard.classList.add("selected");
    } else {
        myChoiceCard.classList.remove("selected");
    }

});

/* ── Song items inside sub-list ── */
document.querySelectorAll(".song-item").forEach(item => {

    item.addEventListener("click", () => {

        const song = item.dataset.song;

        // Highlight this item
        document.querySelectorAll(".song-item").forEach(s => s.classList.remove("playing"));
        item.classList.add("playing");
        item.querySelector(".song-item-hint").textContent = "playing";

        Aurora.musicChoice = song;
        playMusic(song);

        // Show continue button
        songContinueBtn.style.display = "block";
        gsap.fromTo(songContinueBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });

    });

});

/* ── Continue button ── */
songContinueBtn.addEventListener("click", () => goToStory());

/* ── Helpers ── */
function playMusic(src) {
    bgMusic.src = src;
    bgMusic.volume = CONFIG.MUSIC_VOLUME;
    bgMusic.load();
    bgMusic.play().catch(() => {});
}

function selectCard(card) {
    document.querySelectorAll(".music-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
}

function goToStory() {
    Scenes.show("storyScreen").then(() => startStory());
}
