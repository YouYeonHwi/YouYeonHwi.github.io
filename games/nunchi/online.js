(() => {
  'use strict';

  const GAME_ID = 'nunchi';
  const TARGET = 10;
  const SIMULTANEOUS_WINDOW = 300; // ms
  
  let myRole = null;
  let currentState = {
    status: 'lobby', // lobby | playing | failed | ended
    currentNum: 0,
    lastTapPlayer: null,
    lastTapTime: 0,
    history: []
  };

  const numEl = document.getElementById('current-num');
  const tapBtn = document.getElementById('tap-btn');
  const gameMsg = document.getElementById('game-msg');
  const oppStatus = document.getElementById('opp-status');

  function init() {
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      
      // 동기화 리스너 시작
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      startGame();
    });
  }

  function startGame() {
    GameUtils.RemoteManager.updateState({
      ...currentState,
      status: 'playing',
      currentNum: 0,
      lastTapPlayer: null,
      lastTapTime: 0,
      history: []
    });
  }

  function handleTap() {
    if (currentState.status !== 'playing') return;

    const now = Date.now();
    const otherPlayer = myRole === 'p1' ? 'p2' : 'p1';
    
    // 동시성 체크 (내 터치 시점 기준 0.3초 이내에 상대가 이미 눌렀는지 확인)
    if (currentState.lastTapPlayer === otherPlayer && (now - currentState.lastTapTime < SIMULTANEOUS_WINDOW)) {
      failGame('동시 터치!');
      return;
    }

    // 정상적인 숫자 올리기
    const nextNum = currentState.currentNum + 1;
    const nextHistory = [...currentState.history, myRole];

    GameUtils.vibrate(20);
    
    const update = {
      currentNum: nextNum,
      lastTapPlayer: myRole,
      lastTapTime: now,
      history: nextHistory
    };

    if (nextNum >= TARGET) {
      GameUtils.RemoteManager.updateState({ ...currentState, ...update, status: 'ended' });
    } else {
      GameUtils.RemoteManager.updateState({ ...currentState, ...update });
    }
  }

  function failGame(reason) {
    GameUtils.RemoteManager.updateState({ ...currentState, status: 'failed' });
    GameUtils.vibrate(200);
  }

  function onSync(state, role) {
    if (!state) return;
    const oldNum = currentState.currentNum;
    currentState = state;
    myRole = role;

    numEl.textContent = state.currentNum;
    if (state.currentNum !== oldNum) {
      numEl.animate([
        { transform: 'scale(0.8)', opacity: 0.5 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 200 });
    }

    const otherPlayer = myRole === 'p1' ? 'p2' : 'p1';
    if (state.lastTapPlayer === otherPlayer) {
      oppStatus.textContent = `상대방이 ${state.currentNum}을 외쳤습니다!`;
      oppStatus.style.color = 'var(--secondary)';
    } else if (state.lastTapPlayer === myRole) {
      oppStatus.textContent = `내 차례: ${state.currentNum}`;
      oppStatus.style.color = 'var(--primary)';
    }

    if (state.status === 'failed') {
      showFinalResult(null, '동시 터치로 둘 다 패배! 💀');
    } else if (state.status === 'ended') {
      showFinalResult(state.lastTapPlayer, `${state.lastTapPlayer === myRole ? '승리!' : '패배...'} ${TARGET}을 먼저 외쳤습니다.`);
    }
  }

  function showFinalResult(winnerRole, detail) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detailEl = document.getElementById('res-detail');

    if (winnerRole === null) {
      title.textContent = '🤝 무승부';
    } else if (winnerRole === myRole) {
      title.textContent = '🎉 승리!';
      title.style.color = 'var(--primary)';
    } else {
      title.textContent = '💀 패배...';
      title.style.color = 'var(--secondary)';
    }

    detailEl.textContent = detail;
    overlay.classList.remove('hidden');

    if (winnerRole === myRole && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  tapBtn.onclick = handleTap;
  init();
})();
