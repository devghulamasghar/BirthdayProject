/**
 * ==========================================================
 * PROJECT AURORA
 * Floating Art Gallery - Slideshow
 * ==========================================================
 */

"use strict";

class Gallery {

    constructor() {

        this.images = CONFIG.GALLERY;

        this.container = document.getElementById("galleryScreen");

        this.current = 0;

    }

    init() {

        // If slideshow already rendered, just re-attach button listeners
        if (this.container.querySelector(".slideshow")) {
            const doneBtn = this.container.querySelector("#galleryDoneBtn");
            const apologyBtn = this.container.querySelector("#galleryApologyBtn");
            if (doneBtn) doneBtn.onclick = () => Scenes.show("letterScreen");
            if (apologyBtn) apologyBtn.onclick = () => Scenes.show("apologyScreen");
            attachPortalClick();
            return;
        }

        const portal = document.getElementById("portal");

        if (!portal) return;

        // Use { once: true } so the listener never stacks on revisit
        portal.addEventListener("click", () => this.openGallery(), { once: true });

    }

    openGallery() {

        gsap.timeline()

            .to("#portal", {

                scale: 7,

                rotation: 720,

                duration: 2,

                ease: "power4.inOut"

            })

            .to(".portal-container", {

                opacity: 0,

                duration: .8

            }, "-=.8")

            .call(() => this.renderSlideshow());

    }

    renderSlideshow() {

        this.container.innerHTML = `
            <div class="slideshow">
                <h1 class="gallery-title">Your Beautiful World</h1>
                <div class="slide-wrapper">
                    <button class="slide-btn prev-btn">&#8592;</button>
                    <div class="slide-img-wrap">
                        <img id="slideImg" src="${this.images[0]}" alt="Artwork 1">
                    </div>
                    <button class="slide-btn next-btn">&#8594;</button>
                </div>
                <p class="slide-counter">1 / ${this.images.length}</p>
                <div class="gallery-btns">
                    <button class="slide-done-btn" id="galleryDoneBtn">Open Letter 💌</button>
                    <button class="slide-done-btn" id="galleryApologyBtn">Read Apology 🤍</button>
                </div>
                ${worldPortalHTML()}
            </div>
        `;

        this.container.querySelector(".prev-btn").addEventListener("click", () => this.prev());

        this.container.querySelector(".next-btn").addEventListener("click", () => this.next());

        this.container.querySelector("#galleryDoneBtn").addEventListener("click", () => Scenes.show("letterScreen"));

        this.container.querySelector("#galleryApologyBtn").addEventListener("click", () => Scenes.show("apologyScreen"));

        attachPortalClick();

        gsap.from(".slide-img-wrap", { opacity: 0, scale: .8, duration: 1 });

    }

    goTo(index) {

        const img = document.getElementById("slideImg");

        const counter = this.container.querySelector(".slide-counter");

        gsap.to(".slide-img-wrap", {

            opacity: 0,

            x: -40,

            duration: .3,

            onComplete: () => {

                this.current = index;

                img.src = this.images[this.current];

                counter.textContent = `${this.current + 1} / ${this.images.length}`;

                gsap.fromTo(".slide-img-wrap",

                    { opacity: 0, x: 40 },

                    { opacity: 1, x: 0, duration: .4 }

                );

            }

        });

    }

    next() {

        const index = (this.current + 1) % this.images.length;

        this.goTo(index);

    }

    prev() {

        const index = (this.current - 1 + this.images.length) % this.images.length;

        this.goTo(index);

    }

}

const gallery = new Gallery();

gallery.init();

document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "galleryScreen") gallery.init();
});
