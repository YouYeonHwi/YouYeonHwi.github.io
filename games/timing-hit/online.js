(() => {
  'use strict';

  const GAME_ID = 'timing-hit';
  const TOTAL_ROUNDS = 3;
  const ROUND_SPEEDS = [2.0, 2.5, 3.0];
  
  let myRole = null;
  let myLocalStopPos = null; // 로컬에서 즉시 멈춤 표시를 위해 추가
  let currentState = {
    round: 1,
    status: 'lobby',
    p1Total: 0,
    p2Total: 0,
    p1StopPos: null,
    p2StopPos: null,
    speed: 2
  };

  // ── Firebase null 안전 래퍼 ───────────────────────────────
  function safeState(raw) {
    if (!raw) return null;
    return {
      round: raw.round || 1,
      status: raw.status || 'lobby',
      p1Total: raw.p1Total || 0,
      p2Total: raw.p2Total || 0,
      p1StopPos: raw.p1StopPos !== undefined ? raw.p1StopPos : null,
      p2StopPos: raw.p2StopPos !== undefined ? raw.p2StopPos : null,
      speed: raw.speed || 2
    };
  }

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
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      
      // 동기화 리스너 시작
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      if (myRole === 'p1') {
        startRound(1, 0, 0);
      }
    });
  }

  function startRound(r, s1, s2) {
    myLocalStopPos = null; // 라운드 시작 시 초기화
    GameUtils.RemoteManager.updateState({
      ...currentState,
      round: r,
      status: 'moving',
      p1Total: s1,
      p2Total: s2,
      p1StopPos: null,
      p2StopPos: null,
      speed: ROUND_SPEEDS[r - 1] || 3.0
    });
  }

  function onSync(rawState, role) {
    const state = safeState(rawState);
    if (!state) return;
    
    const oldStatus = currentState.status;
    currentState = state;
    myRole = role;

    roundText.textContent = `ROUND ${state.round}/${TOTAL_ROUNDS}`;
    myTotalEl.textContent = `총점: ${myRole === 'p1' ? state.p1Total : state.p2Total}`;
    oppTotalEl.textContent = `총점: ${myRole === 'p1' ? state.p2Total : state.p1Total}`;

    if (state.status === 'moving') {
      if (oldStatus !== 'moving') {
        myLocalStopPos = null; 
        startLocalMovement(state.speed);
      }
      
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

      // Host(P1)가 두 명의 완료 여부를 확인하여 상태 전환
      if (myRole === 'p1' && state.p1StopPos !== null && state.p2StopPos !== null) {
        resolveRound(state);
      }
    } 
    else if (state.status === 'resolving') {
      stopLocalMovement();
      myNeedle.style.left = (myRole === 'p1' ? state.p1StopPos : state.p2StopPos) + '%';
      oppNeedle.style.left = (myRole === 'p1' ? state.p2StopPos : state.p1StopPos) + '%';
      
      const myScore = calculateScore(myRole === 'p1' ? state.p1StopPos : state.p2StopPos);
      const oppScore = calculateScore(myRole === 'p1' ? state.p2StopPos : state.p1StopPos);
      
      myMsg.textContent = `${getGrade(myScore)} (+${myScore}점)`;
      oppMsg.textContent = `상대방: ${getGrade(oppScore)} (+${oppScore}점)`;
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
      if (myStop === null && myLocalStopPos === null) {
        localPos += speed * localDir;
        if (localPos >= 100 || localPos <= 0) localDir *= -1;
        localPos = Math.max(0, Math.min(100, localPos));
        myNeedle.style.left = localPos + '%';
      } else if (myLocalStopPos !== null) {
        myNeedle.style.left = myLocalStopPos + '%';
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
    myLocalStopPos = localPos; // 즉시 멈춤
    const score = calculateScore(localPos);
    
    const fieldPrefix = myRole === 'p1' ? 'p1' : 'p2';
    const oldTotal = myRole === 'p1' ? currentState.p1Total : currentState.p2Total;

    GameUtils.RemoteManager.updateField(`${fieldPrefix}StopPos`, localPos);
    GameUtils.RemoteManager.updateField(`${fieldPrefix}Total`, parseFloat((oldTotal + score).toFixed(1)));
  }


  function calculateScore(pos) {
    const dist = Math.abs(pos - 50);
    const score = Math.max(0.1, 100 - (dist * 3.5));
    return parseFloat(score.toFixed(1));
  }

  function getGrade(score) {
    if (score >= 98) return 'PERFECT! 🎯';
    if (score >= 90) return 'EXCELLENT! 🌟';
    if (score >= 80) return 'GREAT! ✨';
    if (score >= 60) return 'GOOD 👍';
    return 'MISS 😅';
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

  // 도움말 버튼 제어
  const btnShowHelp = document.getElementById('btn-show-help');
  const overlayHelp = document.getElementById('overlay-help');

  if (btnShowHelp) {
    btnShowHelp.onclick = () => overlayHelp.classList.toggle('hidden');
  }

  init();
})();
