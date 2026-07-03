/**
 * ==========================================================
 * PROJECT AURORA
 * Utility Functions
 * ==========================================================
 */

"use strict";

// ============================
// Select Element
// ============================

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);

// ============================
// Sleep
// ============================

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

// ============================
// Random
// ============================

function random(min,max){

    return Math.random()*(max-min)+min;

}

// ============================
// Integer Random
// ============================

function randomInt(min,max){

    return Math.floor(random(min,max));

}

// ============================
// Clamp
// ============================

function clamp(value,min,max){

    return Math.max(min,Math.min(max,value));

}

// ============================
// Fade In
// ============================

function fadeIn(element,duration=.8){

    gsap.fromTo(

        element,

        {
            opacity:0
        },

        {
            opacity:1,
            duration:duration
        }

    );

}

// ============================
// Fade Out
// ============================

function fadeOut(element,duration=.8){

    gsap.to(

        element,

        {
            opacity:0,
            duration:duration
        }

    );

}

// ============================
// Console
// ============================

if(CONFIG.DEBUG){

    console.log("Utilities Loaded");

}