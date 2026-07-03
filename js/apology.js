/**
 * =====================================================
 * APOLOGY LETTER
 * =====================================================
 */

"use strict";

const APOLOGY = `Rudaba, ❤️

Sab se pehle... I'm truly sorry.

Sab se pehle us har galti ke liye maafi chahta hoon jo meri wajah se tumhein takleef pohanchi. Dil se yaqeen karo, mera kabhi bhi irada tumhein dukh dene ka nahi tha.

Main hamesha yehi chahta hoon ke jab bhi tum se baat karoon, tumhare chehre par muskurahat le aaun. Main chahta hoon ke apni har baat tumhare saath share karoon, tumhari baatein sunoon aur tumhari khushi ki wajah banoon. Mere dil mein kabhi ye khayal nahi aaya ke main tumhein gussa dilaoon ya tumhara dil dukhaoon.

Us din jab tum prank kar rahi thi, mujhe poora yaqeen tha ke woh tum hi ho. Shayad isi yaqeen mein maine aisa behave kiya jo mujhe nahi karna chahiye tha. Us baat ke liye dil se maafi chahta hoon. Kaash main us lamhe ko wapas laa sakta aur us tarah react na karta.

Aur ek aur baat... account deactivate karne ke liye bhi mujhe maaf kar do. Mera irada sirf kuch ghanton ke liye deactivate karne ka tha, lekin Allah ki marzi kuch aur thi. Main achanak bemaar ho gaya tha, aur maine tumhein baad mein bataya bhi. Ye koi bahana nahi hai, bas wohi sach tha jo hua.

Please... please... please mujhe maaf kar do.

Har din meri zindagi ka ek hissa ban chuka hai jahan tumhari yaad zaroor aati hai. Aisa koi din nahi guzarta jab maine tumhein yaad na kiya ho. Ye baat main sirf keh nahi raha, dil se mehsoos karta hoon.

Agar meri wajah se tumhara dil toota hai, to us baat ka mujhe sach mein afsos hai. Main sirf itna chahta hoon ke ek baar meri maafi qabool kar lo. Main apni ghalti se seekh chuka hoon aur kabhi jaan-boojh kar tumhein takleef nahi doon ga.

Allah ko gawah bana kar kehta hoon, meri niyyat kabhi bhi tumhara dil dukhane ki nahi thi.

Apni zindagi mein bohot log milte hain, lekin kuch log aise hote hain jinhein khona insaan kabhi nahi chahta. Tum unhi logon mein se ho.

I am truly, deeply, and sincerely sorry.

🤍 Allah tumhein hamesha khush rakhe, aur agar ho sake... to meri is dil se maangi hui maafi ko qabool kar lena.

— Ghulam Asghar`;

const apologyEnvelope = document.getElementById("apologyEnvelope");
const apologyScreen  = document.getElementById("apologyScreen");

// Called by SceneManager when this screen becomes active
function initApologyScreen() {

    // Reset in case user visits again
    apologyScreen.innerHTML = `
        <div class="letter-container">
            <div id="apologyEnvelope">
                <div class="envelope-back"></div>
                <div class="envelope-flap"></div>
                <div class="wax-seal">🤍</div>
                <div class="letter-paper"><div id="apologyContent"></div></div>
            </div>
        </div>
        <p class="envelope-hint">Click the envelope to open 💛</p>
    `;

    const env = document.getElementById("apologyEnvelope");

    // Fly in from bottom to centre
    gsap.fromTo(env,
        { y: 300, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.4)",
          onComplete: () => {
              // Gentle float
              gsap.to(env, { y: -12, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
              env.addEventListener("click", openApology);
          }
        }
    );
}

// Hook into scene transitions — run after Scenes.show("apologyScreen") settles
document.addEventListener("sceneChanged", (e) => {
    if (e.detail === "apologyScreen") initApologyScreen();
});

function openApology() {

    const env = document.getElementById("apologyEnvelope");
    env.removeEventListener("click", openApology);

    // Stop the float
    gsap.killTweensOf(env);

    // Hide hint
    const hint = apologyScreen.querySelector(".envelope-hint");
    if (hint) gsap.to(hint, { opacity: 0, duration: 0.3 });

    gsap.timeline()

        .to("#apologyEnvelope .wax-seal", {
            scale: 0,
            rotation: 360,
            duration: 0.6,
            ease: "back.in"
        })

        .to("#apologyEnvelope .envelope-flap", {
            rotationX: -180,
            duration: 0.8,
            ease: "power2.inOut"
        })

        .to("#apologyEnvelope", {
            y: -30,
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in"
        })

        .call(() => showApologyPage());
}

function showApologyPage() {

    apologyScreen.innerHTML = `
        <div class="letter-page">
            <div class="letter-border-wrap">
                <div class="letter-corner tl"></div>
                <div class="letter-corner tr"></div>
                <div class="letter-corner bl"></div>
                <div class="letter-corner br"></div>
            </div>
            <div class="letter-body">
                <div id="apologyContent"></div>
                <div class="letter-back-wrap">
                    <button class="letter-back-btn" onclick="Scenes.show('cakeScreen')">Continue to Cake 🎂</button>
                </div>
            </div>
        </div>
    `;

    gsap.fromTo(".letter-page",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out",
          onComplete: () => typeApology()
        }
    );
}

function typeApology() {

    const content = document.getElementById("apologyContent");
    content.innerHTML = "";

    let i = 0;

    const timer = setInterval(() => {

        const char = APOLOGY.charAt(i);

        content.innerHTML += char === "\n" ? "<br>" : char;

        i++;

        content.parentElement.scrollTop = content.parentElement.scrollHeight;

        if (i >= APOLOGY.length) {
            clearInterval(timer);
            const btn = apologyScreen.querySelector(".letter-back-wrap");
            if (btn) gsap.fromTo(btn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 });
        }

    }, 22);
}
