(() => {
  'use strict';

  const GAME_ID = 'number-race';
  const MAX_NUM = 9;
  
  let myRole = null;
  let currentState = {
    status: 'lobby', // lobby | playing | ended
    p1Next: 1,
    p2Next: 1,
    p1Time: 0,
    p2Time: 0
  };

  let myNext = 1;
  let startTime = 0;

  const grid = document.getElementById('game-grid');
  const nextNumEl = document.getElementById('next-num');
  const oppProgress = document.getElementById('opp-progress');
  const oppLvEl = document.getElementById('opp-lv');

  function init() {
    GameUtils.RemoteManager.init(GAME_ID, onSync);
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      myRole = GameUtils.RemoteManager.getRole();
      startGame();
    });
  }

  function startGame() {
    myNext = 1;
    startTime = Date.now();
    buildGrid();
    GameUtils.RemoteManager.updateState({ ...currentState, status: 'playing' });
  }

  function buildGrid() {
    grid.innerHTML = '';
    const nums = [];
    for (let i = 1; i <= MAX_NUM; i++) nums.push(i);
    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    nums.forEach(n => {
      const btn = document.createElement('button');
      btn.className = 'num-btn';
      btn.textContent = n;
      btn.onclick = () => handleTap(n, btn);
      grid.appendChild(btn);
    });
  }

  function handleTap(num, btn) {
    if (currentState.status !== 'playing') return;
    
    if (num === myNext) {
      GameUtils.vibrate(15);
      btn.classList.add('done');
      myNext++;
      
      const update = myRole === 'p1' ? { p1Next: myNext } : { p2Next: myNext };
      
      if (myNext > MAX_NUM) {
        const elapsed = (Date.now() - startTime) / 1000;
        if (myRole === 'p1') { update.p1Time = elapsed; }
        else { update.p2Time = elapsed; }
        nextNumEl.textContent = 'FINISH!';
      } else {
        nextNumEl.textContent = myNext;
      }

      GameUtils.RemoteManager.updateState({ ...currentState, ...update });
    } else {
      GameUtils.vibrate(100);
      btn.classList.add('error');
      setTimeout(() => btn.classList.remove('error'), 300);
    }
  }

  function onSync(state, role) {
    if (!state) return;
    currentState = state;
    myRole = role;

    const oppNext = myRole === 'p1' ? state.p2Next : state.p1Next;
    oppLvEl.textContent = oppNext > MAX_NUM ? 'FINISH!' : `최근: ${oppNext - 1}`;
    updateOppProgress(oppNext - 1);

    if (state.p1Time > 0 && state.p2Time > 0 && state.status !== 'ended') {
      GameUtils.RemoteManager.updateState({ ...state, status: 'ended' });
    }

    if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function updateOppProgress(count) {
    oppProgress.innerHTML = '';
    for (let i = 0; i < MAX_NUM; i++) {
      const ball = document.createElement('div');
      ball.className = 'opp-ball' + (i < count ? ' filled' : '');
      oppProgress.appendChild(ball);
    }
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const t1 = state.p1Time;
    const t2 = state.p2Time;
    const winner = t1 < t2 ? 1 : t2 < t1 ? 2 : 0;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    if (winner === 0) title.textContent = '🤝 무승부';
    else title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';

    const myTime = myRole === 'p1' ? t1 : t2;
    const oppTime = myRole === 'p1' ? t2 : t1;
    detail.textContent = `내 기록: ${myTime.toFixed(2)}s | 상대 기록: ${oppTime.toFixed(2)}s`;
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
