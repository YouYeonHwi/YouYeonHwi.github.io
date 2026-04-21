/**
 * TetrisCore v2.0 — Polished game engine shared by Solo and Online modes.
 *
 * Enhancements:
 * - Larger block scale + gradient/glow rendering
 * - Next-piece queue (3 pieces preview)
 * - Hold piece system
 * - Line-clear flash animation
 * - Level-up speed system
 * - SRS-like wall kick for rotation
 * - Proper piece bag randomizer (7-bag)
 */

const COLS = 10;
const ROWS = 20;

/* ─── Vibrant with gradient rendering ─── */
const PIECE_COLORS = [
  null,
  { fill: '#FF4757', glow: '#ff0019' }, // Z — Red
  { fill: '#2ed573', glow: '#0acc56' }, // S — Green
  { fill: '#1e90ff', glow: '#006de0' }, // J — Blue
  { fill: '#ffa502', glow: '#e08700' }, // L — Orange
  { fill: '#00d2d3', glow: '#00aaab' }, // I — Cyan
  { fill: '#eccc68', glow: '#d4a900' }, // O — Yellow
  { fill: '#a29bfe', glow: '#7c6fe4' }, // T — Purple
  { fill: '#444', glow: '#222' }        // Garbage — Grey
];

/* ─── All shapes in spawn orientation ─── */
const SHAPES = [
  null,
  [[1,1,0],[0,1,1],[0,0,0]], // Z
  [[0,2,2],[2,2,0],[0,0,0]], // S
  [[3,0,0],[3,3,3],[0,0,0]], // J
  [[0,0,4],[4,4,4],[0,0,0]], // L
  [[0,0,0,0],[5,5,5,5],[0,0,0,0],[0,0,0,0]], // I
  [[6,6],[6,6]],             // O
  [[0,7,0],[7,7,7],[0,0,0]]  // T
];

/* ─── SRS Wall-kick data (J,L,S,T,Z) ─── */
const KICKS = {
  normal: [
    [0,0],[-1,0],[2,0],[-1,-2],[2,1]
  ],
  I: [
    [0,0],[-2,0],[1,0],[-2,1],[1,-2]
  ]
};

/* ─── 7-bag random bag generator ─── */
class PieceBag {
  constructor() { this.bag = []; }
  next() {
    if (!this.bag.length) {
      this.bag = [1,2,3,4,5,6,7];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop();
  }
}

/* ─────────────────────────────────────────
   TetrisGame class (core engine)
   ───────────────────────────────────────── */
class TetrisGame {
  constructor(canvasId, opts = {}) {
    this.canvas  = document.getElementById(canvasId);
    this.ctx     = this.canvas?.getContext('2d');
    this.opts    = {
      onAttack:  opts.onAttack  || null,
      onGameOver:opts.onGameOver|| null,
      onUpdate:  opts.onUpdate  || null,  // for online sync
      onLineClear: opts.onLineClear || null,
    };

    // State
    this.grid        = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    this.bag         = new PieceBag();
    this.queue       = [this.bag.next(), this.bag.next(), this.bag.next()];
    this.held        = null;
    this.holdUsed    = false;
    this.piece       = null;
    this.score       = 0;
    this.lines       = 0;
    this.level       = 1;
    this.combo       = 0;
    this.gameOver    = false;
    this.stopped     = false;

    // Timing
    this.dropCounter  = 0;
    this.lastTime     = 0;
    this.rafId        = null;

    // Visual
    this.flashRows    = [];
    this.flashTimer   = 0;

    if (this.canvas) this.resize();
    this.spawnPiece();
  }

  /* ─── Sizing ─── */
  resize() {
    const parent = this.canvas.parentElement;
    const maxW   = parent.clientWidth  || 280;
    const maxH   = parent.clientHeight || 560;
    this.scale   = Math.floor(Math.min(maxW / COLS, maxH / ROWS));
    this.canvas.width  = COLS * this.scale;
    this.canvas.height = ROWS * this.scale;
  }

