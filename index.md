---
layout: page
title: 🚀 유연휘의 개발 블로그 (Whistle's Dev Diary)
---

<style>
  .hero-section {
    text-align: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border-radius: 20px;
    color: white;
    margin-bottom: 3rem;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
  }
  .hero-section h1 { color: white !important; font-size: 2.5rem !important; border-bottom: none !important; margin-bottom: 1rem; }
  .hero-section p { font-size: 1.1rem; opacity: 0.9; }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  .feature-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid #eee;
    transition: all 0.3s ease;
    text-decoration: none !important;
    color: inherit !important;
    display: flex;
    flex-direction: column;
  }
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    border-color: #6366f1;
  }
  .card-icon { font-size: 3rem; margin-bottom: 1.5rem; }
  .card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: #1e293b; }
  .card-desc { color: #64748b; line-height: 1.6; flex: 1; }
  
  .lecture-list {
    margin-top: 1.5rem;
    list-style: none;
    padding: 0;
  }
  .lecture-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .lecture-list a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    display: block;
    padding: 0.2rem 0;
    transition: color 0.2s;
  }
  .lecture-list a:hover { 
    color: #6366f1;
    text-decoration: none;
    transform: translateX(5px);
  }
  .lecture-list li {
    transition: all 0.2s;
  }

  .btn-primary {
    display: inline-block;
    background: #6366f1;
    color: white !important;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 700;
    margin-top: 1rem;
    text-align: center;
    transition: all 0.3s;
  }
  .btn-primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
  }
</style>

<section class="hero-section">
  <h1>Whistle's Dev Diary</h1>
  <p>파이썬 기초 문법부터 커플들을 위한 미니게임까지, 유용한 개발 지식을 공유합니다.</p>
</section>

<div class="content-grid">
  <!-- 파이썬 교육 자료 섹션 -->
  <div class="feature-card">
    <div class="card-icon">🐍</div>
    <div class="card-title">파이썬 기초 문법</div>
    <p class="card-desc">파이썬의 핵심 자료형, 제어문, 함수 등에 대해 아주 기초부터 차근차근 정리한 학습 자료입니다.</p>
    <ul class="lecture-list">
      <li><a href="/pages/파이썬 기초문법/number/">1. 숫자형 (Numeric Types)</a></li>
      <li><a href="/pages/파이썬 기초문법/string/">2. 문자열 (String)</a></li>
      <li><a href="/pages/파이썬 기초문법/list/">3. 리스트 (List)</a></li>
      <li><a href="/pages/파이썬 기초문법/dictionary/">4. 딕셔너리 (Dictionary)</a></li>
      <li><a href="/pages/파이썬 기초문법/loops/">5. 반복문 (Loops)</a></li>
    </ul>
    <a href="/pages/파이썬 기초문법/" class="btn-primary">전체 강좌 보기 →</a>
  </div>

  <!-- 게임 섹션 -->
  <a href="/games/" class="feature-card">
    <div class="card-icon">🕹️</div>
    <div class="card-title">커플 게임 광장</div>
    <p class="card-desc">데이트할 때 스마트폰 하나로 가볍게 즐길 수 있는 2인용 대결 게임 모음입니다. 실시간 원격 대결도 지원합니다.</p>
    <div style="margin-top: 1rem; color: #f472b6; font-weight: 700;">현재 10종의 게임 플레이 가능!</div>
    <span class="btn-primary" style="background:#f472b6;">게임 플레이하러 가기 →</span>
  </a>
</div>

## ✉️ Contact
프로젝트 관련 문의사항이나 피드백은 아래 이메일로 보내주세요.
**dusgnl0903@gmail.com**

---
© 2024 Whistle. All rights reserved.
