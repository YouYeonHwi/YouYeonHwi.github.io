(() => {
  'use strict';

  const GAME_ID = 'ping-pong';
  const WIN_SCORE = 5;
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const netStatus = document.getElementById('network-status');

  let myRole = null;
  let W, H;
  let currentState = {
    status: 'lobby',
    p1Score: 0,
    p2Score: 0,
    ball: { x: 0, y: 0, vx: 3, vy: 4 },
    p1X: 0,
    p2X: 0
  };

  const PADDLE_W = 80;
  const PADDLE_H = 12;
  const BALL_R = 8;
  
  let myX = 0;
  let running = false;
  let lastSyncTime = 0;

  function init() {
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, () => {
      // 3-2-1 카운트다운 후 실행
      myRole = GameUtils.RemoteManager.getRole();
      
      resize();
      myX = W / 2 - PADDLE_W / 2;
      currentState.p1X = W / 2 - PADDLE_W / 2;
      currentState.p2X = W / 2 - PADDLE_W / 2;
      running = true;

      // 동기화 리스너 시작
      GameUtils.RemoteManager.init(GAME_ID, onSync);

      if (myRole === 'p1') {
        resetBall();
        syncState(); // 초기 상태 동기화
        gameLoop();
      } else {
        renderLoop();
      }
      // 네트워크 연결 완료 표시
      netStatus.textContent = `연결됨 (${myRole === 'p1' ? 'Host' : 'Guest'})`;
      setTimeout(() => { netStatus.style.opacity = '0'; }, 2000);
    });
  }

  function resetBall() {
    currentState.ball = {
      x: W / 2, y: H / 2,
      vx: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2),
      vy: (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 2)
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    W = rect.width;
    H = rect.height;
  }

  // ── Firebase null 안전 래퍼 ───────────────────────────────
  function safeState(raw) {
    if (!raw) return null;
    return {
      status: raw.status || 'lobby',
      p1Score: raw.p1Score || 0,
      p2Score: raw.p2Score || 0,
      ball: raw.ball || { x: W/2, y: H/2, vx: 0, vy: 0 },
      p1X: raw.p1X || 0,
      p2X: raw.p2X || 0
    };
  }

  function onSync(rawState, role) {
    const state = safeState(rawState);
    if (!state) return;
    myRole = role;

    if (myRole === 'p1') {
      // Host: 상대방 패들 위치와 점수만 반영 (공은 본인이 계산)
      currentState.p2X = state.p2X;
      currentState.p1Score = state.p1Score;
      currentState.p2Score = state.p2Score;
      if (state.status === 'ended') currentState.status = 'ended';
    } else {
      // Guest: 전체 상태를 Host에서 받되, 내 패들(p2X)은 로컬값 유지
      const savedMyX = myX;
      currentState = state;
      myX = savedMyX; // 로컬 패들 위치 보호
    }

    if (currentState.status === 'ended' && running) {
      running = false;
      showResult();
    }
  }

  // Host용 게임 로직 루프
  function gameLoop() {
    if (!running) return;

    updatePhysics();
    
    // 실시간 동기화 (최대 30Hz)
    const now = Date.now();
    if (now - lastSyncTime > 33) {
      syncState();
      lastSyncTime = now;
    }

    draw();
    requestAnimationFrame(gameLoop);
  }

  // Guest용 렌더링 루프 (Host의 상태를 받아서 그리기만 함)
  function renderLoop() {
    if (!running) return;
    
    // 내 패들 위치만 서버로 전송 (gameState 전체 덮어쓰기 금지!)
    const now = Date.now();
    if (now - lastSyncTime > 40) {
      GameUtils.RemoteManager.updateField('p2X', myX);
      lastSyncTime = now;
    }

    draw();
    requestAnimationFrame(renderLoop);
  }

  function updatePhysics() {
    if (myRole !== 'p1') return;

    const b = currentState.ball;
    b.x += b.vx;
    b.y += b.vy;

    // 벽 충돌
    if (b.x - BALL_R <= 0 || b.x + BALL_R >= W) {
      b.vx *= -1;
      b.x = Math.max(BALL_R, Math.min(W - BALL_R, b.x));
    }

    // 패들 충돌 - P1 (상단)
    if (b.vy < 0 && b.y - BALL_R <= 10 + PADDLE_H && b.y - BALL_R >= 10) {
      if (b.x >= currentState.p1X && b.x <= currentState.p1X + PADDLE_W) {
        b.vy = Math.abs(b.vy) * 1.05;
        b.vx += (b.x - (currentState.p1X + PADDLE_W / 2)) * 0.1;
      }
    }
    // 패들 충돌 - P2 (하단)
    const p2Y = H - 10 - PADDLE_H;
    if (b.vy > 0 && b.y + BALL_R >= p2Y && b.y + BALL_R <= p2Y + PADDLE_H) {
      if (b.x >= currentState.p2X && b.x <= currentState.p2X + PADDLE_W) {
        b.vy = -Math.abs(b.vy) * 1.05;
        b.vx += (b.x - (currentState.p2X + PADDLE_W / 2)) * 0.1;
      }
    }

    // 득점
    if (b.y < 0) {
      currentState.p2Score++;
      if (currentState.p2Score >= WIN_SCORE) currentState.status = 'ended';
      else resetBall();
    } else if (b.y > H) {
      currentState.p1Score++;
      if (currentState.p1Score >= WIN_SCORE) currentState.status = 'ended';
      else resetBall();
    }
    
    currentState.p1X = myX; // 내 위치 업데이트
  }

  function syncState() {
    GameUtils.RemoteManager.updateState(currentState);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 센터 라인
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(0, H/2); ctx.lineTo(W, H/2);
    ctx.stroke();

    // 점수
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = '900 4rem Outfit';
    ctx.textAlign = 'center';
    ctx.fillText(currentState.p1Score, W/2, H/2 - 20);
    ctx.fillText(currentState.p2Score, W/2, H/2 + 60);

    // 패들
    ctx.fillStyle = '#f472b6'; // P1
    ctx.fillRect(currentState.p1X, 10, PADDLE_W, PADDLE_H);
    ctx.fillStyle = '#a78bfa'; // P2
    ctx.fillRect(currentState.p2X, H - 10 - PADDLE_H, PADDLE_W, PADDLE_H);

    // 공
    ctx.beginPath();
    ctx.arc(currentState.ball.x, currentState.ball.y, BALL_R, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  // 터치 핸들링
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    myX = (t.clientX - rect.left) - PADDLE_W / 2;
    myX = Math.max(0, Math.min(W - PADDLE_W, myX));
  }, { passive: false });

  function showResult() {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('res-title');
    const detail = document.getElementById('res-detail');

    const s1 = currentState.p1Score;
    const s2 = currentState.p2Score;
    const winner = s1 > s2 ? 1 : 2;
    const iAmWinner = (myRole === 'p1' && winner === 1) || (myRole === 'p2' && winner === 2);

    title.textContent = iAmWinner ? '🎉 승리!' : '💀 패배...';
    detail.textContent = `최종 점수 - 나: ${myRole === 'p1' ? s1 : s2} | 상대: ${myRole=== 'p1' ? s2 : s1}`;
    overlay.classList.remove('hidden');

    if (iAmWinner && !window.scoreSaved) {
        const globalScores = GameUtils.getScores(GAME_ID);
        if (myRole === 'p1') globalScores.p1++; else globalScores.p2++;
        GameUtils.saveScores(GAME_ID, globalScores);
        window.scoreSaved = true;
    }
  }

  // 도움말 버튼 제어
  const btnShowHelp = document.getElementById('btn-show-help');
  const overlayHelp = document.getElementById('overlay-help');

  if (btnShowHelp) {
    btnShowHelp.onclick = () => overlayHelp.classList.toggle('hidden');
  }

  init();
})();
