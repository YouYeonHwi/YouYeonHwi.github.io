(() => {
  'use strict';

  const GAME_ID = 'balloon-pop';
  const GAME_TIME = 15;
  const BALLOON_EMOJIS = ['🎈', '🎈', '🎈', '🟡', '🔴', '🟣', '🟢', '🔵'];
  
  let myRole = null;
  let currentState = {
    status: 'lobby', // lobby | countdown | playing | ended
    timeLeft: GAME_TIME,
    p1Count: 0,
    p2Count: 0
  };

  let localCount = 0;
  let lastSyncCount = 0;
  let spawnInterval = null;
  let timerInterval = null;

  const field = document.getElementById('game-field');
  const myCountEl = document.getElementById('my-count');
  const oppCountEl = document.getElementById('opp-count');
  const timerEl = document.getElementById('game-timer');
  const oppStatus = document.getElementById('opp-status');
  const cdOverlay = document.getElementById('overlay-countdown');
  const cdNum = document.getElementById('cd-num');

  function init() {
    GameUtils.RemoteManager.init(GAME_ID, onSync);
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      myRole = GameUtils.RemoteManager.getRole();
      if (myRole === 'p1') {
        startSequence();
      }
    });
  }

  function startSequence() {
    GameUtils.RemoteManager.updateState({ ...currentState, status: 'countdown' });
    let count = 3;
    const intv = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(intv);
        GameUtils.RemoteManager.updateState({ ...currentState, status: 'playing', timeLeft: GAME_TIME });
        startTimer();
      }
    }, 1000);
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      const state = GameUtils.RemoteManager.getRoomState()?.gameState;
      if (!state || state.status !== 'playing') return;
      
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        clearInterval(timerInterval);
        GameUtils.RemoteManager.updateState({ ...state, timeLeft: 0, status: 'ended' });
      } else {
        GameUtils.RemoteManager.updateState({ ...state, timeLeft: newTime });
      }
    }, 1000);
  }

  function onSync(state, role) {
    if (!state) return;
    const oldStatus = currentState.status;
    currentState = state;
    myRole = role;

    // UI Updates
    timerEl.textContent = `⏱ ${state.timeLeft}s`;
    oppCountEl.textContent = `💥 ${myRole === 'p1' ? state.p2Count : state.p1Count}`;
    myCountEl.textContent = `💥 ${myRole === 'p1' ? state.p1Count : state.p2Count}`;

    if (state.status === 'countdown') {
      cdOverlay.classList.remove('hidden');
      // Simple local countdown display logic could be added here if needed
    } else if (state.status === 'playing') {
      cdOverlay.classList.add('hidden');
      if (oldStatus !== 'playing') startLocalGame();
    } else if (state.status === 'ended') {
      stopLocalGame();
      showFinalResult(state);
    }
  }

  function startLocalGame() {
    localCount = 0;
    lastSyncCount = 0;
    spawnInterval = setInterval(spawnBalloon, 400);
    // initial burst
    for(let i=0; i<5; i++) spawnBalloon();
  }

  function stopLocalGame() {
    clearInterval(spawnInterval);
    field.querySelectorAll('.balloon').forEach(b => b.remove());
  }

  function spawnBalloon() {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
    
    const x = Math.random() * (field.clientWidth - 50);
    const y = field.clientHeight + 50;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    
    // Animation up
    const duration = 2000 + Math.random() * 2000;
    const anim = b.animate([
      { top: field.clientHeight + 'px' },
      { top: '-100px' }
    ], { duration: duration, easing: 'linear' });

    anim.onfinish = () => b.remove();

    b.addEventListener('touchstart', (e) => { e.preventDefault(); pop(b); });
    b.addEventListener('mousedown', () => pop(b));

    field.appendChild(b);
  }

  function pop(el) {
    if (currentState.status !== 'playing') return;
    el.remove();
    localCount++;
    GameUtils.vibrate(10);
    
    // Throttle sync: sync every 3 taps to save DB quota
    if (localCount - lastSyncCount >= 3) {
      syncCount();
    }
  }

  function syncCount() {
    lastSyncCount = localCount;
    const update = myRole === 'p1' ? { p1Count: localCount } : { p2Count: localCount };
    GameUtils.RemoteManager.updateState({ ...currentState, ...update });
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const s1 = state.p1Count;
    const s2 = state.p2Count;
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    if (winner === 0) title.textContent = '🤝 무승부';
    else {
      title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';
      title.style.color = iAmWinner ? 'var(--primary)' : 'var(--secondary)';
    }

    detail.textContent = `내 기록: ${myRole === 'p1' ? s1 : s2}개 | 상대 기록: ${myRole === 'p1' ? s2 : s1}개`;
    overlay.classList.remove('hidden');

    if (iAmWinner && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  init();
})();
