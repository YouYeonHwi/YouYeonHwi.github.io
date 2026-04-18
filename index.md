---
layout: page
title: 🎮 커플 게임 광장
---

<style>
  .hero-section {
    text-align: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
    border-radius: 20px;
    color: white;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
  }
  .hero-section h1 {
    color: white !important;
    font-size: 2.5rem !important;
    font-weight: 900;
    margin-bottom: 1rem;
    border-bottom: none !important;
  }
  .hero-section p {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;
  }
  .game-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    text-decoration: none !important;
    color: #334155 !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  }
  .game-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    border-color: #f472b6;
  }
  .game-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  .game-card h3 {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #1e293b;
    border-bottom: none !important;
  }
  .game-card p {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0;
  }

  .support-section {
    background: #f8fafc;
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
    border: 2px dashed #cbd5e1;
    margin-top: 4rem;
  }
  .shiba-emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  .support-title {
    font-size: 1.5rem;
    font-weight: 900;
    color: #1e293b;
    margin-bottom: 1rem;
  }
  .account-info {
    display: inline-block;
    background: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    border: 1px solid #e2e8f0;
    font-family: monospace;
    color: #475569;
    margin-top: 1rem;
    font-weight: 700;
  }
</style>

<div class="hero-section">
  <h1>시작해요, 커플 게임 광장!</h1>
  <p>연인, 친구와 함께 한 화면에서, 혹은 온라인에서 즐기는 최고의 미니게임 모음</p>
</div>

## 🕹️ 추천 게임 목록

<div class="game-grid">
  <a href="./games/yahtzee/" class="game-card">
    <div class="game-icon">🎲</div>
    <h3>커플 야추 3D</h3>
    <p>주사위 전략 대결</p>
  </a>
  <a href="./games/rps/" class="game-card">
    <div class="game-icon">✊</div>
    <h3>가위바위보</h3>
    <p>클래식한 심리전</p>
  </a>
  <a href="./games/tap-battle/" class="game-card">
    <div class="game-icon">⚡</div>
    <h3>순발력 터치</h3>
    <p>누가 더 빠를까?</p>
  </a>
  <a href="./games/memory-numbers/" class="game-card">
    <div class="game-icon">🧠</div>
    <h3>숫자 기억력</h3>
    <p>뇌섹남녀의 대결</p>
  </a>
  <a href="./games/ping-pong/" class="game-card">
    <div class="game-icon">🏓</div>
    <h3>미니 핑퐁</h3>
    <p>짜릿한 타격감</p>
  </a>
  <a href="./games/balloon-pop/" class="game-card">
    <div class="game-icon">🎈</div>
    <h3>풍선 터뜨리기</h3>
    <p>스트레스 해소!</p>
  </a>
  <a href="./games/color-sequence/" class="game-card">
    <div class="game-icon">🎨</div>
    <h3>색깔 순서</h3>
    <p>집중력 테스트</p>
  </a>
  <a href="./games/timing-hit/" class="game-card">
    <div class="game-icon">🎯</div>
    <h3>타이밍 히트</h3>
    <p>정지! 타이밍 대결</p>
  </a>
  <a href="./games/number-race/" class="game-card">
    <div class="game-icon">🔢</div>
    <h3>숫자 레이스</h3>
    <p>누가 먼저 누를까?</p>
  </a>
  <a href="./games/nunchi/" class="game-card">
    <div class="game-icon">👀</div>
    <h3>눈치 게임</h3>
    <p>심박수 쫄깃한 눈치</p>
  </a>
</div>

<div class="support-section">
  <div class="shiba-emoji">🐕</div>
  <div class="support-title">개발자 용돈 주기 ☕</div>
  <p>프로젝트가 마음에 드셨나요? 개발자에게 따듯한 커피 한 잔의 응원을 보내주세요!</p>
  <div class="account-info">
    은행: ------ / 계좌번호: ------ / 예금주: ------
  </div>
  <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 1.5rem;">여러분의 작은 응원이 더 재미있는 게임을 만드는 힘이 됩니다. 감사합니다!</p>
</div>

<div style="margin-top: 5rem; text-align: center; border-top: 1px solid #eee; padding-top: 2rem; font-size: 0.9rem; color: #94a3b8;">
  <p>&copy; 2024 {{site.author}}. All rights reserved.</p>
</div>
