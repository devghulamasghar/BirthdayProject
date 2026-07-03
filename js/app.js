/**
 * ==========================================================
 * PROJECT AURORA
 * Main Application Controller
 * Version : 2.0
 * Author  : Ghulam Asghar
 * ==========================================================
 */

"use strict";

const Aurora = {

    userName: "",

    musicChoice: "",

    started: false

};

// Scripts are at bottom of body, DOM is ready
Scenes.registerAll();

const continueBtn = document.getElementById("continueBtn");
const nameInput = document.getElementById("nameInput");

if (continueBtn) {
    continueBtn.addEventListener("click", saveName);
}

function saveName() {

    const value = nameInput.value.trim();

    if (value === "") {
        nameInput.focus();
        return;
    }

    Aurora.userName = value;
    localStorage.setItem("aurora_name", value);

    Scenes.show("musicScreen");

}

window.addEventListener("load", () => {

    console.log(CONFIG.APP_NAME + " started");

    Aurora.started = true;

    startLoadingAnimation();

});
