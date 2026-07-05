/**
 * ==========================================================
 * PROJECT AURORA
 * Scene Manager v2
 * ==========================================================
 */

"use strict";

class SceneManager {

    constructor() {

        this.current = null;

        this.scenes = {};

        this.history = [];

    }

    register(id) {

        const element = document.getElementById(id);

        if (!element) {

            console.warn(id + " not found.");

            return;

        }

        this.scenes[id] = element;

    }

    registerAll() {

        document.querySelectorAll(".screen").forEach(screen => {

            this.scenes[screen.id] = screen;

        });

    }

    hideAll() {

        Object.values(this.scenes).forEach(scene => {

            scene.classList.remove("active");

        });

    }

    async show(id) {

        if (!this.scenes[id]) {

            console.error(id + " doesn't exist.");

            return;

        }

        this.hideAll();

        const scene = this.scenes[id];

        scene.classList.add("active");

        this.current = id;

        this.history.push(id);

        await gsap.fromTo(

            scene,

            {
                opacity:0,
                y:40,
                scale:.97
            },

            {
                opacity:1,
                y:0,
                scale:1,
                duration:1,
                ease:"power3.out"
            }

        );

        document.dispatchEvent(new CustomEvent("sceneChanged", { detail: id }));

        // Show nav buttons on all screens except the first three
        const noBack = ["loadingScreen", "nameScreen", "musicScreen"];

        const nav = document.getElementById("globalNav");

        if (nav) nav.style.display = noBack.includes(id) ? "none" : "flex";

    }

    async fade(id){

        if(!this.scenes[id]) return;

        this.hideAll();

        const scene=this.scenes[id];

        scene.classList.add("active");

        this.current=id;

        this.history.push(id);

        await gsap.fromTo(

            scene,

            {

                opacity:0

            },

            {

                opacity:1,

                duration:1.5

            }

        );

    }

    getCurrent(){

        return this.current;

    }

    back() {

        this.history.pop();

        const prev = this.history[this.history.length - 1];

        if (prev) {

            this.history.pop();

            this.show(prev);

        }

    }

    backToStart() {

        this.history = [];

        // Stop and reset music so replay starts fresh
        const music = document.getElementById("bgMusic");
        if (music) {
            music.pause();
            music.currentTime = 0;
            music.src = "";
        }

        this.show("nameScreen");

    }

}

const Scenes = new SceneManager();