/**
 * ==========================================================
 * PROJECT AURORA
 * Typewriter Story
 * ==========================================================
 */

"use strict";

const storyLines = [

    "Every star in this sky holds a wish...",

    "Tonight, one of those wishes belongs to you.",

    "Happy Birthday, Rudaba ❤️",

    "This little universe wasn't bought...",

    "It was built, piece by piece...",

    "Just to make you smile."

];

let currentLine = 0;

const storyText = document.getElementById("storyText");
const nextBtn = document.getElementById("storyNextBtn");

function typeStory(text, speed = 45){

    storyText.innerHTML = "";

    let i = 0;

    const timer = setInterval(() => {

        storyText.innerHTML += text.charAt(i);

        i++;

        if(i >= text.length){

            clearInterval(timer);

            nextBtn.style.display = "inline-block";

            gsap.from(nextBtn,{
                opacity:0,
                y:20,
                duration:.8
            });

        }

    }, speed);

}

function nextStory(){

    currentLine++;

    if(currentLine >= storyLines.length){

        Scenes.show("galleryScreen");

        return;

    }

    nextBtn.style.display = "none";

    typeStory(storyLines[currentLine]);

}

function startStory() {
    currentLine = 0;
    nextBtn.style.display = "none";
    typeStory(storyLines[0]);
}

if(nextBtn) nextBtn.addEventListener("click", nextStory);