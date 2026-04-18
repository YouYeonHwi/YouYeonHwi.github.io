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
      // "GO" 신호 발생
      GameUtils.RemoteManager.getRoomState((state) => {
          if (state && state.status === 'waiting') {
            GameUtils.RemoteManager.updateState({
              ...state,
              status: 'go',
              startTime: Date.now()
            });
          }
      });
    }, delay);
  }

  function onSync(state, role) {
    if (!state) return;
    const oldStatus = currentState.status;
    currentState = state;
    myRole = role;

    // UI 동기화
    updateUI();

    // 결과 체크 (끝났을 때)
    if (state.status === 'ended' || (state.p1Time && state.p2Time) || (state.p1Fail && state.p2Fail)) {
      showResult();
    }
  }

  function updateUI() {
    const status = currentState.status;
    
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
    } else if (status === 'go') {
      myMsg.textContent = '지금!!!';
      oppMsg.textContent = '지금!!!';
      gameStatus.textContent = '터치!!!';
      myArea.classList.add('go');
      oppArea.classList.add('go');
    }

    // 실패 상태 표시
    const myFail = myRole === 'p1' ? currentState.p1Fail : currentState.p2Fail;
    const oppFail = myRole === 'p1' ? currentState.p2Fail : currentState.p1Fail;

    if (myFail) {
      myMsg.textContent = '너무 빨랐어요! 💀';
      myArea.classList.add('fail');
    }
    if (oppFail) {
      oppMsg.textContent = '상대방 실격! 😂';
      oppArea.classList.add('fail');
    }
  }

  function handleTap() {
    if (currentState.status === 'ended') return;

    const now = Date.now();
    const update = {};

    if (currentState.status === 'waiting') {
      // 조기 터치 실패
      if (myRole === 'p1') update.p1Fail = true;
      else update.p2Fail = true;
      GameUtils.vibrate(100);
    } else if (currentState.status === 'go') {
      // 정상 터치
      const reaction = (now - currentState.startTime) / 1000;
      if (myRole === 'p1') {
        if (currentState.p1Time) return;
        update.p1Time = reaction;
      } else {
        if (currentState.p2Time) return;
        update.p2Time = reaction;
      }
      GameUtils.vibrate(20);
    } else {
      return;
    }

    // 상태 업데이트 및 자동 종료 체크
    const nextState = { ...currentState, ...update };
    if ((nextState.p1Time || nextState.p1Fail) && (nextState.p2Time || nextState.p2Fail)) {
      nextState.status = 'ended';
    }
    GameUtils.RemoteManager.updateState(nextState);
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

  init();
})();
