(() => {
  'use strict';

  const GAME_ID = 'tap-battle';
  let myRole = null;
  let currentState = {
    status: 'lobby', // lobby | countdown | waiting | go | ended
    startTime: 0,
    p1Time: 0,
    p2Time: 0,
    p1Fail: false,
    p2Fail: false
  };

  const myArea = document.getElementById('my-area');
  const oppArea = document.getElementById('opp-area');
  const myMsg = document.getElementById('my-msg');
  const oppMsg = document.getElementById('opp-msg');
  const myCount = document.getElementById('my-count');
  const oppCount = document.getElementById('opp-count');
  const gameStatus = document.getElementById('game-status');

  function init() {
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 완료 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      if (myRole === 'p1') {
        startWaiting(); // 바로 기다리기 상태로 진입 (엔진이 이미 321 카운트함)
      }
      listenToRoom();
    });
  }

  function listenToRoom() {
    GameUtils.RemoteManager.init(GAME_ID, onSync);
  }

  function startWaiting() {
    const delay = GameUtils.randomBetween(2000, 5000);
    // 방 상태를 'waiting'으로 명시적으로 업데이트
    GameUtils.RemoteManager.updateState({ ...currentState, status: 'waiting' });
    
    setTimeout(() => {
      // "GO" 신호 발생 — getRoomState()는 동기 반환
      const state = GameUtils.RemoteManager.getRoomState();
      if (state && state.status === 'waiting') {
        GameUtils.RemoteManager.updateState({
          ...state,
          status: 'go',
          startTime: Date.now()
        });
      }
    }, delay);
  }

  // ── Firebase null 안전 래퍼 ───────────────────────────────
  function safeState(raw) {
    if (!raw) return null;
    return {
      status: raw.status || 'lobby',
      startTime: raw.startTime || 0,
      p1Time: raw.p1Time || 0,
      p2Time: raw.p2Time || 0,
      p1Fail: !!raw.p1Fail,
      p2Fail: !!raw.p2Fail
    };
  }

  function onSync(rawState, role) {
    const state = safeState(rawState);
    if (!state) return;

    currentState = state;
    myRole = role;

    // UI 동기화
    updateUI();

    // Host(P1)가 두 명의 완료 여부를 확인하여 상태 전환 (Race Condition 방지)
    const p1Done = state.p1Time > 0 || state.p1Fail;
    const p2Done = state.p2Time > 0 || state.p2Fail;

    if (p1Done && p2Done && state.status !== 'ended') {
      if (myRole === 'p1') {
        GameUtils.RemoteManager.updateField('status', 'ended');
      }
    }

    // 결과 표시
    if (state.status === 'ended') {
      showResult();
    }
  }

  function updateUI() {
    const status = currentState.status;
    const p1Time = currentState.p1Time;
    const p2Time = currentState.p2Time;
    const p1Fail = currentState.p1Fail;
    const p2Fail = currentState.p2Fail;

    const myTime = myRole === 'p1' ? p1Time : p2Time;
    const myFail = myRole === 'p1' ? p1Fail : p2Fail;
    const oppTime = myRole === 'p1' ? p2Time : p1Time;
    const oppFail = myRole === 'p1' ? p2Fail : p1Fail;

    // 기본 상태 텍스트 및 레이아웃
    if (status === 'countdown') {
      myMsg.textContent = '준비...';
      oppMsg.textContent = '준비...';
      gameStatus.textContent = '카운트다운';
    } else if (status === 'waiting') {
      myMsg.textContent = '기다려...';
      oppMsg.textContent = '기다려...';
      gameStatus.textContent = '준비하세요';
      myArea.classList.remove('go', 'fail');
      oppArea.classList.remove('go', 'fail');
      myCount.style.opacity = '0.2';
      oppCount.style.opacity = '0.2';
      myCount.textContent = 'READY';
      oppCount.textContent = 'READY';
    } else if (status === 'go' || status === 'ended') {
      gameStatus.textContent = status === 'ended' ? '경기 종료' : '터치!!!';
      
      // 내 영역 상태 업데이트
      if (myFail) {
        myMsg.textContent = '너무 빨랐어요! (실격) 💀';
        myCount.textContent = 'FAIL';
        myCount.style.opacity = '1';
        myArea.classList.add('fail');
        myArea.classList.remove('go');
      } else if (myTime > 0) {
        myMsg.textContent = status === 'ended' ? '기록 확인 중...' : '터치 완료! 상대 대기 중...';
        myCount.textContent = myTime.toFixed(3) + 's';
        myCount.style.opacity = '1';
        myArea.classList.add('go');
      } else {
        myMsg.textContent = '지금!!! 터치하세요!';
        myCount.textContent = 'GO!';
        myArea.classList.add('go');
      }

      // 상대 영역 상태 업데이트
      if (oppFail) {
        oppMsg.textContent = '상대방 부정출발! 😂';
        oppCount.textContent = 'FAIL';
        oppCount.style.opacity = '1';
        oppArea.classList.add('fail');
        oppArea.classList.remove('go');
      } else if (oppTime > 0) {
        oppMsg.textContent = '상대방 터치 완료!';
        oppCount.textContent = oppTime.toFixed(3) + 's';
        oppCount.style.opacity = '1';
        oppArea.classList.add('go');
      } else {
        oppMsg.textContent = '상대방 대기 중...';
        oppCount.textContent = 'GO!';
        oppArea.classList.add('go');
      }
    }
  }


  function handleTap() {
    if (currentState.status === 'ended' || currentState.status === 'lobby') return;

    const now = Date.now();
    const fieldPrefix = myRole === 'p1' ? 'p1' : 'p2';
    
    // 이미 기록이 있으면 무시
    const alreadyDone = myRole === 'p1' 
      ? (currentState.p1Time > 0 || currentState.p1Fail)
      : (currentState.p2Time > 0 || currentState.p2Fail);
    if (alreadyDone) return;

    if (currentState.status === 'waiting') {
      // 조기 터치 실패
      GameUtils.RemoteManager.updateField(`${fieldPrefix}Fail`, true);
      GameUtils.vibrate(100);
    } else if (currentState.status === 'go') {
      // 정상 터치
      const reaction = (now - currentState.startTime) / 1000;
      GameUtils.RemoteManager.updateField(`${fieldPrefix}Time`, reaction);
      GameUtils.vibrate(20);
    }
  }

  function showResult() {
    const overlay = document.getElementById('result-overlay');
    const winnerEl = document.getElementById('result-winner');
    const detailEl = document.getElementById('result-detail');

    const myTime = myRole === 'p1' ? currentState.p1Time : currentState.p2Time;
    const oppTime = myRole === 'p1' ? currentState.p2Time : currentState.p1Time;
    const myFail = myRole === 'p1' ? currentState.p1Fail : currentState.p2Fail;
    const oppFail = myRole === 'p1' ? currentState.p2Fail : currentState.p1Fail;

    let resultMsg = "";
    let win = false;

    if (myFail && oppFail) resultMsg = "둘 다 너무 빨랐어요! (무승부)";
    else if (myFail) resultMsg = "패배 (부정출발)";
    else if (oppFail) { resultMsg = "승리! (상대방 부정출발)"; win = true; }
    else if (myTime < oppTime) { resultMsg = "승리! 🎉"; win = true; }
    else if (myTime > oppTime) resultMsg = "패배... 💀";
    else resultMsg = "무승부! 🤝";

    winnerEl.textContent = resultMsg;
    detailEl.textContent = `기록 - 나: ${myFail ? '실격' : myTime + 's'} | 상대: ${oppFail ? '실격' : oppTime + 's'}`;
    overlay.classList.remove('hidden');

    // 점수 저장 (한 번만)
    if (win && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  myArea.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(); });
  myArea.addEventListener('mousedown', handleTap);

  // 도움말 제어
  const btnShowHelp = document.getElementById('btn-show-help');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const overlayHelp = document.getElementById('overlay-help');

  const toggleHelp = () => overlayHelp.classList.toggle('hidden');
  if (btnShowHelp) btnShowHelp.onclick = toggleHelp;
  if (btnCloseHelp) btnCloseHelp.onclick = toggleHelp;

  init();
})();
