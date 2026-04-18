/**
 * online.js — 커플 야추 3D 원격 멀티플레이어 로직
 */
(function () {
  'use strict';

  // --- Firebase 초기화 ---
  firebase.initializeApp(window.FIREBASE_CONFIG);
  const db = firebase.database();

  // --- 게임 상태 및 상수 ---
  const GAME_ID = 'yahtzee';
  const MAX_ROLLS = 3;
  let roomId = null;
  let playerRole = null; // 'p1' (Host) or 'p2' (Guest)
  let isMyTurn = false;

  const ROTATIONS = {
    1: { x: 0, y: 0 }, 2: { x: 0, y: -90 }, 3: { x: 0, y: 90 },
    4: { x: -90, y: 0 }, 5: { x: 90, y: 0 }, 6: { x: 180, y: 0 }
  };

  let gameState = {
    dice: [1, 1, 1, 1, 1],
    held: [false, false, false, false, false],
    rollsLeft: MAX_ROLLS,
    turn: 1,
    scores: { p1: {}, p2: {} },
    lastAction: null, // 'roll', 'hold', 'score'
    winner: null
  };

  // --- DOM 요소 ---
  const roomOverlay = document.getElementById('overlay-room');
  const roomInitUI = document.getElementById('room-init-ui');
  const roomLobbyUI = document.getElementById('room-lobby-ui');
  const inputRoomId = document.getElementById('input-room-id');
  const displayRoomId = document.getElementById('display-room-id');
  
  const btnRoll = document.getElementById('btn-roll');
  const rollsLeftEl = document.getElementById('rolls-left');
  const turnIndicator = document.getElementById('turn-indicator');

  /* ───────────────────── 방 관리 (Room Management) ───────────────────── */

  document.getElementById('btn-create-room').addEventListener('click', createRoom);
  document.getElementById('btn-join-room').addEventListener('click', () => joinRoom(inputRoomId.value.trim()));
  document.getElementById('btn-cancel-room').addEventListener('click', cancelRoom);

  function createRoom() {
    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    roomId = newId;
    playerRole = 'p1';
    
    db.ref('rooms/' + roomId).set({
      status: 'waiting',
      gameState: gameState,
      players: { p1: true }
    }).then(() => {
      showLobby(newId);
      listenToRoom();
    });
  }

  function joinRoom(id) {
    if (!id) return alert('방 번호를 입력하세요.');
    db.ref('rooms/' + id).once('value', snapshot => {
      const data = snapshot.val();
      if (!data) return alert('존재하지 않는 방입니다.');
      if (data.status !== 'waiting') return alert('이미 시작된 방이거나 만원입니다.');

      roomId = id;
      playerRole = 'p2';
      
      db.ref('rooms/' + roomId).update({
        status: 'playing',
        'players/p2': true
      }).then(() => {
        roomOverlay.classList.add('hidden');
        listenToRoom();
      });
    });
  }

  function cancelRoom() {
    if (roomId) db.ref('rooms/' + roomId).remove();
    location.reload();
  }

  function showLobby(id) {
    roomInitUI.style.display = 'none';
    roomLobbyUI.style.display = 'flex';
    displayRoomId.textContent = id;
  }

  function listenToRoom() {
    db.ref('rooms/' + roomId).on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return;

      // 상대방 입장 시 (Host 전용)
      if (playerRole === 'p1' && data.status === 'playing' && roomOverlay.style.display !== 'none') {
        roomOverlay.classList.add('hidden');
      }

      // 게임 데이터 동기화
      syncGameState(data.gameState);
    });
  }

  /* ───────────────────── 게임 로직 (Game Sync) ───────────────────── */

  function syncGameState(newMsg) {
    if (!newMsg) return;
    
    const prevAction = gameState.lastAction;
    const prevDice = [...gameState.dice];
    gameState = newMsg;

    isMyTurn = (playerRole === 'p1' && gameState.turn === 1) || (playerRole === 'p2' && gameState.turn === 2);

    // 주사위 애니메이션 (상대방이 굴렸을 때)
    if (gameState.lastAction === 'roll' && JSON.stringify(prevDice) !== JSON.stringify(gameState.dice)) {
      animateDice(gameState.dice);
    } else {
      updateDiceFaces(gameState.dice);
    }

    updateUI();
  }

  function animateDice(values) {
    for (let i = 0; i < 5; i++) {
      const cube = document.getElementById(`cube-${i}`);
      const v = values[i];
      const rot = ROTATIONS[v];
      const spinX = 720 + rot.x; // 2바퀴 회전 후 안착
      const spinY = 720 + rot.y;
      cube.style.transition = 'transform 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
      cube.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
    }
  }

  function updateDiceFaces(values) {
    for (let i = 0; i < 5; i++) {
      const cube = document.getElementById(`cube-${i}`);
      const rot = ROTATIONS[values[i]];
      cube.style.transition = 'none';
      cube.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
      
      const scene = document.getElementById(`scene-${i}`);
      scene.classList.toggle('held', gameState.held[i]);
    }
  }

  function toggleHold(i) {
    if (!isMyTurn || gameState.rollsLeft === MAX_ROLLS) return;
    gameState.held[i] = !gameState.held[i];
    gameState.lastAction = 'hold';
    db.ref('rooms/' + roomId + '/gameState').set(gameState);
    GameUtils.vibrate(10);
  }

  function rollDice() {
    if (!isMyTurn || gameState.rollsLeft <= 0) return;

    gameState.rollsLeft--;
    for (let i = 0; i < 5; i++) {
        if (!gameState.held[i]) {
            gameState.dice[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
    gameState.lastAction = 'roll';
    db.ref('rooms/' + roomId + '/gameState').set(gameState);
    GameUtils.vibrate(30);
  }

  function pickCategory(catId) {
    if (!isMyTurn || gameState.rollsLeft === MAX_ROLLS || gameState.scores[playerRole][catId] !== undefined) return;

    const score = calculateScore(catId, gameState.dice);
    gameState.scores[playerRole][catId] = score;
    
    // 턴 전환
    gameState.turn = gameState.turn === 1 ? 2 : 1;
    gameState.rollsLeft = MAX_ROLLS;
    gameState.held = [false, false, false, false, false];
    gameState.lastAction = 'score';

    db.ref('rooms/' + roomId + '/gameState').set(gameState);
  }

  function updateUI() {
    rollsLeftEl.textContent = `${gameState.rollsLeft}회 남음`;
    btnRoll.disabled = !isMyTurn || gameState.rollsLeft <= 0;
    btnRoll.textContent = isMyTurn ? (gameState.rollsLeft > 0 ? '🎲 주사위 굴리기' : '조합을 선택하세요') : '상대방 턴 대기 중...';

    turnIndicator.textContent = isMyTurn ? '✨ 나의 차례!' : '💤 상대방의 차례';
    turnIndicator.className = `turn-indicator ${isMyTurn ? 'active' : ''}`;

    // 점수 업데이트 로직 (생략... buildScoreTable 호출 등)
    updateScoreTable();
  }

  // --- 기존 도구 함수들 (calculateScore 등 동일하게 유지) ---
  function calculateScore(cat, d) {
    const counts = [0,0,0,0,0,0,0]; d.forEach(v => counts[v]++);
    const sumAll = d.reduce((a,b)=>a+b, 0);
    switch(cat) {
      case 'ones': return d.filter(v=>v===1).length * 1;
      case 'twos': return d.filter(v=>v===2).length * 2;
      case 'threes': return d.filter(v=>v===3).length * 3;
      case 'fours': return d.filter(v=>v===4).length * 4;
      case 'fives': return d.filter(v=>v===5).length * 5;
      case 'sixes': return d.filter(v=>v===6).length * 6;
      case 'threeKind': return counts.some(c=>c>=3) ? sumAll : 0;
      case 'fourKind': return counts.some(c=>c>=4) ? sumAll : 0;
      case 'fullHouse': const v=counts.filter(c=>c>0); return (v.includes(3)&&v.includes(2)) ? 25 : 0;
      case 'smStr': const s=[...new Set(d)].sort().join(''); return /1234|2345|3456/.test(s) ? 30 : 0;
      case 'lgStr': const l=[...new Set(d)].sort().join(''); return /12345|23456/.test(l) ? 40 : 0;
      case 'yahtzee': return counts.some(c=>c===5) ? 50 : 0;
      case 'chance': return sumAll;
      default: return 0;
    }
  }

  // UI 생성 및 동화
  function updateScoreTable() {
    // CATEGORIES 순회하며 cell-id-pX 텍스트 업데이트
    const players = ['p1', 'p2'];
    const cats = ['ones','twos','threes','fours','fives','sixes','threeKind','fourKind','fullHouse','smStr','lgStr','yahtzee','chance'];
    
    cats.forEach(id => {
      players.forEach((p, idx) => {
          const cell = document.getElementById(`cell-${id}-${idx+1}`);
          if (!cell) return;
          const score = gameState.scores[p][id];
          if (score !== undefined) {
              cell.textContent = score;
              cell.className = 'score-cell filled';
              cell.onclick = null;
          } else if (p === playerRole && isMyTurn && gameState.rollsLeft < MAX_ROLLS) {
              const pot = calculateScore(id, gameState.dice);
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
    // 합계 계산 등은 index.js와 유사하게 처리
  }

  // 초기화 호출
  (function init() {
    const row = document.getElementById('dice-row');
    row.innerHTML = '';
    for(let i=0; i<5; i++) {
      row.innerHTML += `<div class="die-scene" id="scene-${i}"><div class="die-cube" id="cube-${i}">
        <div class="die-face front face-1"><div class="dot"></div></div>
        <div class="die-face right face-2"><div class="dot"></div><div class="dot"></div></div>
        <div class="die-face left face-3"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div class="die-face top face-4"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div class="die-face bottom face-5"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        <div class="die-face back face-6"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
      </div></div>`;
    }
    for(let i=0; i<5; i++) {
        document.getElementById(`scene-${i}`).onclick = () => toggleHold(i);
    }
    
    // 스코어 테이블 뼈대 생성 (CATEGORIES 기반)
    // ... 생략 (HTML에 이미 뼈대가 있거나 JS로 생성)
    btnRoll.onclick = rollDice;
    
    // 테마 연동
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) themeBtn.onclick = () => GameUtils.nextTheme();
  })();

})();
