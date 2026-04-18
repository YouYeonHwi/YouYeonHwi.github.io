---
layout: game
title: "게임 광장 | 2인용 커플 게임"
description: "커플이 함께 즐기는 2인용 미니 게임 모음입니다. 파이썬 공부 중간에 가볍게 내기 한 판!"
permalink: /games/
---

<style>
    .game-hub-container {
        width: 100%;
        max-width: 900px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        padding-bottom: 5rem;
    }

    .game-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        text-decoration: none;
        color: white;
        display: flex;
        flex-direction: column;
    }

    .game-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 30px rgba(0, 242, 255, 0.2);
        border-color: var(--primary);
    }

    .card-img {
        width: 100%;
        height: 160px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
    }

    .card-body {
        padding: 1.5rem;
        flex: 1;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.6rem;
        border-radius: 50px;
        background: var(--secondary);
        color: white;
    }

    .card-desc {
        font-size: 0.9rem;
        color: #aaa;
        line-height: 1.4;
    }

    .hero-section {
        text-align: center;
        margin-bottom: 3rem;
    }

    .hero-section h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(45deg, #fff, var(--primary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>

<div class="hero-section">
    <h1>커플 대항전: 2인용 미니게임</h1>
    <p>한 화면에서 두 명이 동시에 즐길 수 있는 게임 모음입니다.</p>
</div>

<div class="game-hub-container">
    <!-- Game 1 -->
    <a href="{{ site.baseurl }}/game-tap-battle/" class="game-card">
        <div class="card-img">⚡</div>
        <div class="card-body">
            <div class="card-title">배틀 탭 <span class="badge">모바일 추천</span></div>
            <p class="card-desc">누가 더 빨리 누를까요? 양쪽에서 탭하여 영역을 차지하세요!</p>
        </div>
    </a>

    <!-- Game 2 -->
    <a href="{{ site.baseurl }}/game/" class="game-card">
        <div class="card-img">🏃</div>
        <div class="card-body">
            <div class="card-title">네온 러너 <span class="badge">1인용</span></div>
            <p class="card-desc">장애물을 피해 최대한 멀리 가세요. 높은 점수로 크레딧을 모으세요!</p>
        </div>
    </a>

    <!-- Game 3 (Coming Soon) -->
    <div class="game-card" style="opacity: 0.6; cursor: default;">
        <div class="card-img">❤️</div>
        <div class="card-body">
            <div class="card-title">하트 시그널 <span class="badge" style="background: #333;">Comming Soon</span></div>
            <p class="card-desc">커플 간의 싱크로율을 확인하는 퀴즈형 게임입니다.</p>
        </div>
    </div>
</div>

<div class="ad-slot-top">
    <span class="ad-placeholder">하단 고정형 모바일 광고 영역</span>
</div>