  get dropInterval() {
    // Level-based gravity: Speed boosted by 1.3x as requested
    const baseInterval = 1000 - (this.level - 1) * 100;
    return Math.max(60, Math.floor(baseInterval / 1.3));
  }

  /* ─── Piece Management ─── */
  spawnPiece() {
    const type = this.queue.shift();
    this.queue.push(this.bag.next());
    this.piece = {
      type,
      shape: JSON.parse(JSON.stringify(SHAPES[type])),
      rotation: 0,
      pos: { x: type === 5 ? 3 : 4 - Math.floor(SHAPES[type][0].length / 2), y: 0 }
    };
    this.holdUsed = false;

    if (this.collide()) {
      this.gameOver = true;
    }
    if (this.opts.onUpdate) this.opts.onUpdate(this);
  }

  holdPiece() {
    if (this.holdUsed) return;
    const currentType = this.piece.type;
    if (this.held !== null) {
      this.piece = {
        type: this.held,
        shape: JSON.parse(JSON.stringify(SHAPES[this.held])),
        rotation: 0,
        pos: { x: this.held === 5 ? 3 : 4 - Math.floor(SHAPES[this.held][0].length / 2), y: 0 }
      };
    } else {
      this.spawnPiece();
    }
    this.held    = currentType;
    this.holdUsed = true;
    if (this.opts.onUpdate) this.opts.onUpdate(this);
  }

  /* ─── Collision ─── */
  collide(pos, shp) {
    const s = shp || this.piece.shape;
    const p = pos  || this.piece.pos;
    for (let y = 0; y < s.length; y++) {
      for (let x = 0; x < s[y].length; x++) {
        if (s[y][x] !== 0) {
          const nx = x + p.x, ny = y + p.y;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && this.grid[ny][nx] !== 0) return true;
        }
      }
    }
    return false;
  }

