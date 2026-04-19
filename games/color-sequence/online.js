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
    const newState = {
      ...currentState,
      currentPlayer: player,
      sequence: [],
      status: 'showing',
      litColor: null
    };
    GameUtils.RemoteManager.updateState(newState);
    setTimeout(() => nextLevel(newState), 1000);
  }

  function nextLevel(baseState) {
    const state = baseState || currentState;
    const newSeq = [...state.sequence, COLORS[Math.floor(Math.random() * COLORS.length)]];
    
    const updatedState = {
      ...state,
      sequence: newSeq,
      status: 'showing',
      litColor: null
    };
    GameUtils.RemoteManager.updateState(updatedState);
    showSequence(newSeq, updatedState);
  }

  function showSequence(seq, baseState) {
    isShowing = true;
    let i = 0;
    const intv = setInterval(() => {
      if (i < seq.length) {
        // Sync the lit color so both see it
        GameUtils.RemoteManager.updateState({
          ...(baseState || currentState),
          sequence: seq,
          litColor: seq[i]
        });
        GameUtils.vibrate(20);
        i++;
      } else {
        clearInterval(intv);
        GameUtils.RemoteManager.updateState({
          ...(baseState || currentState),
          sequence: seq,
          litColor: null,
          status: 'input'
        });
        isShowing = false;
      }
    }, 800);
  }

  // ── Firebase null 안전 래퍼 ───────────────────────────────
  function safeState(raw) {
    if (!raw) return null;
    return {
      currentPlayer: raw.currentPlayer || 'p1',
      status: raw.status || 'lobby',
      sequence: Array.isArray(raw.sequence) ? raw.sequence : [],
      p1Lv: raw.p1Lv || 0,
      p2Lv: raw.p2Lv || 0,
      litColor: raw.litColor || null
    };
  }

  function onSync(rawState, role) {
    const state = safeState(rawState);
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

      // p1(Host)이 p2의 실패를 감지해 자동으로 p1 턴으로 전환
      if (myRole === 'p1' && state.currentPlayer === 'p2' && state.p2Lv > 0 && state.p1Lv === 0 && !isShowing) {
        setTimeout(() => startTurn('p1'), 600);
      }
    } else if (state.status === 'showing') {
      gameMsg.textContent = '순서를 기억하세요!';
      enableGrid(false);
    } else if (state.status === 'ended') {
      showFinalResult(state);
    }
  }

  function updateGridVisuals(color, player) {
    const targetGrid = player === myRole ? myGrid : oppGrid;

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
    if (currentState.currentPlayer !== myRole) return;
    
    playerInput.push(color);
    GameUtils.vibrate(10);

    const btn = myGrid.querySelector(`[data-color="${color}"]`);
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 200);

    const idx = playerInput.length - 1;
    if (playerInput[idx] !== currentState.sequence[idx]) {
      // 틀렸을 때
      GameUtils.vibrate(100);
      const finalLv = currentState.sequence.length - 1;
      const field = myRole === 'p1' ? 'p1Lv' : 'p2Lv';
      GameUtils.RemoteManager.updateField(field, finalLv);
      playerInput = [];

      const otherPlayer = myRole === 'p1' ? 'p2' : 'p1';
      const otherLv = myRole === 'p1' ? currentState.p2Lv : currentState.p1Lv;

      if (otherLv > 0) {
        GameUtils.RemoteManager.updateField('status', 'ended');
      } else {
        if (myRole === 'p1') {
          setTimeout(() => startTurn(otherPlayer), 600);
        }
      }
    } else if (playerInput.length === currentState.sequence.length) {
      // 정답!
      playerInput = [];
      const currentLv = currentState.sequence.length;
      const field = myRole === 'p1' ? 'p1Lv' : 'p2Lv';
      GameUtils.RemoteManager.updateField(field, currentLv);
      
      setTimeout(() => {
        if (myRole === currentState.currentPlayer) nextLevel();
      }, 500);
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

  // 도움말 버튼 제어
  const btnShowHelp = document.getElementById('btn-show-help');
  const overlayHelp = document.getElementById('overlay-help');

  if (btnShowHelp) {
    btnShowHelp.onclick = () => overlayHelp.classList.toggle('hidden');
  }

  init();
})();
