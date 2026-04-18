/**
 * common.js — 2인용 모바일 게임 공통 유틸리티
 * 멀티터치 방지, 전체화면 유도, 점수, 진동 피드백 등
 */

const GameUtils = (() => {
  'use strict';

  /* ───────────────────── 멀티터치 / 줌 방지 ───────────────────── */
  function lockViewport() {
    // 더블탭 줌 방지
    document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

    // 핀치 줌 방지
    document.addEventListener('touchmove', e => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    // 우클릭 방지 (모바일 롱프레스 메뉴)
    document.addEventListener('contextmenu', e => e.preventDefault());

    // pull-to-refresh 방지
    document.body.style.overscrollBehavior = 'none';
  }

  /* ───────────────────── 전체화면 ───────────────────── */
  function requestFullscreen(element) {
    const el = element || document.documentElement;
    const rfs = el.requestFullscreen
      || el.webkitRequestFullscreen
      || el.msRequestFullscreen;
    if (rfs) rfs.call(el);
  }

  function exitFullscreen() {
    const efs = document.exitFullscreen
      || document.webkitExitFullscreen
      || document.msExitFullscreen;
    if (efs) efs.call(document);
  }

  /* ───────────────────── 진동 피드백 ───────────────────── */
  function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms || 30);
  }

  /* ───────────────────── 점수 관리 (LocalStorage) ───────────────────── */
  function getScores(gameId) {
    try {
      return JSON.parse(localStorage.getItem(`scores_${gameId}`)) || { p1: 0, p2: 0 };
    } catch { return { p1: 0, p2: 0 }; }
  }

  function saveScores(gameId, scores) {
    localStorage.setItem(`scores_${gameId}`, JSON.stringify(scores));
  }

  function resetScores(gameId) {
    localStorage.removeItem(`scores_${gameId}`);
  }

  /* ───────────────────── SNS 메타태그 동적 생성 ───────────────────── */
  function injectMeta(config) {
    const defaults = {
      title: '커플 게임 광장 | 2인용 모바일 웹 게임',
      description: '하나의 스마트폰에서 두 명이 동시에! 연인과 함께 즐기는 모바일 대결 게임 모음 💕',
      image: '/games/og-default.png',
      url: window.location.href,
      type: 'website'
    };
    const meta = { ...defaults, ...config };

    const tags = {
      'og:title': meta.title,
      'og:description': meta.description,
      'og:image': meta.image,
      'og:url': meta.url,
      'og:type': meta.type,
      'twitter:card': 'summary_large_image',
      'twitter:title': meta.title,
      'twitter:description': meta.description,
      'twitter:image': meta.image
    };

    Object.entries(tags).forEach(([property, content]) => {
      let el = document.querySelector(`meta[property="${property}"]`)
        || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        const attr = property.startsWith('twitter') ? 'name' : 'property';
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    if (!document.querySelector('title')) {
      const t = document.createElement('title');
      document.head.appendChild(t);
    }
    document.title = meta.title;
  }

  /* ───────────────────── 카운트다운 유틸 ───────────────────── */
  function countdown(seconds, onTick, onDone) {
    let remaining = seconds;
    onTick(remaining);
    const timer = setInterval(() => {
      remaining--;
      onTick(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (onDone) onDone();
      }
    }, 1000);
    return timer;
  }

  /* ───────────────────── 랜덤 범위 ───────────────────── */
  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* ───────────────────── 테마 시스템 (Theme System) ───────────────────── */
  const THEMES = {
    shiba: {
      name: '🐾 Shiba Pink',
      colors: { '--primary': '#a78bfa', '--accent': '#f472b6', '--bg': '#0a0a0f', '--primary-glow': 'rgba(167,139,250,.35)', '--accent-glow': 'rgba(244,114,182,.3)' }
    },
    cyber: {
      name: '🚀 Cyber Dark',
      colors: { '--primary': '#00f2ff', '--accent': '#7000ff', '--bg': '#050510', '--primary-glow': 'rgba(0,242,255,.3)', '--accent-glow': 'rgba(112,0,255,.3)' }
    },
    mint: {
      name: '🌿 Mint Emerald',
      colors: { '--primary': '#2dd4bf', '--accent': '#10b981', '--bg': '#022c22', '--primary-glow': 'rgba(45,212,191,.3)', '--accent-glow': 'rgba(16,185,129,.3)' }
    },
    sunset: {
      name: '🌅 Sunset Gold',
      colors: { '--primary': '#fbbf24', '--accent': '#f87171', '--bg': '#1c1917', '--primary-glow': 'rgba(251,191,36,.3)', '--accent-glow': 'rgba(248,113,113,.3)' }
    }
  };

  function getTheme() {
    return localStorage.getItem('game_theme') || 'shiba';
  }

  function setTheme(themeId) {
    if (!THEMES[themeId]) return;
    localStorage.setItem('game_theme', themeId);
    applyTheme(themeId);
  }

  function applyTheme(themeId) {
    const theme = THEMES[themeId || getTheme()];
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
    
    // 허브 페이지의 테마 버튼 텍스트 업데이트 (존재할 경우)
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = `🎨 ${theme.name}`;
  }

  function nextTheme() {
    const ids = Object.keys(THEMES);
    const current = getTheme();
    const nextIndex = (ids.indexOf(current) + 1) % ids.length;
    setTheme(ids[nextIndex]);
    vibrate(10);
  }

  /* ───────────────────── 커플 벌칙 룰렛 ───────────────────── */
  const PENALTIES = [
    '🧎 진 사람이 어깨 마사지 5분!',
    '☕ 진 사람이 커피 사기!',
    '💋 진 사람이 볼 뽀뽀!',
    '🍽️ 진 사람이 설거지!',
    '📱 진 사람이 셀카 100장!',
    '🎵 진 사람이 노래 한 곡!',
    '🐶 진 사람이 강아지 산책!',
    '💌 진 사람이 사랑의 편지 쓰기!',
    '🏃 진 사람이 편의점 심부름!',
    '🫶 진 사람이 안아주기 10초!'
  ];

  function spinPenalty() {
    return PENALTIES[Math.floor(Math.random() * PENALTIES.length)];
  }

  /* ───────────────────── 전체 스코어 관리 ───────────────────── */
  const GAME_IDS = ['tap-battle', 'rps', 'ping-pong', 'memory-numbers', 'balloon-pop', 'color-sequence', 'timing-hit', 'yahtzee'];

  function getTotalScores() {
    let total = { p1: 0, p2: 0 };
    GAME_IDS.forEach(id => {
      const s = getScores(id);
      total.p1 += s.p1;
      total.p2 += s.p2;
    });
    return total;
  }

  function getAllGameScores() {
    const result = {};
    GAME_IDS.forEach(id => {
      result[id] = getScores(id);
    });
    return result;
  }

  function resetAllScores() {
    GAME_IDS.forEach(id => resetScores(id));
  }

  /* ───────────────────── 시바견 테마 브레인 인젝션 ───────────────────── */
  function injectShibaTheme() {
    // 1. 공통 시바견 스타일 추가 (배경, 오버레이 마스코트, 아바타 CSS)
    const style = document.createElement('style');
    style.innerHTML = `
      /* 전체 배경 워터마크 */
      body::after {
        content: ''; position: fixed; bottom: -10%; right: -10%;
        width: 60vh; height: 60vh;
        background-image: url('/games/assets/shiba_mascot.png');
        background-size: contain; background-repeat: no-repeat; background-position: center;
        opacity: 0.05; z-index: -1; pointer-events: none;
      }

      /* 오버레이 마스코트 (Start & Result) */
      .shiba-mascot-overlay {
        width: clamp(100px, 25vw, 160px); height: clamp(100px, 25vw, 160px);
        object-fit: cover; border-radius: 50%;
        box-shadow: 0 8px 32px rgba(167,139,250,.3);
        margin-bottom: 1.25rem;
        animation: shiba-float 3s ease-in-out infinite;
        border: 4px solid var(--surface-hover);
      }
      @keyframes shiba-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      /* CSS 트릭: 플레이어 이름(textContent)이 덮어씌워져도 유지되는 ::before 아바타 */
      .p1-col::before, #mini-p1::before, .turn-indicator.p1::before, 
      .score-player.p1 .label::before, .score-cell-overlay.p1 .label::before,
      .fs-row span:first-child::before, #score-p1::before {
        content: ''; display: inline-block; width: 22px; height: 22px;
        background-image: url('/games/assets/shiba_p1.png');
        background-size: cover; border-radius: 50%;
        vertical-align: middle; margin-right: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);
      }

      .p2-col::before, #mini-p2::before, .turn-indicator.p2::before, 
      .score-player.p2 .label::before, .score-cell-overlay.p2 .label::before,
      #score-p2::before {
        content: ''; display: inline-block; width: 22px; height: 22px;
        background-image: url('/games/assets/shiba_p2.png');
        background-size: cover; border-radius: 50%;
        vertical-align: middle; margin-right: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);
      }

      /* 예외 처리: 특정 요소 안의 before 제외 등 (필요 시 확장) */
      th.p1-col::before, th.p2-col::before { margin-right: 4px; }
      .final-scores .fs-row.total span:first-child::before { display: none; } /* 합계에는 미표시 */
    `;
    document.head.appendChild(style);

    // 2. DOM 삽입: 각 게임의 시작/결과 화면 상단에 시바 마스코트 이미지 주입
    const addOverlayMascot = (id) => {
      const overlay = document.getElementById(id);
      if (overlay && !overlay.querySelector('.shiba-mascot-overlay')) {
        const img = document.createElement('img');
        img.src = '/games/assets/shiba_mascot.png';
        img.className = 'shiba-mascot-overlay';
        overlay.insertBefore(img, overlay.firstChild);
      }
    };

    addOverlayMascot('overlay-start');
    addOverlayMascot('overlay-result');
  }

  /* ───────────────────── 초기화 ───────────────────── */
  function init() {
    lockViewport();
    applyTheme(); // 저장된 테마 적용
    injectShibaTheme();
  }

  // DOM 준비 시 자동 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    lockViewport,
    requestFullscreen,
    exitFullscreen,
    vibrate,
    getScores,
    saveScores,
    resetScores,
    injectMeta,
    countdown,
    randomBetween,
    spinPenalty,
    PENALTIES,
    GAME_IDS,
    getTotalScores,
    getAllGameScores,
    resetAllScores,
    getTheme,
    setTheme,
    applyTheme,
    nextTheme,
    THEMES
  };
})();
