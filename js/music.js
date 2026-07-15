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

// Now Playing bar
let nowPlayingBar = null;

function createNowPlayingBar() {
    if (document.getElementById("nowPlayingBar")) return;
    nowPlayingBar = document.createElement("div");
    nowPlayingBar.id = "nowPlayingBar";
    nowPlayingBar.innerHTML = `
        <span class="np-dot"></span>
        <span class="np-icon">🎵</span>
        <div class="np-wave">
            <span></span><span></span><span></span><span></span>
        </div>
        <span class="np-title" id="npTitle">Now Playing</span>
        <button class="np-mute" id="npMuteBtn" title="Mute / Unmute">🔊</button>
    `;
    document.body.appendChild(nowPlayingBar);

    // Mute toggle
    document.getElementById("npMuteBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        bgMusic.muted = !bgMusic.muted;
        e.currentTarget.textContent = bgMusic.muted ? "🔇" : "🔊";
    });
}

function showNowPlaying(name) {
    createNowPlayingBar();
    const bar = document.getElementById("nowPlayingBar");
    const title = document.getElementById("npTitle");
    if (title) title.textContent = name;
    // Only show after leaving the music screen
    const onLeave = (e) => {
        if (e.detail !== "musicScreen") {
            setTimeout(() => bar && bar.classList.add("visible"), 300);
            document.removeEventListener("sceneChanged", onLeave);
        }
    };
    document.addEventListener("sceneChanged", onLeave);
}

const SONG_NAMES = {
    "audio/birthday_song.mp3": "Birthday Song",
    "audio/tere_bin.mp3":      "Tere Bin",
    "audio/sadi_sun.mp3":      "Sadi Sun",
    "audio/piano.mp3":         "Piano"
};

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

        if (song !== "silent") {
            // Unlock audio context on this direct user gesture, then transition
            unlockAndPlay(song, () => setTimeout(() => goToStory(), 400));
        } else {
            setTimeout(() => goToStory(), 400);
        }

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

        document.querySelectorAll(".song-item").forEach(s => s.classList.remove("playing"));
        item.classList.add("playing");
        item.querySelector(".song-item-hint").textContent = "playing";

        Aurora.musicChoice = song;
        unlockAndPlay(song);
        showNowPlaying(SONG_NAMES[song] || "Music");

        songContinueBtn.style.display = "block";
        gsap.fromTo(songContinueBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });

    });

});

/* ── Continue button ── */
songContinueBtn.addEventListener("click", () => goToStory());

/* ── Helpers ── */
function unlockAndPlay(src, onReady) {
    if (window.AudioContext || window.webkitAudioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!unlockAndPlay._ctx) unlockAndPlay._ctx = new AudioCtx();
        if (unlockAndPlay._ctx.state === "suspended") {
            unlockAndPlay._ctx.resume();
        }
    }
    playMusic(src);
    if (onReady) onReady();
}

function playMusic(src) {
    bgMusic.pause();
    bgMusic.src = src;
    bgMusic.volume = CONFIG.MUSIC_VOLUME;
    bgMusic.loop = true;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Autoplay blocked — retry once on next user interaction
            const retry = () => { bgMusic.play().catch(() => {}); document.removeEventListener("touchstart", retry); document.removeEventListener("click", retry); };
            document.addEventListener("touchstart", retry, { once: true });
            document.addEventListener("click",      retry, { once: true });
        });
    }
    bgMusic.onended = null; // loop=true handles it natively
}

function selectCard(card) {
    document.querySelectorAll(".music-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
}

function goToStory() {
    Scenes.show("storyScreen").then(() => startStory());
}
