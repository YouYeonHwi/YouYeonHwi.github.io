/**
 * online.js - Tetris Multiplayer Logic
 */

(() => {
  'use strict';

  const GAME_ID = 'tetris';
  let myRole = null;
  let game = null;
  let opponentCanvas, oppCtx;
  let opponentScale = 5; // Fixed small scale for preview

  // Core Sync state
  let currentState = {
    status: 'lobby',
    p1Grid: null,
    p2Grid: null,
    p1Score: 0,
    p2Score: 0,
    attackForP1: 0,
    attackForP2: 0,
    gameOver: false
  };

  function init() {
    opponentCanvas = document.getElementById('opp-canvas');
    oppCtx = opponentCanvas.getContext('2d');
    
    // Initialize Remote Manager
    GameUtils.RemoteManager.init(GAME_ID, onSync);
    GameUtils.RemoteManager.openLobby(GAME_ID, currentState, startGame);
  }

  function startGame() {
    myRole = GameUtils.RemoteManager.getRole();
    document.getElementById('my-name').textContent = myRole === 'p1' ? '나 (Host)' : '나 (Guest)';
    document.getElementById('opp-name').textContent = myRole === 'p1' ? '상대 (Guest)' : '상대 (Host)';

    // Start local game engine
    const onAttack = (count) => {
      const target = myRole === 'p1' ? 'attackForP2' : 'attackForP1';
      GameUtils.RemoteManager.updateField(target, (GameUtils.RemoteManager.getRoomState()[target] || 0) + count);
    };

    const onGameOver = () => {
      GameUtils.RemoteManager.updateField('gameOver', true);
      showResult('GAME OVER', '상대방이 승리했습니다.');
    };

    const onUpdate = () => {
      // Sync my grid to remote
      const gridKey = myRole === 'p1' ? 'p1Grid' : 'p2Grid';
      const scoreKey = myRole === 'p1' ? 'p1Score' : 'p2Score';
      
      // Minimal grid data (just numbers)
      const compactGrid = game.grid.map(row => row.join('')).join('|');
      GameUtils.RemoteManager.updateField(gridKey, compactGrid);
      GameUtils.RemoteManager.updateField(scoreKey, game.score);
    };

    game = new TetrisGame('my-canvas', 'my-attack-notif', onAttack, onGameOver, onUpdate);
    game.update();
    
    // Bind controls
    bindControls(game, document.getElementById('body-wrap'));
    
    // Initial sync
    onUpdate();
  }

  function onSync(state, role) {
    if (!state) return;
    const oldState = currentState;
    currentState = state;

    // 1. Update Scores
    document.getElementById('my-score').textContent = (role === 'p1' ? state.p1Score : state.p2Score) || 0;
    document.getElementById('opp-score').textContent = (role === 'p1' ? state.p2Score : state.p1Score) || 0;

    // 2. Render Opponent Preview
    const oppGridStr = role === 'p1' ? state.p2Grid : state.p1Grid;
    if (oppGridStr) {
      renderOpponent(oppGridStr);
    }

    // 3. Handle Attacks (Garbage)
    const myAttackKey = role === 'p1' ? 'attackForP1' : 'attackForP2';
    if (state[myAttackKey] > (oldState[myAttackKey] || 0)) {
      const lines = state[myAttackKey] - (oldState[myAttackKey] || 0);
      if (game && !game.gameOver) {
        game.addGarbage(lines);
        showAlert(`공격 받음! +${lines}줄`);
      }
    }

    // 4. Handle Game Over
    if (state.gameOver && !game.gameOver) {
       // Check who lost
       // If I am still playing, I won!
       showResult('VICTORY!', '상대방이 먼저 탈락했습니다.');
       game.gameOver = true;
    }
  }

  function renderOpponent(gridStr) {
    const rows = gridStr.split('|');
    const grid = rows.map(r => r.split('').map(Number));
    
    const scale = opponentCanvas.width / COLS;
    opponentCanvas.height = ROWS * scale;
    oppCtx.clearRect(0, 0, opponentCanvas.width, opponentCanvas.height);
    
    grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          oppCtx.fillStyle = value === 8 ? '#444' : COLORS[value];
          oppCtx.fillRect(x * scale, y * scale, scale, scale);
          oppCtx.strokeStyle = 'rgba(255,255,255,0.1)';
          oppCtx.strokeRect(x * scale, y * scale, scale, scale);
        }
      });
    });
  }

  function showAlert(msg) {
    const el = document.getElementById('attack-alert');
    el.textContent = msg;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.opacity = '1';
    el.style.animation = 'alert-pop 1.5s forwards';
    
    const wrap = document.getElementById('body-wrap');
    wrap.classList.add('receiving-attack');
    setTimeout(() => wrap.classList.remove('receiving-attack'), 500);
  }

  function showResult(title, msg) {
    const overlay = document.getElementById('overlay-result');
    overlay.classList.remove('hidden');
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-stats').textContent = msg;
  }

  function bindControls(game, area) {
    let touchX, touchY, lastX;
    const moveLimit = 25;

    area.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      lastX = 0;
    });

    area.addEventListener('touchmove', e => {
      e.preventDefault();
      const dx = e.touches[0].clientX - touchX;
      const dy = e.touches[0].clientY - touchY;

      const step = Math.floor(dx / moveLimit);
      if (step !== lastX) {
        const dir = step > lastX ? 1 : -1;
        game.piece.pos.x += dir;
        if (game.collide()) game.piece.pos.x -= dir;
        lastX = step;
      }

      if (dy > moveLimit * 1.5) {
        game.drop();
        touchY = e.touches[0].clientY;
      }
    }, { passive: false });

    area.addEventListener('touchend', e => {
      const dy = e.changedTouches[0].clientY - touchY;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
        game.rotate(1);
        GameUtils.vibrate(10);
      }
    });

    document.addEventListener('keydown', e => {
      if (game.gameOver) return;
      if (e.key === 'ArrowLeft') { game.piece.pos.x--; if(game.collide()) game.piece.pos.x++; }
      if (e.key === 'ArrowRight') { game.piece.pos.x++; if(game.collide()) game.piece.pos.x--; }
      if (e.key === 'ArrowDown') { game.drop(); }
      if (e.key === 'ArrowUp') { game.rotate(1); }
      if (e.code === 'Space') { 
        while(!game.collide()) game.piece.pos.y++;
        game.piece.pos.y--;
        game.merge(); game.spawnPiece(); game.sweep();
        if (typeof GameUtils !== 'undefined') GameUtils.vibrate(15);
      }
    });
  }

  // CSS for alert
  const style = document.createElement('style');
  style.textContent = `
    @keyframes alert-pop {
      0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
      20% { transform: translate(-50%, -20px) scale(1.1); opacity: 1; }
      80% { transform: translate(-50%, -20px) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -40px) scale(0.9); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  init();

})();
