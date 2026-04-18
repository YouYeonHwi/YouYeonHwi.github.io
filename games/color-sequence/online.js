(() => {
  'use strict';

  const GAME_ID = 'color-sequence';
  const COLORS = ['red', 'blue', 'green', 'yellow'];
  
  let myRole = null;
  let currentState = {
    currentPlayer: 'p1', // 'p1' | 'p2'
    status: 'lobby', // lobby | showing | input | ended
    sequence: [],
    p1Lv: 0,
    p2Lv: 0,
    litColor: null // for syncing the flash
  };

  let playerInput = [];
  let isShowing = false;

  const myLvEl = document.getElementById('my-lv');
  const oppLvEl = document.getElementById('opp-lv');
  const turnTxt = document.getElementById('turn-txt');
  const gameMsg = document.getElementById('game-msg');
  const myGrid = document.getElementById('my-grid');
  const oppGrid = document.getElementById('opp-grid');

  function init() {
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      
      // 동기화 리스너 시작
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      if (myRole === 'p1') {
        startTurn('p1');
      }
    });
  }

  function startTurn(player) {
    GameUtils.RemoteManager.updateState({
      ...currentState,
      currentPlayer: player,
      sequence: [],
      status: 'showing',
      litColor: null
    });
    setTimeout(() => nextLevel(), 1000);
  }

  function nextLevel() {
    const state = GameUtils.RemoteManager.getRoomState().gameState;
    const newSeq = [...state.sequence, COLORS[Math.floor(Math.random() * COLORS.length)]];
    
    GameUtils.RemoteManager.updateState({
      ...state,
      sequence: newSeq,
      status: 'showing',
      litColor: null
    });

    showSequence(newSeq);
  }

  function showSequence(seq) {
    isShowing = true;
    let i = 0;
    const intv = setInterval(() => {
      if (i < seq.length) {
        // Sync the lit color so both see it
        GameUtils.RemoteManager.updateState({
          ...GameUtils.RemoteManager.getRoomState().gameState,
          litColor: seq[i]
        });
        GameUtils.vibrate(20);
        i++;
      } else {
        clearInterval(intv);
        GameUtils.RemoteManager.updateState({
          ...GameUtils.RemoteManager.getRoomState().gameState,
          litColor: null,
          status: 'input'
        });
        isShowing = false;
      }
    }, 800);
  }

  function onSync(state, role) {
    if (!state) return;
    currentState = state;
    myRole = role;

    const isMyTurn = (myRole === state.currentPlayer);
    turnTxt.textContent = isMyTurn ? '내 차례' : '상대방 차례';
    turnTxt.style.background = isMyTurn ? 'var(--primary)' : 'var(--secondary)';
    
    myLvEl.textContent = myRole === 'p1' ? state.p1Lv : state.p2Lv;
    oppLvEl.textContent = myRole === 'p1' ? state.p2Lv : state.p1Lv;

    // Lit Effect Sync
    updateGridVisuals(state.litColor, state.currentPlayer);

    if (state.status === 'input') {
      gameMsg.textContent = isMyTurn ? '순서대로 터치하세요!' : '상대방이 입력 중...';
      if (isMyTurn) enableGrid(true); else enableGrid(false);
    } else if (state.status === 'showing') {
      gameMsg.textContent = '순서를 기억하세요!';
      enableGrid(false);
    } else if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function updateGridVisuals(color, player) {
    const targetGrid = player === myRole ? myGrid : oppGrid;
    const otherGrid = player === myRole ? oppGrid : myGrid;

    // Reset all
    [myGrid, oppGrid].forEach(g => {
      g.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    });

    if (color) {
      const btn = targetGrid.querySelector(`[data-color="${color}"]`);
      if (btn) btn.classList.add('active');
    }
  }

  function handleTap(color) {
    if (currentState.status !== 'input' || isShowing) return;
    
    playerInput.push(color);
    GameUtils.vibrate(10);

    // Flash locally first for responsiveness
    const btn = myGrid.querySelector(`[data-color="${color}"]`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 200);

    const idx = playerInput.length - 1;
    if (playerInput[idx] !== currentState.sequence[idx]) {
      // Wrong!
      GameUtils.vibrate(100);
      const finalLv = currentState.sequence.length - 1;
      const update = myRole === 'p1' ? { p1Lv: finalLv } : { p2Lv: finalLv };
      
      if (myRole === 'p1') {
        // P2 turn start
        playerInput = [];
        startTurn('p2');
      } else {
        // Game Over
        GameUtils.RemoteManager.updateState({ ...currentState, ...update, status: 'ended' });
      }
    } else if (playerInput.length === currentState.sequence.length) {
      // Correct!
      playerInput = [];
      const currentLv = currentState.sequence.length;
      const update = myRole === 'p1' ? { p1Lv: currentLv } : { p2Lv: currentLv };
      GameUtils.RemoteManager.updateState({ ...currentState, ...update });
      setTimeout(() => { if (myRole === currentState.currentPlayer) nextLevel(); }, 500);
    }
  }

  function enableGrid(en) {
    myGrid.querySelectorAll('.color-btn').forEach(b => b.classList.toggle('disabled', !en));
  }

  function showFinalResult(state) {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const s1 = state.p1Lv;
    const s2 = state.p2Lv;
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    if (winner === 0) title.textContent = '🤝 무승부';
    else title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';

    detail.textContent = `최종 레벨 - 나: ${myRole === 'p1' ? s1 : s2} | 상대: ${myRole === 'p1' ? s2 : s1}`;
    overlay.classList.remove('hidden');

    if (iAmWinner && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  myGrid.querySelectorAll('.color-btn').forEach(btn => {
    btn.onclick = () => handleTap(btn.dataset.color);
  });

  init();
})();