  /* ─── Merge ─── */
  merge() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          const ny = y + this.piece.pos.y;
          if (ny >= 0) this.grid[ny][x + this.piece.pos.x] = v;
        }
      });
    });
  }

  /* ─── Rotation (SRS) ─── */
  rotate(dir) {
    const original = JSON.parse(JSON.stringify(this.piece.shape));
    const m = this.piece.shape;
    // Transpose
    for (let y = 0; y < m.length; y++) for (let x = 0; x < y; x++) [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
    if (dir > 0) m.forEach(r => r.reverse());
    else         m.reverse();

    // Wall kicks
    const kickSet = this.piece.type === 5 ? KICKS.I : KICKS.normal;
    for (const [kx, ky] of kickSet) {
      const testPos = { x: this.piece.pos.x + kx, y: this.piece.pos.y + ky };
      if (!this.collide(testPos)) {
        this.piece.pos = testPos;
        if (this.opts.onUpdate) this.opts.onUpdate(this);
        return;
      }
    }
    // Revert if no kick worked
    this.piece.shape = original;
  }

  /* ─── Drop ─── */
  drop(soft = false) {
    this.piece.pos.y++;
    if (this.collide()) {
      this.piece.pos.y--;
      this.merge();
      this.clearLines();
      this.spawnPiece();
      if (this.gameOver && this.opts.onGameOver) this.opts.onGameOver();
    } else {
      if (this.opts.onUpdate && !soft) this.opts.onUpdate(this);
    }
    this.dropCounter = 0;
  }

  hardDrop() {
    let dropped = 0;
    while (!this.collide()) { this.piece.pos.y++; dropped++; }
    this.piece.pos.y--;
    this.score += dropped * 2; // Hard drop bonus
    this.merge();
    this.clearLines();
    this.spawnPiece();
    if (typeof GameUtils !== 'undefined') GameUtils.vibrate(15);
    if (this.gameOver && this.opts.onGameOver) this.opts.onGameOver();
  }

  moveX(dir) {
    this.piece.pos.x += dir;
    if (this.collide()) { this.piece.pos.x -= dir; return; }
    if (this.opts.onUpdate) this.opts.onUpdate(this);
  }

  /* ─── Line clear ─── */
  clearLines() {
    const cleared = [];
    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.grid[y].every(v => v !== 0)) cleared.push(y);
    }
    if (!cleared.length) { this.combo = 0; return; }

    // Flash effect data
    this.flashRows = [...cleared]; // Copy for rendering
    this.flashTimer = 200;

    // Remove rows simultaneously from top to bottom (in-place)
    // We iterate exactly like classic Tetris to prevent skipping shifted rows.
    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.grid[y].every(v => v !== 0)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
        y++; // Check this same index again since the rows above shifted down into it
      }
    }

    const n = cleared.length;
    this.lines += n;
    this.level  = Math.floor(this.lines / 10) + 1;
    this.combo++;

    const base   = [0, 100, 300, 500, 800][n] || 800;
    const comboBonus = Math.max(0, (this.combo - 1) * 50);
    this.score  += (base + comboBonus) * this.level;

    // Attack
    if (this.opts.onAttack) {
      const atk = n === 1 ? 0 : n === 2 ? 1 : n === 3 ? 2 : 4;
      if (atk > 0) this.opts.onAttack(atk);
    }
    if (this.opts.onLineClear) this.opts.onLineClear(n, this.combo);
    if (typeof GameUtils !== 'undefined') GameUtils.vibrate(n >= 4 ? 60 : 30);
    if (this.opts.onUpdate) this.opts.onUpdate(this);
  }

  /* ─── Garbage ─── */
  addGarbage(count) {
    for (let i = 0; i < count; i++) {
      const hole = Math.floor(Math.random() * COLS);
      this.grid.shift();
      const row = Array(COLS).fill(8); row[hole] = 0;
      this.grid.push(row);
    }
    if (this.collide()) {
      // Push piece up if possible
      this.piece.pos.y = Math.max(0, this.piece.pos.y - count);
    }
    if (typeof GameUtils !== 'undefined') GameUtils.vibrate([20, 10, 20]);
    if (this.opts.onUpdate) this.opts.onUpdate(this);
  }

  /* ─── Ghost position ─── */
  ghostPos() {
    const gp = { x: this.piece.pos.x, y: this.piece.pos.y };
    while (!this.collide(gp)) gp.y++;
    gp.y--;
    return gp;
  }

  /* ─── Grid snapshot (for sync) ─── */
  gridSnapshot() {
    // Compact: join each row to a single string of hex digits
    return this.grid.map(r => r.join('')).join('|');
  }

  /* ─── Main loop ─── */
  start() {
    this.rafId = requestAnimationFrame(t => this._loop(t));
  }

  _loop(time) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (!this.stopped && !this.gameOver) {
      this.dropCounter += delta;
      if (this.dropCounter >= this.dropInterval) {
        this.drop(true);
      }
    }

    this.draw(delta);
    if (!this.gameOver) {
      this.rafId = requestAnimationFrame(t => this._loop(t));
    } else {
      if (this.opts.onGameOver) this.opts.onGameOver();
    }
  }

  stop()   { this.stopped = true; }
  resume() { this.stopped = false; }
  destroy(){ if (this.rafId) cancelAnimationFrame(this.rafId); }

  /* ═══════════ RENDERING ═══════════ */
  draw(delta = 0) {
    if (!this.ctx) return;
    const { ctx, canvas, scale } = this;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c*scale,0); ctx.lineTo(c*scale,canvas.height); ctx.stroke(); }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0,r*scale); ctx.lineTo(canvas.width,r*scale); ctx.stroke(); }

    // Flash animation tick
    if (this.flashTimer > 0) this.flashTimer -= delta;

    // Draw grid
    this.grid.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v !== 0) {
          this._drawBlock(ctx, x, y, scale, v, 1);
        }
      });
    });

    // Draw flash overlay independently at the original cleared positions
    if (this.flashTimer > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(this.flashTimer / 200) * 0.8})`;
      this.flashRows.forEach(y => {
        ctx.fillRect(0, y * scale, canvas.width, scale);
      });
    }

    // Ghost
    if (this.piece) {
      const gp = this.ghostPos();
      if (gp.y !== this.piece.pos.y) {
        this.piece.shape.forEach((row, y) => {
          row.forEach((v, x) => {
            if (v !== 0) this._drawGhostBlock(ctx, x + gp.x, y + gp.y, scale, v);
          });
        });
      }

      // Current piece
      this.piece.shape.forEach((row, y) => {
        row.forEach((v, x) => {
          if (v !== 0) this._drawBlock(ctx, x + this.piece.pos.x, y + this.piece.pos.y, scale, v);
        });
      });
    }
  }

  _drawBlock(ctx, gx, gy, scale, colorIdx, brightness = 1) {
    const c = PIECE_COLORS[colorIdx] || PIECE_COLORS[1];
    const rx = gx * scale, ry = gy * scale;
    const pad = 1;

    // Main fill
    const grad = ctx.createLinearGradient(rx+pad, ry+pad, rx+scale-pad, ry+scale-pad);
    grad.addColorStop(0, c.fill);
    grad.addColorStop(1, c.glow);
    ctx.fillStyle = grad;
    ctx.fillRect(rx+pad, ry+pad, scale-pad*2, scale-pad*2);

    // Brightness overlay
    if (brightness > 1) {
      ctx.fillStyle = `rgba(255,255,255,${(brightness-1)*0.6})`;
      ctx.fillRect(rx+pad, ry+pad, scale-pad*2, scale-pad*2);
    }

    // Top highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(rx+pad, ry+pad, scale-pad*2, Math.max(2, Math.floor(scale/5)));

    // Inner glow border
    ctx.strokeStyle = `rgba(255,255,255,0.15)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(rx+pad+0.5, ry+pad+0.5, scale-pad*2-1, scale-pad*2-1);
  }

  _drawGhostBlock(ctx, gx, gy, scale, colorIdx) {
    const c = PIECE_COLORS[colorIdx] || PIECE_COLORS[1];
    const rx = gx * scale, ry = gy * scale;
    const pad = 1;
    ctx.strokeStyle = c.fill + '55';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(rx+pad+0.5, ry+pad+0.5, scale-pad*2-1, scale-pad*2-1);
  }

  /* ─── Mini board render (for opponent preview or hold/next panes) ─── */
  static drawMiniPiece(ctx, type, x, y, cellSize) {
    if (!type || !SHAPES[type]) return;
    const shape = SHAPES[type];
    const c = PIECE_COLORS[type];
    const rows = shape.length, cols = shape[0].length;
    const ox = x - (cols * cellSize) / 2;
    const oy = y - (rows * cellSize) / 2;
    shape.forEach((row, ry) => {
      row.forEach((v, rx) => {
        if (v !== 0) {
          const px = ox + rx * cellSize, py = oy + ry * cellSize;
          const grad = ctx.createLinearGradient(px, py, px+cellSize, py+cellSize);
          grad.addColorStop(0, c.fill);
          grad.addColorStop(1, c.glow);
          ctx.fillStyle = grad;
          ctx.fillRect(px+0.5, py+0.5, cellSize-1, cellSize-1);
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(px+0.5, py+0.5, cellSize-1, Math.max(1, Math.floor(cellSize/5)));
        }
      });
    });
  }

  static renderGridSnapshot(ctx, gridStr, canvasWidth, canvasHeight) {
    if (!gridStr || !ctx) return;
    const rows = gridStr.split('|').map(r => r.split('').map(Number));
    const scale = Math.floor(canvasWidth / COLS);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    rows.forEach((row, y) => {
      row.forEach((v, x) => {
        if (v === 0) return;
        const c = PIECE_COLORS[v] || PIECE_COLORS[8];
        ctx.fillStyle = c.fill;
        ctx.fillRect(x*scale+0.5, y*scale+0.5, scale-1, scale-1);
      });
    });
  }
}
