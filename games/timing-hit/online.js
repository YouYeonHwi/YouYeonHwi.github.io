(() => {
  'use strict';

  const GAME_ID = 'timing-hit';
  const TOTAL_ROUNDS = 3;
  
  let myRole = null;
  let currentState = {
    round: 1,
    status: 'lobby',
    p1Total: 0,
    p2Total: 0,
    p1StopPos: null,
    p2StopPos: null,
    speed: 2
  };

  let localPos = 0;
  let localDir = 1;
  let isMoving = false;
  let animId = null;

  const myNeedle = document.getElementById('my-needle');
  const oppNeedle = document.getElementById('opp-needle');
  const myMsg = document.getElementById('my-msg');
  const oppMsg = document.getElementById('opp-msg');
  const roundText = document.getElementById('round-text');
  const myTotalEl = document.getElementById('my-total');
  const oppTotalEl = document.getElementById('opp-total');
  const myArea = document.getElementById('my-area');

  function init() {
    GameUtils.RemoteManager.init(GAME_ID, onSync);
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      myRole = GameUtils.RemoteManager.getRole();
      if (myRole === 'p1') {
        startRound(1, 0, 0);
      }
    });
  }

  function startRound(r, s1, s2) {
    GameUtils.RemoteManager.updateState({
      ...currentState,
      round: r,
      status: 'moving',
      p1Total: s1,
      p2Total: s2,
      p1StopPos: null,
      p2StopPos: null,
      speed: 1.5 + (r * 0.5)
    });
  }

  function onSync(state, role) {
    if (!state) return;
    const oldStatus = currentState.status;
    currentState = state;
    myRole = role;

    roundText.textContent = `ROUND ${state.round}/${TOTAL_ROUNDS}`;
    myTotalEl.textContent = `총점: ${myRole === 'p1' ? state.p1Total : state.p2Total}`;
    oppTotalEl.textContent = `총점: ${myRole === 'p1' ? state.p2Total : state.p1Total}`;

    if (state.status === 'moving') {
      if (oldStatus !== 'moving') {
        startLocalMovement(state.speed);
      }
      
      // 상대방이 먼저 멈췄는지 확인
      const oppStop = myRole === 'p1' ? state.p2StopPos : state.p1StopPos;
      if (oppStop !== null) {
        oppNeedle.style.left = oppStop + '%';
        oppMsg.textContent = '상대방 멈춤! ✅';
      } else {
        oppMsg.textContent = '상대방 움직이는 중...';
      }

      const myStop = myRole === 'p1' ? state.p1StopPos : state.p2StopPos;
      if (myStop !== null) {
        myNeedle.style.left = myStop + '%';
        myMsg.textContent = '대기 중...';
      } else {
        myMsg.textContent = '터치하여 멈추세요!';
      }
    } 
    else if (state.status === 'resolving') {
      stopLocalMovement();
      myNeedle.style.left = (myRole === 'p1' ? state.p1StopPos : state.p2StopPos) + '%';
      oppNeedle.style.left = (myRole === 'p1' ? state.p2StopPos : state.p1StopPos) + '%';
      myMsg.textContent = '결과 확인 중...';
    }
    else if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function startLocalMovement(speed) {
    isMoving = true;
    localPos = 0;
    localDir = 1;
    function animate() {
      if (!isMoving) return;
      
      const myStop = myRole === 'p1' ? currentState.p1StopPos : currentState.p2StopPos;
      if (myStop === null) {
        localPos += speed * localDir;
        if (localPos >= 100 || localPos <= 0) localDir *= -1;
        localPos = Math.max(0, Math.min(100, localPos));
        myNeedle.style.left = localPos + '%';
      }
      
      // 상대방 바늘도 대략적으로 보여주기 (옵션)
      const oppStop = myRole === 'p1' ? currentState.p2StopPos : currentState.p1StopPos;
      if (oppStop === null) {
        oppNeedle.style.left = localPos + '%'; // 대략 동기화
      } else {
        oppNeedle.style.left = oppStop + '%';
      }

      animId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopLocalMovement() {
    isMoving = false;
    cancelAnimationFrame(animId);
  }

  function handleStop() {
    if (currentState.status !== 'moving') return;
    const myStop = myRole === 'p1' ? currentState.p1StopPos : currentState.p2StopPos;
    if (myStop !== null) return;

    GameUtils.vibrate(20);
    const score = calculateScore(localPos);
    
    const update = myRole === 'p1' ? 
      { p1StopPos: localPos, p1Total: currentState.p1Total + score } : 
      { p2StopPos: localPos, p2Total: currentState.p2Total + score };

    const nextState = { ...currentState, ...update };
    
    // 둘 다 멈췄는지 체크
    if (nextState.p1StopPos !== null && nextState.p2StopPos !== null) {
      if (myRole === 'p1') {
        resolveRound(nextState);
      }
    }
    
    GameUtils.RemoteManager.updateState(nextState);
  }

  function calculateScore(pos) {
    const dist = Math.abs(pos - 50);
    if (dist <= 1) return 100;
    if (dist <= 5) return 90;
    if (dist <= 10) return 70;
    if (dist <= 20) return 40;
    return Math.max(0, Math.round(30 - dist * 0.5));
  }

  function resolveRound(state) {
    GameUtils.RemoteManager.updateState({ ...state, status: 'resolving' });
    setTimeout(() => {
      if (state.round >= TOTAL_ROUNDS) {
        GameUtils.RemoteManager.updateState({ ...state, status: 'ended' });
      } else {
        startRound(state.round + 1, state.p1Total, state.p2Total);
      }
    }, 2000);
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const s1 = state.p1Total;
    const s2 = state.p2Total;
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    if (winner === 0) title.textContent = '🤝 무승부';
    else {
      title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';
    }

    detail.textContent = `최종 점수 - 나: ${myRole === 'p1' ? s1 : s2} | 상대: ${myRole === 'p1' ? s2 : s1}`;
    overlay.classList.remove('hidden');

    if (iAmWinner && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  myArea.addEventListener('touchstart', (e) => { e.preventDefault(); handleStop(); });
  myArea.addEventListener('mousedown', handleStop);

  init();
})();
