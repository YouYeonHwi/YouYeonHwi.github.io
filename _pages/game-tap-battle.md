---
layout: game
title: "배틀 탭 - 2인용 대결"
permalink: /game-tap-battle/
---

<style>
    .battle-container {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        z-index: 5;
    }

    #p1-area {
        background: linear-gradient(to bottom, #ff00c8, #7000ff);
        height: 50%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 900;
        color: white;
        user-select: none;
        transition: height 0.1s ease-out;
    }

    #p2-area {
        background: linear-gradient(to top, #00f2ff, #0072ff);
        height: 50%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 900;
        color: white;
        user-select: none;
        transition: height 0.1s ease-out;
    }

    .battle-ui {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        text-align: center;
    }

    .vs-circle {
        background: white;
        color: black;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }

    /* Override game.html styles for full screen */
    header, footer, .ad-slot-top, .shop-container, .game-container {
        display: none !important;
    }

    .win-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        z-index: 100;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .win-overlay.hidden { display: none; }
</style>

<div class="battle-container">
    <div id="p1-area">TAP HERE!</div>
    <div id="p2-area">TAP HERE!</div>
</div>

<div class="battle-ui">
    <div class="vs-circle">VS</div>
</div>

<div id="win-overlay" class="win-overlay hidden">
    <h1 id="battle-message" style="font-size: 3rem; margin-bottom: 2rem;">WINS!</h1>
    <div style="display: flex; gap: 1rem;">
        <a href="{{ site.baseurl }}/games/" class="btn" style="background: var(--glass); text-decoration: none;">MENU</a>
        <button class="btn" onclick="resetGame()">REMATCH</button>
    </div>
</div>

<script src="{{ site.baseurl }}/assets/js/tap_battle.js"></script>
