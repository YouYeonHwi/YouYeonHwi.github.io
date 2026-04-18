(() => {
  'use strict';

  const GAME_ID = 'memory-numbers';
  const MAX_ROUNDS = 5;
  
  let myRole = null;
  let currentState = {
    round: 1,
    currentNumber: '',
    status: 'lobby', // lobby | showing | input | resolving | ended
    p1Answer: '',
    p2Answer: '',
    p1Score: 0,
    p2Score: 0
  };

  const mainNumber = document.getElementById('main-number');
  const myInputEl = document.getElementById('my-input');
  const myStatus = document.getElementById('my-status');
  const oppStatus = document.getElementById('opp-status');
  const roundText = document.getElementById('round-text');
  const myScoreEl = document.getElementById('my-score');
  const oppScoreEl = document.getElementById('opp-score');
  const oppProgress = document.getElementById('opp-progress');
  const numBtns = document.querySelectorAll('.num-btn');

  function init() {
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      
      // 동기화 리스너 시작
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      if (myRole === 'p1') {
        startNextRound(1, 0, 0);
      }
    });
  }

  function startNextRound(round, s1, s2) {
    const len = 2 + round;
    let num = '';
    for (let i = 0; i < len; i++) num += Math.floor(Math.random() * 10);

    GameUtils.RemoteManager.updateState({
      ...currentState,
      round: round,
      currentNumber: num,
      status: 'showing',
      p1Answer: '',
      p2Answer: '',
      p1Score: s1,
      p2Score: s2
    });

    // 2초 후 입력 단계로 전환
    setTimeout(() => {
      GameUtils.RemoteManager.updateState({
        ...GameUtils.RemoteManager.getRoomState()?.gameState, // 최신 상태 가져오기
        status: 'input'
      });
    }, 1500 + (round * 500));
  }

  function onSync(state, role) {
    if (!state) return;
    currentState = state;
    myRole = role;

    roundText.textContent = `ROUND ${state.round}/${MAX_ROUNDS}`;
    myScoreEl.textContent = myRole === 'p1' ? state.p1Score : state.p2Score;
    oppScoreEl.textContent = myRole === 'p1' ? state.p2Score : state.p1Score;

    const myAnswer = myRole === 'p1' ? state.p1Answer : state.p2Answer;
    const oppAnswer = myRole === 'p1' ? state.p2Answer : state.p1Answer;

    // UI 상태 갱신
    if (state.status === 'showing') {
      mainNumber.textContent = state.currentNumber;
      mainNumber.classList.remove('blur');
      myStatus.textContent = '숫자를 기억하세요!';
      oppStatus.textContent = '상대방도 기억하는 중...';
      disableNumpad(true);
    } 
    else if (state.status === 'input') {
      mainNumber.textContent = '?'.repeat(state.currentNumber.length);
      mainNumber.classList.add('blur');
      myStatus.textContent = '입력하세요!';
      myInputEl.textContent = myAnswer;
      disableNumpad(myAnswer.length >= state.currentNumber.length);
      
      // 상대방 진행 상황 업데이트 (동그라미 표시)
      updateOppProgress(oppAnswer.length, state.currentNumber.length);
      oppStatus.textContent = oppAnswer.length >= state.currentNumber.length ? '상대방 입력 완료!' : '상대방 입력 중...';

      // 둘 다 입력 완료 시 Host가 다음 단계 진행
      if (myRole === 'p1' && state.p1Answer.length >= state.currentNumber.length && state.p2Answer.length >= state.currentNumber.length) {
        resolveRound(state);
      }
    }
    else if (state.status === 'resolving') {
      mainNumber.textContent = state.currentNumber;
      mainNumber.classList.remove('blur');
      const p1Win = state.p1Answer === state.currentNumber;
      const p2Win = state.p2Answer === state.currentNumber;
      
      const IWin = myRole === 'p1' ? p1Win : p2Win;
      myStatus.textContent = IWin ? '✅ 정답!' : '❌ 틀렸습니다';
    }
    else if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function updateOppProgress(current, total) {
    oppProgress.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const ball = document.createElement('div');
      ball.className = 'opp-ball' + (i < current ? ' filled' : '');
      oppProgress.appendChild(ball);
    }
  }

  function resolveRound(state) {
    const p1Correct = state.p1Answer === state.currentNumber;
    const p2Correct = state.p2Answer === state.currentNumber;
    
    const nextS1 = state.p1Score + (p1Correct ? 1 : 0);
    const nextS2 = state.p2Score + (p2Correct ? 1 : 0);

    GameUtils.RemoteManager.updateState({
        ...state,
        status: 'resolving',
        p1Score: nextS1,
        p2Score: nextS2
    });

    setTimeout(() => {
      if (state.round >= MAX_ROUNDS) {
        GameUtils.RemoteManager.updateState({
            ...GameUtils.RemoteManager.getRoomState().gameState,
            status: 'ended'
        });
      } else {
        startNextRound(state.round + 1, nextS1, nextS2);
      }
    }, 2000);
  }

  function handleInput(num) {
    if (currentState.status !== 'input') return;
    const myAnswer = myRole === 'p1' ? currentState.p1Answer : currentState.p2Answer;
    if (myAnswer.length >= currentState.currentNumber.length) return;

    const nextAnswer = myAnswer + num;
    const update = myRole === 'p1' ? { p1Answer: nextAnswer } : { p2Answer: nextAnswer };
    
    GameUtils.vibrate(15);
    GameUtils.RemoteManager.updateState({ ...currentState, ...update });
  }

  function disableNumpad(disabled) {
    numBtns.forEach(btn => btn.classList.toggle('disabled', disabled));
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const s1 = state.p1Score;
    const s2 = state.p2Score;
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    if (winner === 0) {
      title.textContent = '🤝 무승부';
    } else {
      title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';
      title.style.color = iAmWinner ? 'var(--primary)' : 'var(--secondary)';
    }

    detail.textContent = `최종 점수 - 나: ${myRole === 'p1' ? s1 : s2} | 상대: ${myRole === 'p1' ? s2 : s1}`;
    overlay.classList.remove('hidden');

    // 승점 보드 저장
    if (iAmWinner && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  numBtns.forEach(btn => {
    btn.onclick = () => handleInput(btn.dataset.num);
  });

  init();
})();
