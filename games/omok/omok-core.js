/**
 * OmokCore v1.0
 * Engine for Gomoku (오목) - Canvas based, neon styling.
 */

const BOARD_SIZE = 15;
const COLORS = {
  bg: 'transparent',
  grid: 'rgba(255,255,255,0.15)',
  p1: { fill: '#f472b6', glow: 'rgba(244,114,182,0.6)' }, // Pink (Host / P1)
  p2: { fill: '#a78bfa', glow: 'rgba(167,139,250,0.6)' }, // Purple (Guest / P2)
  p1Shadow: 'rgba(244,114,182,1)',
  p2Shadow: 'rgba(167,139,250,1)',
};

class OmokGame {
  constructor(canvasId, opts = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Callbacks
    this.onTurnChange = opts.onTurnChange || null;
    this.onWin = opts.onWin || null;
    this.onUpdate = opts.onUpdate || null; // For syncing online
    this.readOnly = opts.readOnly || false;
    
    // Game State
    this.board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)); // 0: empty, 1: p1, 2: p2
    this.currentTurn = 1; // 1 (p1), 2 (p2)
    this.winner = 0;
    this.gameOver = false;
    
    // Canvas sizing padding
    this.padding = 15;
    this.cellSize = 0;

    // Last moved piece (to highlight)
    this.lastMove = null;

    // Events
    if (!this.readOnly) {
      this.handleInput = this.handleInput.bind(this);
      this.canvas.addEventListener('click', this.handleInput);
      this.canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate scale factors
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const px = (touch.clientX - rect.left) * scaleX;
        const py = (touch.clientY - rect.top) * scaleY;
        
        this.processInput(px, py);
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
    }

    this.resizeCanvas();
  }

  destroy() {
    if (this.handleInput) {
      this.canvas.removeEventListener('click', this.handleInput);
    }
  }

  resizeCanvas() {
    this.cellSize = (this.canvas.width - this.padding * 2) / (BOARD_SIZE - 1);
    this.draw();
  }

  handleInput(e) {
    if (this.readOnly || this.gameOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    
    // Scale correctly in case CSS width doesn't match canvas native width
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    this.processInput(px * scaleX, py * scaleY);
  }

  processInput(px, py) {
    if (this.readOnly || this.gameOver) return;

    // Convert pixel to grid coordinates (with snapping)
    const col = Math.round((px - this.padding) / this.cellSize);
    const row = Math.round((py - this.padding) / this.cellSize);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      this.makeMove(row, col);
    }
  }

  makeMove(r, c) {
    if (this.board[r][c] !== 0 || this.gameOver) return;

    this.board[r][c] = this.currentTurn;
    this.lastMove = { r, c };
    
    if (this.checkWin(r, c, this.currentTurn)) {
      this.winner = this.currentTurn;
      this.gameOver = true;
      this.draw();
      if (this.onWin) this.onWin(this.winner);
      if (this.onUpdate) this.onUpdate(this);
      return;
    }

    // Switch turn
    this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    this.draw();
    
    if (this.onTurnChange) this.onTurnChange(this.currentTurn);
    if (this.onUpdate) this.onUpdate(this); // Sync after move
  }

  checkWin(r, c, player) {
    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal \
      [1, -1]  // Diagonal /
    ];

    for (let [dr, dc] of directions) {
      let count = 1;

      // Count forward
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && this.board[nr][nc] === player) {
        count++;
        nr += dr;
        nc += dc;
      }

      // Count backward
      nr = r - dr;
      nc = c - dc;
      while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && this.board[nr][nc] === player) {
        count++;
        nr -= dr;
        nc -= dc;
      }

      if (count >= 5) return true; // Standard Free Gomoku (5 or more) runs as win
    }
    return false;
  }

  // Load state from remote
  loadState(state) {
    if (!state) return;
    if (state.board) this.board = state.board;
    if (state.currentTurn !== undefined) this.currentTurn = state.currentTurn;
    if (state.winner !== undefined) this.winner = state.winner;
    if (state.gameOver !== undefined) this.gameOver = state.gameOver;
    if (state.lastMove) this.lastMove = state.lastMove;
    this.draw();
  }

  /* ─────────────────────────
     RENDERING
     ───────────────────────── */
  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Context options
    this.ctx.lineCap = 'round';
    
    // 1. Draw Grid
    this.ctx.strokeStyle = COLORS.grid;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let i = 0; i < BOARD_SIZE; i++) {
      const pos = this.padding + i * this.cellSize;
      // Horizontal
      this.ctx.moveTo(this.padding, pos);
      this.ctx.lineTo(w - this.padding, pos);
      // Vertical
      this.ctx.moveTo(pos, this.padding);
      this.ctx.lineTo(pos, h - this.padding);
    }
    this.ctx.stroke();

    // Small dots at intersections (Tengen + 4 sides) for 15x15 board (usually at 3,3 / 11,11 etc)
    const dots = [
      [3, 3], [3, 11], [11, 3], [11, 11], [7, 7]
    ];
    this.ctx.fillStyle = COLORS.grid;
    for (const [dr, dc] of dots) {
      const cx = this.padding + dc * this.cellSize;
      const cy = this.padding + dr * this.cellSize;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Draw Stones
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.board[r][c] !== 0) {
          const val = this.board[r][c];
          this.drawStone(r, c, val);
        }
      }
    }
  }

  drawStone(r, c, player) {
    const cx = this.padding + c * this.cellSize;
    const cy = this.padding + r * this.cellSize;
    const isP1 = player === 1;
    const radius = this.cellSize * 0.42;
    const colorOpts = isP1 ? COLORS.p1 : COLORS.p2;

    this.ctx.save();
    
    // Core color
    this.ctx.fillStyle = colorOpts.fill;
    
    // Glow effect
    this.ctx.shadowColor = isP1 ? COLORS.p1Shadow : COLORS.p2Shadow;
    this.ctx.shadowBlur = 12;
    
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Outline to pop
    this.ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 0; // Turn off shadow just for thin outline
    this.ctx.stroke();

    // Highlight last move with an inner dot or ring
    if (this.lastMove && this.lastMove.r === r && this.lastMove.c === c) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fill();
      
      // Also add a little ripple ring
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
      this.ctx.strokeStyle = colorOpts.fill;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }
}
