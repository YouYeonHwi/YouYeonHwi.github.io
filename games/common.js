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

  /* ───────────────────── 쾌속 카운트다운 유틸 ───────────────────── */
  function showFastCountdown(callback) {
    if (document.getElementById('fast-countdown-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'fast-countdown-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif; pointer-events: none;
    `;
    const numEl = document.createElement('div');
    numEl.style.cssText = `
      font-size: 12rem; font-weight: 900; color: #a78bfa;
      text-shadow: 0 0 50px rgba(167,139,250,0.8);
    `;
    overlay.appendChild(numEl);
    document.body.appendChild(overlay);

    const steps = ['3', '2', '1'];
    let idx = 0;

    function renderNumber() {
      if (idx >= steps.length) {
        overlay.remove();
        if (callback) callback();
        return;
      }
      numEl.textContent = steps[idx];
      numEl.style.transform = 'scale(0.3)';
      numEl.style.opacity = '0';
      
      requestAnimationFrame(() => {
        numEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s';
        numEl.style.transform = 'scale(1.2)';
        numEl.style.opacity = '1';
        vibrate(30);
      });

      setTimeout(() => {
        idx++;
        renderNumber();
      }, 666);
    }
    renderNumber();
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

  /* ───────────────────── 구글 애드센스 스크립트 일괄 주입 ───────────────────── */
  function injectAdsense() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2428685752915797";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  /* ───────────────────── 실시간 원격 엔진 (RemoteManager) ───────────────────── */
  const RemoteManager = (() => {
    let db = null;
    let roomId = null;
    let playerRole = null; // 'p1' or 'p2'
    let onSyncCallback = null;
    let gameId = '';
    let currentRoomState = null;

    function ensureDB() {
      if (db) return true;
      if (typeof firebase === 'undefined') return false;
      const config = window.firebaseConfig || window.FIREBASE_CONFIG;
      if (!config) return false;
      if (!firebase.apps.length) firebase.initializeApp(config);
      db = firebase.database();
      return true;
    }

    function init(id, onSync) {
      if (!id) return;
      gameId = id;
      onSyncCallback = onSync;
      if (ensureDB()) {
        listenToRoom();
      }
    }

    function createRoom(initialState, callback) {
      if (!ensureDB()) return alert('Firebase를 초기화할 수 없습니다.');
      const newRoomId = Math.floor(1000 + Math.random() * 9000).toString();
      db.ref('rooms/' + newRoomId).set({
        gameId: gameId,
        gameState: initialState,
        status: 'lobby',
        p1Joined: true,
        p2Joined: false,
        lastActive: Date.now()
      }).then(() => {
        roomId = newRoomId;
        playerRole = 'p1';
        if (callback) callback(newRoomId);
      });
    }

    function joinRoom(id, callback, errorCallback) {
      if (!ensureDB()) return alert('Firebase를 초기화할 수 없습니다.');
      db.ref('rooms/' + id).once('value', snapshot => {
        const data = snapshot.val();
        if (data && !data.p2Joined) {
          if (data.gameId !== gameId) return errorCallback?.('다른 게임의 방입니다.');
          db.ref('rooms/' + id).update({
            p2Joined: true,
            status: 'ready'
          }).then(() => {
            roomId = id;
            playerRole = 'p2';
            if (callback) callback();
          });
        } else {
          if (errorCallback) errorCallback('방이 없거나 이미 가득 찼습니다.');
        }
      });
    }

    function updateState(state) {
      if (!roomId || !db) return;
      db.ref('rooms/' + roomId + '/gameState').set(state);
    }

    function listenToRoom() {
      if (!roomId || !db) return;
      db.ref('rooms/' + roomId + '/gameState').on('value', snapshot => {
        currentRoomState = snapshot.val();
        if (onSyncCallback) onSyncCallback(currentRoomState, playerRole);
      });
    }

    function leaveRoom() {
      if (roomId && db) {
        if (playerRole === 'p1') db.ref('rooms/' + roomId).remove();
        else db.ref('rooms/' + roomId + '/p2Joined').set(false);
      }
      roomId = null;
      playerRole = null;
    }

    function getRoomState() {
      return currentRoomState;
    }

    function monitorStatus(overlay, initUI, waitUI, readyUI, onStart) {
      if (!roomId || !db) return;
      const statusRef = db.ref('rooms/' + roomId + '/status');
      statusRef.on('value', snapshot => {
        const st = snapshot.val();
        if (!st) return;

        if (st === 'ready') {
          initUI.classList.add('hidden');
          waitUI.classList.add('hidden');
          readyUI.classList.remove('hidden');
          if (playerRole === 'p1') {
            overlay.querySelector('#btn-real-start').classList.remove('hidden');
          } else {
            overlay.querySelector('#ready-msg').style.display = 'block';
          }
        } else if (st === 'countdown') {
          showFastCountdown(() => {
            if (playerRole === 'p1') {
              db.ref('rooms/' + roomId).update({ status: 'playing' }).then(() => {
                statusRef.off('value');
                overlay.remove();
                if (onStart) onStart();
              });
            } else {
              statusRef.off('value');
              overlay.remove();
              if (onStart) onStart();
            }
          });
        } else if (st === 'playing') {
          statusRef.off('value');
          overlay.remove();
          if (onStart) onStart();
        }
      });
    }

    function showSelectionMenu(gameTitle, onLocal, onOnline) {
      injectStyles();
      const overlay = document.createElement('div');
      overlay.className = 'remote-overlay';
      overlay.innerHTML = `
        <div class="remote-card">
          <img src="/games/assets/shiba_mascot.png" style="width:80px; margin-bottom:1rem;">
          <h1>${gameTitle}</h1>
          <p>친구와 대결할 방식을 선택하세요!</p>
          <button class="remote-btn remote-btn-primary" id="menu-local">📱 로컬 대결 (한 화면)</button>
          <button class="remote-btn remote-btn-ghost" id="menu-online">🌐 원격 대결 (따로 플레이)</button>
          <a href="/games/" style="color:#64748b; font-size:0.75rem; text-decoration:none; margin-top:1rem; display:inline-block;">← 게임 목록으로</a>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('#menu-local').onclick = () => {
        overlay.remove();
        onLocal();
      };
      overlay.querySelector('#menu-online').onclick = () => {
        overlay.remove();
        onOnline();
      };
    }

    function openLobby(id, initialState, onStart) {
      gameId = id;
      injectStyles();
      ensureDB();

      const overlay = document.createElement('div');
      overlay.className = 'remote-overlay';
      overlay.innerHTML = `
        <div class="remote-card" id="lobby-init">
          <h1>원격 대결</h1>
          <p>방을 만들거나 참여 코드를 입력하세요.</p>
          <button class="remote-btn remote-btn-primary" id="btn-create">🏠 방 만들기 (Host)</button>
          <div style="height:1px; background:rgba(255,255,255,0.1); margin:1.5rem 0;"></div>
          <input type="text" class="remote-input" id="input-code" placeholder="방 번호 4자리" maxlength="4">
          <button class="remote-btn remote-btn-ghost" id="btn-join">참여하기</button>
          <button class="remote-btn" style="background:none; color:#64748b; font-size:0.8rem;" id="btn-back">← 취소</button>
        </div>
        <div class="remote-card hidden" id="lobby-wait">
          <h1>대기 중...</h1>
          <p>상대방에게 아래 코드를 전송하세요.</p>
          <div class="room-code-display" id="room-code-val">----</div>
          <button class="remote-btn remote-btn-ghost" id="btn-cancel">방 삭제 및 취소</button>
        </div>
        <div class="remote-card hidden" id="lobby-ready" style="max-width:350px;">
          <h1>대기실</h1>
          <div style="display:flex; justify-content:space-around; align-items:center; margin:1.5rem 0; background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:16px;">
            <div style="text-align:center;">
              <div style="width:60px; height:60px; border-radius:50%; background:url('/games/assets/shiba_p1.png') center/cover; margin:0 auto 0.5rem; border:2px solid #f472b6;"></div>
              <div style="font-weight:900; font-size:0.9rem; color:#f472b6;">Host</div>
            </div>
            <div style="font-size:1.5rem; font-weight:900; opacity:0.5;">VS</div>
            <div style="text-align:center;">
              <div style="width:60px; height:60px; border-radius:50%; background:url('/games/assets/shiba_p2.png') center/cover; margin:0 auto 0.5rem; border:2px solid #a78bfa;"></div>
              <div style="font-weight:900; font-size:0.9rem; color:#a78bfa;">Guest</div>
            </div>
          </div>
          <button class="remote-btn remote-btn-primary hidden" id="btn-real-start">게임 시작하기! 🚀</button>
          <p id="ready-msg" style="color:var(--primary); font-weight:700; margin-bottom:1rem; display:none;">방장이 시작하길 기다리는 중...</p>
          <button class="remote-btn remote-btn-ghost" id="btn-ready-cancel" style="padding:0.75rem; font-size:0.85rem;">방 나가기</button>
        </div>
      `;
      document.body.appendChild(overlay);

      const initUI = overlay.querySelector('#lobby-init');
      const waitUI = overlay.querySelector('#lobby-wait');
      const readyUI = overlay.querySelector('#lobby-ready');
      const input = overlay.querySelector('#input-code');

      overlay.querySelector('#btn-create').onclick = () => {
        createRoom(initialState, (newId) => {
          initUI.classList.add('hidden');
          waitUI.classList.remove('hidden');
          overlay.querySelector('#room-code-val').textContent = newId;
          monitorStatus(overlay, initUI, waitUI, readyUI, onStart);
        });
      };

      overlay.querySelector('#btn-join').onclick = () => {
        const code = input.value.trim();
        if (code.length !== 4) return alert('4자리 코드를 입력하세요.');
        joinRoom(code, () => {
          monitorStatus(overlay, initUI, waitUI, readyUI, onStart);
        }, (err) => alert(err));
      };

      overlay.querySelector('#btn-back').onclick = () => location.reload();
      overlay.querySelector('#btn-cancel').onclick = () => { leaveRoom(); location.reload(); };
      overlay.querySelector('#btn-ready-cancel').onclick = () => { leaveRoom(); location.reload(); };

      overlay.querySelector('#btn-real-start').onclick = () => {
        if (playerRole === 'p1' && roomId && db) {
          db.ref('rooms/' + roomId).update({ status: 'countdown' });
        }
      };
    }

    function injectStyles() {
      if (document.getElementById('remote-manager-styles')) return;
      const style = document.createElement('style');
      style.id = 'remote-manager-styles';
      style.textContent = `
        .remote-overlay {
          position: fixed; inset: 0; background: rgba(10,10,15,0.98);
          backdrop-filter: blur(20px); z-index: 10000; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          padding: 2rem; color: #e2e8f0; font-family: 'Outfit', sans-serif;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .remote-card {
          width: 100%; max-width: 320px; text-align: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .remote-card h1 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .remote-card p { font-size: 0.85rem; color: #94a3b8; margin-bottom: 2rem; line-height: 1.5; }
        .remote-btn {
          width: 100%; padding: 1rem; border-radius: 50px; border: none;
          font-weight: 800; font-size: 1rem; cursor: pointer; margin-bottom: 0.8rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .remote-btn-primary { background: linear-gradient(135deg, #a78bfa, #f472b6); color: white; box-shadow: 0 4px 15px rgba(167,139,250,0.4); }
        .remote-btn-ghost { background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); }
        .remote-btn:active { transform: scale(0.96); }
        .remote-input {
          width: 100%; padding: 1rem 1.5rem; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2); color: white; font-family: inherit; font-size: 1.1rem;
          text-align: center; margin-bottom: 1rem; outline: none; transition: border-color 0.2s;
        }
        .remote-input:focus { border-color: #a78bfa; }
        .room-code-display {
          font-size: 3rem; font-weight: 900; color: #a78bfa; letter-spacing: 4px;
          margin: 1.5rem 0; text-shadow: 0 0 20px rgba(167,139,250,0.3);
        }
        .hidden { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    return { init, createRoom, joinRoom, updateState, leaveRoom, getRoomId: () => roomId, getRole: () => playerRole, showSelectionMenu, openLobby, getRoomState };
  })();

  /* ───────────────────── 초기화 ───────────────────── */
  function init() {
    lockViewport();
    applyTheme(); // 저장된 테마 적용
    injectShibaTheme();
    injectAdsense(); // 모든 게임에 애드센스 자동 광고 스크립트 로드
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
    THEMES,
    RemoteManager,
    showFastCountdown
  };
})();
