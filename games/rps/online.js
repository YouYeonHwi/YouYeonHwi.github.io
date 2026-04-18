(() => {
  'use strict';

  const GAME_ID = 'rps';
  const emojiMap = { scissors: '✌️', rock: '✊', paper: '🖐️', null: '❔' };
  
  let myRole = null; // 'p1' or 'p2'
  let currentState = {
    round: 1,
    p1Choice: null,
    p2Choice: null,
    p1Score: 0,
    p2Score: 0,
    status: 'playing' // 'playing' | 'resolving' | 'ended'
  };

  const myChoiceEl = document.getElementById('my-choice');
  const oppChoiceEl = document.getElementById('opp-choice');
  const oppStatusEl = document.getElementById('opp-status');
  const roundText = document.getElementById('round-text');
  const myScoreEl = document.getElementById('my-score');
  const oppScoreEl = document.getElementById('opp-score');
  const choiceBtns = document.querySelectorAll('.choice-btn');

  function init() {
    GameUtils.RemoteManager.init(GAME_ID, onSync);
    
    // 로비 오픈
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      console.log('게임 시작!');
      myRole = GameUtils.RemoteManager.getRole();
    });
  }

  function onSync(state, role, roomStatus) {
    if (!state) return;
    currentState = state;
    myRole = role;

    // UI 업데이트
    roundText.textContent = `ROUND ${state.round}`;
    const myScore = myRole === 'p1' ? state.p1Score : state.p2Score;
    const oppScore = myRole === 'p1' ? state.p2Score : state.p1Score;
    myScoreEl.textContent = `나: ${myScore}`;
    oppScoreEl.textContent = `상대: ${oppScore}`;

    const myChoice = myRole === 'p1' ? state.p1Choice : state.p2Choice;
    const oppChoice = myRole === 'p1' ? state.p2Choice : state.p1Choice;

    myChoiceEl.textContent = emojiMap[myChoice] || '❔';
    
    // 상대방 선택 상태 표시
    if (oppChoice && !myChoice) {
      oppStatusEl.textContent = '상대방 선택 완료! (당신을 기다림)';
      oppChoiceEl.textContent = '✅';
    } else if (oppChoice && myChoice) {
      oppStatusEl.textContent = '둘 다 선택 완료!';
      oppChoiceEl.textContent = emojiMap[oppChoice];
      
      // 결과 산출 (Host인 P1이 처리하여 동기화)
      if (myRole === 'p1' && state.status === 'playing') {
        resolveRound(state);
      }
    } else {
      oppStatusEl.textContent = '상대방 선택 중...';
      oppChoiceEl.textContent = '❔';
    }

    // 결과 화면
    if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function resolveRound(state) {
    const winner = getWinner(state.p1Choice, state.p2Choice);
    const nextState = { ...state, status: 'resolving' };
    
    if (winner === 1) nextState.p1Score++;
    else if (winner === 2) nextState.p2Score++;

    // 3판 2선승제 또는 최대 라운드 체크
    if (nextState.p1Score >= 2 || nextState.p2Score >= 2 || nextState.round >= 5) {
      nextState.status = 'ended';
    } else {
      // 2초 후 다음 라운드 준비
      setTimeout(() => {
        GameUtils.RemoteManager.updateState({
          ...nextState,
          round: nextState.round + 1,
          p1Choice: null,
          p2Choice: null,
          status: 'playing'
        });
      }, 2000);
    }
    
    GameUtils.RemoteManager.updateState(nextState);
  }

  function getWinner(p1, p2) {
    if (p1 === p2) return 0;
    if ((p1 === 'scissors' && p2 === 'paper') || 
        (p1 === 'rock' && p2 === 'scissors') || 
        (p1 === 'paper' && p2 === 'rock')) return 1;
    return 2;
  }

  function handleChoice(choice) {
    if (currentState.status !== 'playing') return;
    const update = {};
    if (myRole === 'p1') {
      if (currentState.p1Choice) return;
      update.p1Choice = choice;
    } else {
      if (currentState.p2Choice) return;
      update.p2Choice = choice;
    }
    
    GameUtils.RemoteManager.updateState({ ...currentState, ...update });
    GameUtils.vibrate(20);
    
    // 버튼 비활성화
    choiceBtns.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.choice === choice);
      btn.classList.add('disabled');
    });
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('result-title');
    const detail = document.getElementById('result-detail');
    
    const myScore = myRole === 'p1' ? state.p1Score : state.p2Score;
    const oppScore = myRole === 'p1' ? state.p2Score : state.p1Score;
    
    if (myScore > oppScore) {
      title.textContent = '🎉 승리!';
      title.style.color = 'var(--primary)';
    } else if (myScore < oppScore) {
      title.textContent = '💀 패배...';
      title.style.color = 'var(--accent)';
    } else {
      title.textContent = '🤝 무승부';
    }
    
    detail.textContent = `최종 점수 - 나: ${myScore}점 | 상대: ${oppScore}점`;
    overlay.classList.remove('hidden');
  }

  // Event Listeners
  choiceBtns.forEach(btn => {
    btn.onclick = () => handleChoice(btn.dataset.choice);
  });

  init();
})();
