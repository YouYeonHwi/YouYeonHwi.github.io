class JanggiGame {
  constructor(config) {
    this.container = document.getElementById(config.containerId);
    this.svg = document.getElementById(config.svgId);
    this.onTurnChange = config.onTurnChange;
    this.onWin = config.onWin;
    this.readOnly = config.readOnly || false;
    this.myRole = config.myRole || null; // 'p1' or 'p2' or null (local)

    this.board = Array.from({ length: 10 }, () => Array(9).fill(null));
    this.currentTurn = 'p1';
    this.selectedPiece = null;
    this.validMovesCache = [];
    this.lastMoveInfo = null;

    this.isGameOver = false;

    this.initBoardSVG();
    this.setupStandardBoard();
    this.render();
  }

  destroy() {
    this.container.innerHTML = '';
    this.svg.innerHTML = '';
  }

  setReadOnly(ro) {
    this.readOnly = ro;
    this.render(); // Update cursor styles based on editability
  }

  /* ════════════ BOARD DRAWING ════════════ */
  initBoardSVG() {
    this.svg.innerHTML = '';
    const w = 80, h = 90; // viewBox 0 0 80 90
    
    const drawLine = (x1, y1, x2, y2) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(255,255,255,0.2)');
      line.setAttribute('stroke-width', '0.5');
      this.svg.appendChild(line);
    };

    // Grid lines
    for (let x = 0; x < 9; x++) drawLine(x*10, 0, x*10, 90);
    for (let y = 0; y < 10; y++) {
      if (y === 4 || y === 5) {
        drawLine(0, y*10, 80, y*10); // horizontal
      } else {
        drawLine(0, y*10, 80, y*10);
      }
    }

    // Palace X lines (P2 Top)
    drawLine(30, 0, 50, 20);
    drawLine(50, 0, 30, 20);

    // Palace X lines (P1 Bottom)
    drawLine(30, 70, 50, 90);
    drawLine(50, 70, 30, 90);
  }

  /* ════════════ SETUP ════════════ */
  setupStandardBoard() {
    const addP = (x, y, player, type, label) => {
      this.board[y][x] = { player, type, label, id: `${player}_${type}_${x}_${y}_${Math.random()}` };
    };

    // P2 (Han - Top) - Traditionally Red side starting second
    addP(0, 0, 'p2', 'cha', '車');
    addP(1, 0, 'p2', 'ma', '馬');
    addP(2, 0, 'p2', 'sang', '象');
    addP(3, 0, 'p2', 'sa', '士');
    addP(4, 1, 'p2', 'king', '漢');
    addP(5, 0, 'p2', 'sa', '士');
    addP(6, 0, 'p2', 'sang', '象');
    addP(7, 0, 'p2', 'ma', '馬');
    addP(8, 0, 'p2', 'cha', '車');
    addP(1, 2, 'p2', 'po', '包');
    addP(7, 2, 'p2', 'po', '包');
    for (let x of [0, 2, 4, 6, 8]) addP(x, 3, 'p2', 'jol', '兵');

    // P1 (Cho - Bottom) - Traditionally Green/Blue side starting first
    addP(0, 9, 'p1', 'cha', '車');
    addP(1, 9, 'p1', 'ma', '馬');
    addP(2, 9, 'p1', 'sang', '象');
    addP(3, 9, 'p1', 'sa', '士');
    addP(4, 8, 'p1', 'king', '楚');
    addP(5, 9, 'p1', 'sa', '士');
    addP(6, 9, 'p1', 'sang', '象');
    addP(7, 9, 'p1', 'ma', '馬');
    addP(8, 9, 'p1', 'cha', '車');
    addP(1, 7, 'p1', 'po', '包');
    addP(7, 7, 'p1', 'po', '包');
    for (let x of [0, 2, 4, 6, 8]) addP(x, 6, 'p1', 'jol', '卒');
  }

  serializeBoard() {
    return this.board.map(row => row.map(cell => cell ? { ...cell } : null));
  }
  deserializeBoard(state) {
    this.board = state.map(row => row.map(cell => cell ? { ...cell } : null));
    this.selectedPiece = null;
    this.validMovesCache = [];
    this.render();
  }

  isPalaceCenter(x, y) {
    return (x === 4 && y === 1) || (x === 4 && y === 8);
  }
  isPalace(x, y) {
    return x >= 3 && x <= 5 && (y <= 2 || y >= 7);
  }

  /* ════════════ MOVE GENERATION ════════════ */
  getValidMoves(bx, by, boardState) {
    const piece = boardState[by][bx];
    if (!piece) return [];
    
    let moves = [];
    const p = piece.player;
    const addMove = (x, y) => {
      if (x < 0 || x > 8 || y < 0 || y > 9) return;
      const target = boardState[y][x];
      if (!target || target.player !== p) moves.push({ x, y, isCapture: !!target });
    };

    // Helpers inside
    const isEnemy = (x, y) => {
      if (x < 0 || x > 8 || y < 0 || y > 9) return true; // treated as blocker
      const t = boardState[y][x];
      return t && t.player !== p;
    };
    const isEmpty = (x, y) => {
      if (x < 0 || x > 8 || y < 0 || y > 9) return false;
      return !boardState[y][x];
    };

    if (piece.type === 'king' || piece.type === 'sa') {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
      for (let [dx, dy] of dirs) {
        let nx = bx + dx, ny = by + dy;
        if (this.isPalace(nx, ny)) addMove(nx, ny);
      }
      // Diagonal in palace
      if (this.isPalaceCenter(bx, by)) {
        addMove(bx-1, by-1); addMove(bx+1, by-1);
        addMove(bx-1, by+1); addMove(bx+1, by+1);
      } else if (this.isPalace(bx, by)) {
        // Corners towards center
        const cy = by < 5 ? 1 : 8;
        addMove(4, cy);
      }
    } 
    else if (piece.type === 'jol') {
      const forward = p === 'p1' ? -1 : 1;
      addMove(bx, by + forward);
      addMove(bx - 1, by);
      addMove(bx + 1, by);
      // Diagonals in enemy palace
      if (this.isPalace(bx, by)) {
        const cy = (p === 'p1') ? 1 : 8; // Enemy palace center y
        if (bx === 3 && by === cy - forward) addMove(4, cy);
        if (bx === 5 && by === cy - forward) addMove(4, cy);
        if (bx === 4 && by === cy) { addMove(3, cy + forward); addMove(5, cy + forward); }
      }
    }
    else if (piece.type === 'ma') {
      const mDirs = [
        [0,-1, -1,-2], [0,-1, 1,-2], [0,1, -1,2], [0,1, 1,2],
        [-1,0, -2,-1], [-1,0, -2,1], [1,0, 2,-1], [1,0, 2,1]
      ];
      for (let [ox, oy, dx, dy] of mDirs) {
        if (isEmpty(bx+ox, by+oy)) addMove(bx+dx, by+dy);
      }
    }
    else if (piece.type === 'sang') {
      const sDirs = [
        [0,-1, -1,-2, -2,-3], [0,-1, 1,-2, 2,-3],
        [0,1, -1,2, -2,3], [0,1, 1,2, 2,3],
        [-1,0, -2,-1, -3,-2], [-1,0, -2,1, -3,2],
        [1,0, 2,-1, 3,-2], [1,0, 2,1, 3,2]
      ];
      for (let [o1x, o1y, o2x, o2y, dx, dy] of sDirs) {
        if (isEmpty(bx+o1x, by+o1y) && isEmpty(bx+o2x, by+o2y)) addMove(bx+dx, by+dy);
      }
    }
    else if (piece.type === 'cha') {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
      for (let [dx, dy] of dirs) {
        let nx = bx + dx, ny = by + dy;
        while(nx>=0 && nx<=8 && ny>=0 && ny<=9) {
          if (isEmpty(nx, ny)) { addMove(nx, ny); }
          else { addMove(nx, ny); break; }
          nx += dx; ny += dy;
        }
      }
      // Palace diagonal slides
      if (this.isPalace(bx, by)) {
        if (!this.isPalaceCenter(bx, by)) {
          const cx = 4, cy = by < 5 ? 1 : 8;
          if (isEmpty(cx, cy)) addMove(cx + (cx-bx), cy + (cy-by));
          addMove(cx, cy);
        } else {
          addMove(bx-1, by-1); addMove(bx+1, by-1);
          addMove(bx-1, by+1); addMove(bx+1, by+1);
        }
      }
    }
    else if (piece.type === 'po') {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
      for (let [dx, dy] of dirs) {
        let nx = bx + dx, ny = by + dy;
        let jumped = false;
        while(nx>=0 && nx<=8 && ny>=0 && ny<=9) {
          const t = boardState[ny][nx];
          if (!t) {
            if (jumped) addMove(nx, ny);
          } else {
            if (t.type === 'po') break; // Can't jump over or land on Po
            if (!jumped) { jumped = true; }
            else { 
              if (t.player !== p) addMove(nx, ny);
              break; 
            }
          }
          nx += dx; ny += dy;
        }
      }
      // Palace diagonal jumps
      if (this.isPalace(bx, by) && !this.isPalaceCenter(bx, by)) {
        const cx = 4, cy = by < 5 ? 1 : 8;
        const targetX = cx + (cx-bx), targetY = cy + (cy-by);
        const centerPiece = boardState[cy][cx];
        const targetPiece = boardState[targetY][targetX];
        if (centerPiece && centerPiece.type !== 'po') {
          if (!targetPiece) addMove(targetX, targetY);
          else if (targetPiece.type !== 'po' && targetPiece.player !== p) addMove(targetX, targetY);
        }
      }
    }

    return moves;
  }

  // Filter moves to prevent self-check
  getLegalMoves(bx, by, boardState) {
    const pseudoMoves = this.getValidMoves(bx, by, boardState);
    const p = boardState[by][bx].player;
    return pseudoMoves.filter(m => !this.isKingInCheckAfter(p, bx, by, m.x, m.y, boardState));
  }

  isKingInCheck(player, boardState) {
    let kx = -1, ky = -1;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const pc = boardState[y][x];
        if (pc && pc.player === player && pc.type === 'king') { kx = x; ky = y; break; }
      }
    }
    if (kx === -1) return true; // Dead king

    const enemy = player === 'p1' ? 'p2' : 'p1';
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const pc = boardState[y][x];
        if (pc && pc.player === enemy) {
          const eMoves = this.getValidMoves(x, y, boardState);
          if (eMoves.some(m => m.x === kx && m.y === ky)) return true;
        }
      }
    }
    return false;
  }

  isKingInCheckAfter(player, sx, sy, ex, ey, boardState) {
    // Clone board state just for this calculation
    const tempBoard = boardState.map(r => r.slice());
    tempBoard[ey][ex] = tempBoard[sy][sx];
    tempBoard[sy][sx] = null;
    return this.isKingInCheck(player, tempBoard);
  }

  getAllLegalMoves(player, boardState) {
    let moves = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const pc = boardState[y][x];
        if (pc && pc.player === player) {
          const lMoves = this.getLegalMoves(x, y, boardState);
          moves.push(...lMoves);
        }
      }
    }
    return moves;
  }

  /* ════════════ ACTIONS ════════════ */
  handleGridClick(x, y) {
    if (this.isGameOver) return;
    if (this.readOnly || (this.myRole && this.currentTurn !== this.myRole)) return;

    const clickedPiece = this.board[y][x];

    // If selecting own piece
    if (clickedPiece && clickedPiece.player === this.currentTurn) {
      if (this.selectedPiece && this.selectedPiece.x === x && this.selectedPiece.y === y) {
        this.selectedPiece = null; // deselect
      } else {
        this.selectedPiece = { x, y, piece: clickedPiece };
        this.validMovesCache = this.getLegalMoves(x, y, this.board);
      }
      this.render();
      return;
    }

    // If valid move selected
    if (this.selectedPiece) {
      const isValid = this.validMovesCache.find(m => m.x === x && m.y === y);
      if (isValid) {
        const sx = this.selectedPiece.x, sy = this.selectedPiece.y;
        this.board[y][x] = this.selectedPiece.piece;
        this.board[sy][sx] = null;
        
        if (isValid.isCapture && isValid.type === 'king') {
          // Fallback if not caught by checkmate
        }
        
        this.selectedPiece = null;
        this.validMovesCache = [];
        this.lastMoveInfo = { sx, sy, ex: x, ey: y };
        
        this.checkGameState(this.currentTurn === 'p1' ? 'p2' : 'p1');
        return;
      }
      this.selectedPiece = null;
      this.validMovesCache = [];
      this.render();
    }
  }

  checkGameState(nextTurn) {
    this.currentTurn = nextTurn;
    const inCheck = this.isKingInCheck(this.currentTurn, this.board);
    
    // 외통수 체크 (Checkmate check)
    let isMate = false;
    if (inCheck) {
      this.triggerCheckEffect();
      const allLegal = this.getAllLegalMoves(this.currentTurn, this.board);
      if (allLegal.length === 0) {
        isMate = true;
      }
    } else {
      // 빅장/스테일메이트(Stalemate) 방지 용으로 이동할 곳이 없으면 패배 처리
      const allLegal = this.getAllLegalMoves(this.currentTurn, this.board);
      if (allLegal.length === 0) isMate = true;
    }

    if (isMate) {
      this.isGameOver = true;
      const winner = this.currentTurn === 'p1' ? 'p2' : 'p1';
      this.render();
      if (this.onWin) this.onWin(winner, '외통수(Checkmate)입니다.');
    } else {
      this.render();
      if (this.onTurnChange) this.onTurnChange(this.currentTurn, inCheck);
    }
  }

  triggerCheckEffect() {
    const el = document.getElementById('check-effect');
    if (el) {
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'checkAnim 2s forwards';
      document.getElementById('play-area').style.animation = 'shakeScreen 0.4s ease-in-out';
      setTimeout(() => { document.getElementById('play-area').style.animation = 'none'; }, 500);
    }
  }

  updateLastMoveIndicator(lm) {
    this.lastMoveInfo = lm;
  }

  /* ════════════ DOM RENDER ════════════ */
  render() {
    this.container.innerHTML = '';
    
    const interactable = !this.readOnly && (!this.myRole || this.currentTurn === this.myRole);
    const flipped = this.myRole === 'p2';

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        // Visual Coordinates (Flip for P2)
        const vx = flipped ? (8 - x) : x;
        const vy = flipped ? (9 - y) : y;

        // Render valid move targets
        const isMove = this.validMovesCache.find(m => m.x === x && m.y === y);
        if (isMove && interactable) {
          const dot = document.createElement('div');
          dot.className = `grid-intersection ${isMove.isCapture ? 'valid-capture' : 'valid-move'}`;
          dot.style.left = `${(vx / 8) * 100}%`;
          dot.style.top = `${(vy / 9) * 100}%`;
          dot.onclick = () => this.handleGridClick(x, y);
          this.container.appendChild(dot);
        }

        const p = this.board[y][x];
        if (p) {
          const pieceEl = document.createElement('div');
          pieceEl.className = `janggi-piece ${p.type}`;
          pieceEl.setAttribute('data-player', p.player);
          pieceEl.textContent = p.label;
          pieceEl.style.left = `${(vx / 8) * 100}%`;
          pieceEl.style.top = `${(vy / 9) * 100}%`;
          pieceEl.id = p.id;
          
          if (this.selectedPiece && this.selectedPiece.x === x && this.selectedPiece.y === y) {
            pieceEl.classList.add('selected');
          }

          if (interactable || (this.validMovesCache.length > 0 && isMove)) {
            pieceEl.onclick = () => this.handleGridClick(x, y);
            if (interactable && p.player === this.currentTurn) pieceEl.style.cursor = 'pointer';
            else if (isMove) pieceEl.style.cursor = 'crosshair';
            else pieceEl.style.cursor = 'default';
          } else {
            pieceEl.style.cursor = 'default';
          }
          this.container.appendChild(pieceEl);
        } else {
          // Invisible click area for empty intersections
          if (interactable) {
            const hit = document.createElement('div');
            hit.style.position = 'absolute';
            hit.style.left = `calc(${(vx / 8) * 100}% - 4%)`;
            hit.style.top = `calc(${(vy / 9) * 100}% - 4%)`;
            hit.style.width = '8%'; hit.style.height = '8%';
            hit.onclick = () => this.handleGridClick(x, y);
            this.container.appendChild(hit);
          }
        }
      }
    }
  }
}
