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

  // ── 상태 ──────────────────────────────────────────────────
  let myRole = null;
  let resultShown = false; // 결과 화면 중복 표시 방지

  // 주사위별 누적 회전값 — 매 굴리기마다 360° 추가해 같은 눈값에도 항상 애니메이션 발생
  const diceBaseRot = [
    { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
  ];

  // 초기 로컬 상태 (Firebase 업데이트 전 기본값)
  let currentState = {
    status: 'lobby',
    dice: [1, 1, 1, 1, 1],
    held: [false, false, false, false, false],
    rollsLeft: MAX_ROLLS,
    turn: 'p1',
    scores: { p1: {}, p2: {} },
    lastAction: null,
    winner: null
  };

  // ── DOM 참조 ──────────────────────────────────────────────
  const turnIndicator = document.getElementById('turn-indicator');
  const rollsLeftEl   = document.getElementById('rolls-left');
  const btnRoll       = document.getElementById('btn-roll');
  const diceRow       = document.getElementById('dice-row');

  // ── Firebase null 안전 래퍼 ───────────────────────────────
  // Firebase RTDB는 빈 객체{}를 null로 저장하므로 항상 방어적으로 처리
  function safeScores(raw) {
    const s = raw || {};
    return {
      p1: s.p1 || {},
      p2: s.p2 || {}
    };
  }

  function safeState(raw) {
    if (!raw) return null;
    return {
      ...raw,
      dice:  Array.isArray(raw.dice)  ? raw.dice  : [1,1,1,1,1],
      held:  Array.isArray(raw.held)  ? raw.held  : [false,false,false,false,false],
      rollsLeft: raw.rollsLeft !== undefined ? raw.rollsLeft : MAX_ROLLS,
      turn:   raw.turn   || 'p1',
      status: raw.status || 'lobby',
      scores: safeScores(raw.scores),
      lastAction: raw.lastAction || null,
      winner: raw.winner || null
    };
  }

  // ── 초기화 ───────────────────────────────────────────────
  function init() {
    buildDiceDOM();

    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      myRole = GameUtils.RemoteManager.getRole();

      // 동기화 리스너 등록
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      // Host(p1)가 초기 상태를 Firebase에 기록 → 양쪽 onSync 트리거
      if (myRole === 'p1') {
        GameUtils.RemoteManager.updateState({
          ...currentState,
          status: 'playing',
          turn: 'p1',
          rollsLeft: MAX_ROLLS,
          held: [false, false, false, false, false],
          scores: { p1: {}, p2: {} }
        });
      }
    });
  }

  // ── 동기화 콜백 ──────────────────────────────────────────
  function onSync(rawState, role) {
    const state = safeState(rawState);
    if (!state) return;

    const prevDice   = [...currentState.dice];
    const prevStatus = currentState.status;

    // 상태 업데이트
    currentState = state;
    myRole = role;

    // 주사위 애니메이션: 주사위가 실제로 변경된 경우에만
    if (state.lastAction === 'roll' && JSON.stringify(prevDice) !== JSON.stringify(state.dice)) {
      animateDice(state.dice);
    } else {
      updateDiceFaces(state.dice);
    }

    // 게임 UI 전체 갱신
    updateUI();

    // 게임 종료 처리 (중복 방지)
    if (state.winner && !resultShown) {
      resultShown = true;
      showResult(state);
    }
  }

  // ── 내 턴 여부 ───────────────────────────────────────────
  function isMyTurn() {
    return myRole !== null && myRole === currentState.turn;
  }

  // ── 주사위 굴리기 ────────────────────────────────────────
  function rollDice() {
    if (!isMyTurn()) return;
    if (currentState.rollsLeft <= 0) return;
    if (currentState.status !== 'playing') return;

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

  // ── 주사위 홀드 토글 ─────────────────────────────────────
  function toggleHold(i) {
    if (!isMyTurn()) return;
    if (currentState.rollsLeft === MAX_ROLLS) return; // 아직 굴리기 전
    if (currentState.rollsLeft <= 0) return;          // 굴리기 횟수 소진
    if (currentState.status !== 'playing') return;

    const newHeld = [...currentState.held];
    newHeld[i] = !newHeld[i];

    GameUtils.RemoteManager.updateState({
      ...currentState,
      held: newHeld,
      lastAction: 'hold'
    });
    GameUtils.vibrate(10);
  }

  // ── 점수 카테고리 선택 ───────────────────────────────────
  function pickCategory(catId) {
    // 엄격한 가드: 내 턴, 굴리기 완료, 상태 확인, 중복 선택 방지
    if (!isMyTurn()) return;
    if (currentState.rollsLeft === MAX_ROLLS) return;   // 주사위 굴리지 않음
    if (currentState.status !== 'playing') return;
    if (currentState.winner) return;                    // 게임 종료 후

    const myScores = currentState.scores[myRole] || {};
    if (myScores[catId] !== undefined) return;          // 이미 해당 칸 선택

    const score = calculateScore(catId, currentState.dice);

    // 점수 안전 복사
    const newScores = {
      p1: { ...currentState.scores.p1 },
      p2: { ...currentState.scores.p2 }
    };
    newScores[myRole][catId] = score;

    const nextTurn = myRole === 'p1' ? 'p2' : 'p1';

    // 게임 종료 판정
    const p1Done = CATS.every(c => newScores.p1[c] !== undefined);
    const p2Done = CATS.every(c => newScores.p2[c] !== undefined);
    const gameOver = p1Done && p2Done;

    let winner = null;
    if (gameOver) {
      const s1 = calcTotal(newScores.p1);
      const s2 = calcTotal(newScores.p2);
      winner = s1 > s2 ? 'p1' : s2 > s1 ? 'p2' : 'draw';
    }

    // 다음 턴을 위해 주사위 상태 완전 리셋
    GameUtils.RemoteManager.updateState({
      ...currentState,
      scores: newScores,
      turn: gameOver ? currentState.turn : nextTurn,
      rollsLeft: MAX_ROLLS,
      dice: [1, 1, 1, 1, 1],          // 주사위 초기화 (시각적 일관성)
      held: [false, false, false, false, false],
      lastAction: 'score',
      winner
    });
  }

  // ── UI 업데이트 ──────────────────────────────────────────
  function updateUI() {
    if (!myRole) return; // myRole 미설정 시 UI 건너뜀

    const myTurn = isMyTurn();
    const canRoll = myTurn && currentState.rollsLeft > 0 && !currentState.winner && currentState.status === 'playing';
    const rolledOnce = currentState.rollsLeft < MAX_ROLLS;

    rollsLeftEl.textContent = `${currentState.rollsLeft}회 남음`;
    btnRoll.disabled = !canRoll;
    btnRoll.textContent = myTurn
      ? (currentState.rollsLeft > 0 ? '🎲 주사위 굴리기' : '✅ 조합을 선택하세요')
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
    if (!myRole) return;

    const myTurn    = isMyTurn();
    const rolledOnce = currentState.rollsLeft < MAX_ROLLS; // 최소 1번 굴렸는지

    CATS.forEach(id => {
      [1, 2].forEach(idx => {
        const p    = idx === 1 ? 'p1' : 'p2';
        const cell = document.getElementById(`cell-${id}-${idx}`);
        if (!cell) return;

        const playerScores = currentState.scores[p] || {};
        const score = playerScores[id];

        if (score !== undefined) {
          // ── 이미 기록된 점수 ──
          cell.textContent = score;
          cell.className   = 'score-cell filled';
          cell.onclick     = null;

        } else if (p === myRole && myTurn && rolledOnce && !currentState.winner) {
          // ── 내 턴 + 굴리기 완료 + 미기록 칸 → 선택 가능 ──
          const pot = calculateScore(id, currentState.dice);
          cell.textContent = pot;
          cell.className   = pot > 0 ? 'score-cell available' : 'score-cell zero-available';
          // 클릭 시 pickCategory 호출 (catId 캡처)
          cell.onclick = ((catId) => () => pickCategory(catId))(id);

        } else {
          // ── 상대방 칸 또는 내 턴 아님 ──
          cell.textContent = '-';
          cell.className   = 'score-cell empty';
          cell.onclick     = null;
        }
      });
    });
  }

  // ── 주사위 DOM 빌드 ──────────────────────────────────────
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

  function animateDice(values) {
    for (let i = 0; i < 5; i++) {
      const cube  = document.getElementById(`cube-${i}`);
      const scene = document.getElementById(`scene-${i}`);
      const rot   = ROTATIONS[values[i]] || ROTATIONS[1];

      if (!currentState.held[i]) {
        // 홀드되지 않은 주사위: 누적 회전 +360° → 같은 눈값이어도 transform이 달라져 애니메이션 발생
        diceBaseRot[i].x += 360;
        diceBaseRot[i].y += 360;
      }

      const totalX = diceBaseRot[i].x + rot.x;
      const totalY = diceBaseRot[i].y + rot.y;
      cube.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
      cube.style.transform  = `rotateX(${totalX}deg) rotateY(${totalY}deg)`;
      scene.classList.toggle('held', currentState.held[i]);
    }
  }

  function updateDiceFaces(values) {
    for (let i = 0; i < 5; i++) {
      const cube  = document.getElementById(`cube-${i}`);
      const scene = document.getElementById(`scene-${i}`);
      const rot   = ROTATIONS[values[i]] || ROTATIONS[1];
      // 누적 기준값 + 눈 오프셋 그대로 유지 (애니메이션 없이 즉시 반영)
      const totalX = diceBaseRot[i].x + rot.x;
      const totalY = diceBaseRot[i].y + rot.y;
      cube.style.transition = 'none';
      cube.style.transform  = `rotateX(${totalX}deg) rotateY(${totalY}deg)`;
      scene.classList.toggle('held', currentState.held[i]);
    }
  }

  // ── 점수 계산 ─────────────────────────────────────────────
  function calculateScore(cat, d) {
    if (!d || d.length !== 5) return 0;
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
    if (!scores) return 0;
    return CATS.reduce((sum, c) => sum + (scores[c] || 0), 0);
  }

  // ── 결과 화면 ─────────────────────────────────────────────
  function showResult(state) {
    const overlay  = document.getElementById('overlay-result');
    const winnerEl = document.getElementById('winner-text');
    const scoresEl = document.getElementById('final-scores');
    if (!overlay) return;

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

  // ── 버튼 이벤트 ──────────────────────────────────────────
  btnRoll.onclick = rollDice;

  // ── 시작 ─────────────────────────────────────────────────
  init();
})();
