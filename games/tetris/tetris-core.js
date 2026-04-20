/**
 * TetrisCore - Shared game logic for Solo, Local 2P, and Online modes.
 */

const COLS = 10;
const ROWS = 20;
const COLORS = [
  null,
  '#FF3D3D', // Z
  '#3DFF3D', // S
  '#3D3DFF', // J
  '#FF9F3D', // L
  '#3DFFFF', // I
  '#FFFF3D', // O
  '#A73DFF'  // T
];

const SHAPES = [
  [],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 2, 2], [2, 2, 0]],
  [[3, 0, 0], [3, 3, 3]],
  [[0, 0, 4], [4, 4, 4]],
  [[0, 0, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0]],
  [[6, 6], [6, 6]],
  [[0, 7, 0], [7, 7, 7], [0, 0, 0]]
];

class TetrisGame {
  constructor(canvasId, notifId, onAttack, onGameOver, onUpdate) {
    this.canvas = document.getElementById(canvasId);
    if (this.canvas) this.ctx = this.canvas.getContext('2d');
    this.notifEl = document.getElementById(notifId);
    this.onAttack = onAttack;
    this.onGameOver = onGameOver;
    this.onUpdate = onUpdate; // Callback for online sync
    
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    this.piece = null;
    this.score = 0;
    this.gameOver = false;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.lastTime = 0;

    if (this.canvas) this.resize();
    this.spawnPiece();
  }

  resize() {
    const parent = this.canvas.parentElement;
    const w = parent.clientWidth || 300;
    const h = parent.clientHeight || 600;
    this.scale = Math.floor(Math.min(w / COLS, h / ROWS) * 0.95);
    this.canvas.width = COLS * this.scale;
    this.canvas.height = ROWS * this.scale;
  }

  spawnPiece() {
    const type = 1 + Math.floor(Math.random() * (SHAPES.length - 1));
    this.piece = {
      type,
      shape: JSON.parse(JSON.stringify(SHAPES[type])),
      pos: { x: Math.floor(COLS / 2) - 2, y: 0 }
    };
    if (this.collide()) {
      this.gameOver = true;
    }
    if (this.onUpdate) this.onUpdate();
  }

  collide(tempPos, tempShape) {
    const s = tempShape || this.piece.shape;
    const p = tempPos || this.piece.pos;

    for (let y = 0; y < s.length; ++y) {
      for (let x = 0; x < s[y].length; ++x) {
        if (s[y][x] !== 0) {
          const nx = x + p.x;
          const ny = y + p.y;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && this.grid[ny][nx] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  merge() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const ny = y + this.piece.pos.y;
          if (ny >= 0) this.grid[ny][x + this.piece.pos.x] = value;
        }
      });
    });
  }

  rotate(dir) {
    const originalShape = JSON.parse(JSON.stringify(this.piece.shape));
    const matrix = this.piece.shape;
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();

    if (this.collide()) {
      this.piece.shape = originalShape;
    } else if (this.onUpdate) {
      this.onUpdate();
    }
  }

  drop() {
    this.piece.pos.y++;
    if (this.collide()) {
      this.piece.pos.y--;
      this.merge();
      this.spawnPiece();
      this.sweep();
    } else if (this.onUpdate) {
      this.onUpdate();
    }
    this.dropCounter = 0;
  }

  sweep() {
    let rowCount = 0;
    outer: for (let y = ROWS - 1; y >= 0; --y) {
      for (let x = 0; x < COLS; ++x) {
        if (this.grid[y][x] === 0) continue outer;
      }
      const row = this.grid.splice(y, 1)[0].fill(0);
      this.grid.unshift(row);
      ++y;
      rowCount++;
    }

    if (rowCount > 0) {
      this.score += [0, 10, 30, 60, 100][rowCount];
      if (rowCount >= 2 && this.onAttack) {
        const attack = rowCount === 4 ? 4 : rowCount - 1;
        this.onAttack(attack);
        this.showNotif(`+${attack} ATTACK!`);
      }
      if (typeof GameUtils !== 'undefined') GameUtils.vibrate(30);
      if (this.onUpdate) this.onUpdate();
    }
  }

  addGarbage(lines) {
    for (let i = 0; i < lines; i++) {
      const row = Array(COLS).fill(8); // Gray
      const hole = Math.floor(Math.random() * COLS);
      row[hole] = 0;
      this.grid.shift();
      this.grid.push(row);
    }
    this.showNotif("RECEIVED!");
    if (typeof GameUtils !== 'undefined') GameUtils.vibrate([20, 20, 20]);
    if (this.collide()) this.gameOver = true;
    if (this.onUpdate) this.onUpdate();
  }

  showNotif(text) {
    if (!this.notifEl) return;
    this.notifEl.textContent = text;
    this.notifEl.style.animation = 'none';
    void this.notifEl.offsetWidth;
    this.notifEl.style.opacity = '1';
    this.notifEl.style.animation = 'attack-float 1s forwards';
  }

  update(time = 0) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
    this.draw();
    if (!this.gameOver) {
      requestAnimationFrame((t) => this.update(t));
    } else {
      if (this.onGameOver) this.onGameOver();
    }
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Ghost
    const ghostPos = { x: this.piece.pos.x, y: this.piece.pos.y };
    while (!this.collide(ghostPos)) {
      ghostPos.y++;
    }
    ghostPos.y--;
    this.drawMatrix(this.piece.shape, ghostPos, true);

    this.drawMatrix(this.grid, { x: 0, y: 0 });
    this.drawMatrix(this.piece.shape, this.piece.pos);
  }

  drawMatrix(matrix, offset, ghost = false) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const rx = (x + offset.x) * this.scale;
          const ry = (y + offset.y) * this.scale;
          if (ghost) {
             this.ctx.strokeStyle = COLORS[this.piece.type];
             this.ctx.strokeRect(rx+1, ry+1, this.scale-2, this.scale-2);
          } else {
            this.ctx.fillStyle = value === 8 ? '#444' : COLORS[value];
            this.ctx.fillRect(rx, ry, this.scale, this.scale);
            this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            this.ctx.strokeRect(rx, ry, this.scale, this.scale);
          }
        }
      });
    });
  }
}
