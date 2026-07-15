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

        // Kill any running GSAP tweens on all scenes to prevent conflicts
        Object.values(this.scenes).forEach(s => gsap.killTweensOf(s));

        this.hideAll();

        const scene = this.scenes[id];
        scene.classList.add("active");
        this.current = id;
        this.history.push(id);

        // Reset GSAP inline styles that may linger from previous animations
        gsap.set(scene, { clearProps: "filter,transform,opacity" });

        // Premium flash wipe between screens
        let flash = document.getElementById("sceneFlash");
        if (!flash) {
            flash = document.createElement("div");
            flash.id = "sceneFlash";
            flash.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(139,92,246,.18);pointer-events:none;z-index:99996;opacity:0;";
            document.body.appendChild(flash);
        }
        gsap.fromTo(flash,
            { opacity: 0.18 },
            { opacity: 0, duration: 0.55, ease: "power2.out" }
        );

        await gsap.fromTo(
            scene,
            { opacity: 0, y: 30, scale: .98 },
            { opacity: 1, y: 0,  scale: 1, duration: .75, ease: "power3.out" }
        );

        document.dispatchEvent(new CustomEvent("sceneChanged", { detail: id }));

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