(() => {
  'use strict';

  const GAME_ID = 'yahtzee';
  const MAX_ROLLS = 3;
  const CATS = ['ones','twos','threes','fours','fives','sixes','threeKind','fourKind','fullHouse','smStr','lgStr','yahtzee','chance'];

  const ROTATIONS = {
    1: { x: 0,   y: 0   },
    2: { x: 0,   y: -90 },
    3: { x: 0,   y: 90  },
    4: { x: -90, y: 0   },
    5: { x: 90,  y: 0   },
    6: { x: 180, y: 0   }
  };

  // --- 상태 ---
  let myRole = null;
  let currentState = {
    status: 'lobby',
    dice: [1, 1, 1, 1, 1],
    held: [false, false, false, false, false],
    rollsLeft: MAX_ROLLS,
    turn: 'p1',          // 'p1' | 'p2'
    scores: { p1: {}, p2: {} },
    lastAction: null,    // 'roll' | 'hold' | 'score'
    winner: null
  };

  // --- DOM 참조 ---
  const turnIndicator = document.getElementById('turn-indicator');
  const rollsLeftEl   = document.getElementById('rolls-left');
  const btnRoll       = document.getElementById('btn-roll');
  const diceRow       = document.getElementById('dice-row');

  // ── 초기화 ──────────────────────────────────────────────
  function init() {
    buildDiceDOM();
    buildScoreDOMListeners();

    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      myRole = GameUtils.RemoteManager.getRole();

      // 공통 엔진 동기화 리스너 등록
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      // Host가 초기 상태를 기록
      if (myRole === 'p1') {
        GameUtils.RemoteManager.updateState({ ...currentState, status: 'playing', turn: 'p1' });
      }
    });
  }

  // ── 동기화 콜백 (Firebase 변경 → 양쪽 모두 실행) ───────
  function onSync(state, role) {
    if (!state) return;

    const prevDice     = [...currentState.dice];
    const prevAction   = currentState.lastAction;
    currentState = state;
    myRole = role;

    // 주사위 애니메이션: 상대가 굴린 경우
    if (state.lastAction === 'roll' && JSON.stringify(prevDice) !== JSON.stringify(state.dice)) {
      animateDice(state.dice);
    } else {
      updateDiceFaces(state.dice);
    }

    updateUI();

    // 게임 종료 체크
    if (state.winner) {
      showResult(state);
    }
  }

  // ── 게임 액션 ────────────────────────────────────────────
  function isMyTurn() {
    return myRole === currentState.turn;
  }

  function rollDice() {
    if (!isMyTurn() || currentState.rollsLeft <= 0) return;

    const newDice = currentState.dice.map((v, i) =>
      currentState.held[i] ? v : Math.floor(Math.random() * 6) + 1
    );

    GameUtils.RemoteManager.updateState({
      ...currentState,
      dice: newDice,
      rollsLeft: currentState.rollsLeft - 1,
      lastAction: 'roll'
    });
    GameUtils.vibrate(30);
  }

  function toggleHold(i) {
    if (!isMyTurn() || currentState.rollsLeft === MAX_ROLLS) return;

    const newHeld = [...currentState.held];
    newHeld[i] = !newHeld[i];

    GameUtils.RemoteManager.updateState({
      ...currentState,
      held: newHeld,
      lastAction: 'hold'
    });
    GameUtils.vibrate(10);
  }

  function pickCategory(catId) {
    if (!isMyTurn()) return;
    if (currentState.rollsLeft === MAX_ROLLS) return; // 아직 주사위를 굴리지 않음
    if (currentState.scores[myRole][catId] !== undefined) return; // 이미 선택

    const score = calculateScore(catId, currentState.dice);
    const newScores = {
      p1: { ...currentState.scores.p1 },
      p2: { ...currentState.scores.p2 }
    };
    newScores[myRole][catId] = score;

    const nextTurn = myRole === 'p1' ? 'p2' : 'p1';

    // 게임 종료 판정: 양쪽 모두 13개 카테고리를 모두 채웠는지 확인
    const p1Done = CATS.every(c => newScores.p1[c] !== undefined);
    const p2Done = CATS.every(c => newScores.p2[c] !== undefined);
    const gameOver = p1Done && p2Done;

    let winner = null;
    if (gameOver) {
      const s1 = calcTotal(newScores.p1);
      const s2 = calcTotal(newScores.p2);
      winner = s1 > s2 ? 'p1' : s2 > s1 ? 'p2' : 'draw';
    }

    GameUtils.RemoteManager.updateState({
      ...currentState,
      scores: newScores,
      turn: gameOver ? currentState.turn : nextTurn,
      rollsLeft: MAX_ROLLS,
      held: [false, false, false, false, false],
      lastAction: 'score',
      winner
    });
  }

  // ── UI 업데이트 ──────────────────────────────────────────
  function updateUI() {
    const myTurn = isMyTurn();

    rollsLeftEl.textContent = `${currentState.rollsLeft}회 남음`;
    btnRoll.disabled = !myTurn || currentState.rollsLeft <= 0 || !!currentState.winner;
    btnRoll.textContent = myTurn
      ? (currentState.rollsLeft > 0 ? '🎲 주사위 굴리기' : '조합을 선택하세요')
      : '⏳ 상대방 턴 대기 중...';

    turnIndicator.textContent = myTurn ? '✨ 나의 차례!' : '💤 상대방의 차례';
    turnIndicator.className = `turn-indicator${myTurn ? ' active' : ''}`;

    updateScoreTable();
    updateMiniScores();
  }

  function updateMiniScores() {
    const s1 = calcTotal(currentState.scores.p1);
    const s2 = calcTotal(currentState.scores.p2);
    const mini1 = document.getElementById('mini-p1');
    const mini2 = document.getElementById('mini-p2');
    if (mini1) mini1.textContent = `P1: ${s1}`;
    if (mini2) mini2.textContent = `P2: ${s2}`;
  }

  function updateScoreTable() {
    CATS.forEach(id => {
      [1, 2].forEach(idx => {
        const p = idx === 1 ? 'p1' : 'p2';
        const cell = document.getElementById(`cell-${id}-${idx}`);
        if (!cell) return;

        const score = currentState.scores[p][id];
        if (score !== undefined) {
          cell.textContent = score;
          cell.className = 'score-cell filled';
          cell.onclick = null;
        } else if (p === myRole && isMyTurn() && currentState.rollsLeft < MAX_ROLLS) {
          const pot = calculateScore(id, currentState.dice);
          cell.textContent = pot;
          cell.className = pot > 0 ? 'score-cell available' : 'score-cell zero-available';
          cell.onclick = () => pickCategory(id);
        } else {
          cell.textContent = '-';
          cell.className = 'score-cell empty';
          cell.onclick = null;
        }
      });
    });
  }

  // ── 주사위 DOM ───────────────────────────────────────────
  function buildDiceDOM() {
    diceRow.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      diceRow.innerHTML += `
        <div class="die-scene" id="scene-${i}">
          <div class="die-cube" id="cube-${i}">
            <div class="die-face front face-1"><div class="dot"></div></div>
            <div class="die-face right face-2"><div class="dot"></div><div class="dot"></div></div>
            <div class="die-face left face-3"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
            <div class="die-face top face-4"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
            <div class="die-face bottom face-5"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
            <div class="die-face back face-6"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
          </div>
        </div>`;
    }
    for (let i = 0; i < 5; i++) {
      document.getElementById(`scene-${i}`).onclick = () => toggleHold(i);
    }
  }

  function buildScoreDOMListeners() {
    // 점수 셀 클릭은 updateScoreTable에서 동적으로 처리
  }

  function animateDice(values) {
    for (let i = 0; i < 5; i++) {
      const cube = document.getElementById(`cube-${i}`);
      const rot  = ROTATIONS[values[i]];
      const spinX = 720 + rot.x;
      const spinY = 720 + rot.y;
      cube.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
      cube.style.transform  = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
      const scene = document.getElementById(`scene-${i}`);
      scene.classList.toggle('held', currentState.held[i]);
    }
  }

  function updateDiceFaces(values) {
    for (let i = 0; i < 5; i++) {
      const cube = document.getElementById(`cube-${i}`);
      const rot  = ROTATIONS[values[i]];
      cube.style.transition = 'none';
      cube.style.transform  = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
      const scene = document.getElementById(`scene-${i}`);
      scene.classList.toggle('held', currentState.held[i]);
    }
  }

  // ── 점수 계산 ─────────────────────────────────────────────
  function calculateScore(cat, d) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    d.forEach(v => counts[v]++);
    const sumAll = d.reduce((a, b) => a + b, 0);
    switch (cat) {
      case 'ones':      return d.filter(v => v === 1).length * 1;
      case 'twos':      return d.filter(v => v === 2).length * 2;
      case 'threes':    return d.filter(v => v === 3).length * 3;
      case 'fours':     return d.filter(v => v === 4).length * 4;
      case 'fives':     return d.filter(v => v === 5).length * 5;
      case 'sixes':     return d.filter(v => v === 6).length * 6;
      case 'threeKind': return counts.some(c => c >= 3) ? sumAll : 0;
      case 'fourKind':  return counts.some(c => c >= 4) ? sumAll : 0;
      case 'fullHouse': {
        const v = counts.filter(c => c > 0);
        return (v.includes(3) && v.includes(2)) ? 25 : 0;
      }
      case 'smStr': {
        const s = [...new Set(d)].sort().join('');
        return /1234|2345|3456/.test(s) ? 30 : 0;
      }
      case 'lgStr': {
        const l = [...new Set(d)].sort().join('');
        return /12345|23456/.test(l) ? 40 : 0;
      }
      case 'yahtzee': return counts.some(c => c === 5) ? 50 : 0;
      case 'chance':  return sumAll;
      default:        return 0;
    }
  }

  function calcTotal(scores) {
    return CATS.reduce((sum, c) => sum + (scores[c] || 0), 0);
  }

  // ── 결과 화면 ─────────────────────────────────────────────
  function showResult(state) {
    const overlay  = document.getElementById('overlay-result');
    const winnerEl = document.getElementById('winner-text');
    const scoresEl = document.getElementById('final-scores');
    if (!overlay || overlay.dataset.shown) return;
    overlay.dataset.shown = '1';

    const s1 = calcTotal(state.scores.p1);
    const s2 = calcTotal(state.scores.p2);
    const iAmP1 = myRole === 'p1';

    let titleText;
    if (state.winner === 'draw') {
      titleText = '🤝 무승부!';
    } else {
      const iWon = state.winner === myRole;
      titleText = iWon ? '🎉 승리!' : '💀 패배...';
      if (iWon && !window.scoreSaved) {
        const gs = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') gs.p1++; else gs.p2++;
        GameUtils.saveScores(GAME_ID, gs);
        window.scoreSaved = true;
      }
    }

    if (winnerEl) winnerEl.textContent = titleText;
    if (scoresEl) scoresEl.innerHTML = `
      <div style="margin-top:1rem; font-size:1.1rem;">
        나: <b>${iAmP1 ? s1 : s2}점</b> | 상대: <b>${iAmP1 ? s2 : s1}점</b>
      </div>`;

    overlay.classList.remove('hidden');
  }

  // ── 버튼 이벤트 바인딩 ───────────────────────────────────
  btnRoll.onclick = rollDice;

  // ── 시작 ─────────────────────────────────────────────────
  init();
})();
