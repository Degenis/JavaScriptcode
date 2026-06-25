// ==========================================
//  Лабораторна №6 — Гра "Lights Out"
//  Демонстрація: DOM, події, fetch / JSON
// ==========================================

// --- Дані рівнів (імітація JSON з сервера) ---
// У реальному проєкті ці дані завантажувались би через fetch('levels.json')
const LEVELS_JSON = `{
  "a": {
    "name": "A",
    "minMoves": 7,
    "grid": [
      [0,1,0,0,1],
      [1,0,1,1,1],
      [1,0,1,0,1],
      [0,0,1,0,0],
      [1,1,1,1,1]
    ]
  },
  "b": {
    "name": "B",
    "minMoves": 8,
    "grid": [
      [0,1,1,1,0],
      [0,0,1,0,0],
      [0,0,1,1,0],
      [0,1,1,1,1],
      [1,0,1,0,0]
    ]
  },
  "c": {
    "name": "C",
    "minMoves": 9,
    "grid": [
      [1,1,0,0,0],
      [0,0,1,1,1],
      [1,0,0,1,1],
      [0,1,1,0,1],
      [1,0,0,0,0]
    ]
  }
}`;

// --- Стан гри ---
let levels    = {};      // завантажені дані рівнів
let board     = [];      // поточний стан поля (5×5)
let moves     = 0;
let currentLevel = 'a';
let won       = false;

// --- DOM-елементи ---
const gridEl      = document.getElementById('grid');
const moveCountEl = document.getElementById('moveCount');
const minMovesEl  = document.getElementById('minMoves');
const levelNameEl = document.getElementById('levelName');
const winBanner   = document.getElementById('winBanner');
const winSub      = document.getElementById('winSub');
const resetBtn    = document.getElementById('resetBtn');
const levelBtns   = document.querySelectorAll('.btn-level');

// ==========================================
//  ЗАВАНТАЖЕННЯ ДАНИХ (імітація fetch+JSON)
// ==========================================

/**
 * Імітує завантаження JSON з сервера через fetch.
 * У реальному проєкті: fetch('levels.json').then(r => r.json())
 * Повертає Promise, щоб зберегти ідентичний async/await синтаксис.
 */
function loadLevels() {
  return new Promise((resolve) => {
    // Імітуємо мережеву затримку
    setTimeout(() => {
      const data = JSON.parse(LEVELS_JSON);
      resolve(data);
    }, 100);
  });
}

// ==========================================
//  ЛОГІКА ГРИ
// ==========================================

/** Глибока копія початкового поля для поточного рівня */
function getInitialBoard(levelKey) {
  return levels[levelKey].grid.map(row => [...row]);
}

/** Перемикає клітинку (r,c) та 4 сусідів */
function toggle(r, c) {
  const neighbors = [[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
  neighbors.forEach(([nr, nc]) => {
    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
      board[nr][nc] ^= 1;
    }
  });
}

/** Перевіряє: чи всі клітинки вимкнені */
function checkWin() {
  return board.every(row => row.every(v => v === 0));
}

// ==========================================
//  ВІДОБРАЖЕННЯ
// ==========================================

/** Повністю перебудовує DOM-сітку */
function renderGrid() {
  gridEl.innerHTML = '';

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (board[r][c] === 1) cell.classList.add('on');

      // Обробник кліку через addEventListener
      cell.addEventListener('click', () => handleCellClick(r, c));

      gridEl.appendChild(cell);
    }
  }
}

/** Оновлює лише класи клітинок (без перебудови DOM) */
function updateGrid() {
  const cells = gridEl.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    const r = Math.floor(i / 5);
    const c = i % 5;
    cell.classList.toggle('on', board[r][c] === 1);
  });
}

/** Підсвітка сусідів при кліку */
function flashNeighbors(r, c) {
  const cells = gridEl.querySelectorAll('.cell');
  const neighbors = [[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
  neighbors.forEach(([nr, nc]) => {
    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
      const cell = cells[nr * 5 + nc];
      cell.classList.remove('flash');
      void cell.offsetWidth;
      cell.classList.add('flash');
    }
  });
}

function updateStats() {
  moveCountEl.textContent = moves;
}

function showWin() {
  const optimal = moves === levels[currentLevel].minMoves;
  winBanner.classList.remove('hidden');
  winSub.textContent = optimal
    ? `Оптимально! Рівно ${moves} кроків 🎯`
    : `${moves} кроків (мінімум: ${levels[currentLevel].minMoves})`;
}

function hideWin() {
  winBanner.classList.add('hidden');
}

// ==========================================
//  ОБРОБНИКИ ПОДІЙ
// ==========================================

function handleCellClick(r, c) {
  if (won) return;

  toggle(r, c);
  moves++;
  flashNeighbors(r, c);
  updateGrid();
  updateStats();

  if (checkWin()) {
    won = true;
    showWin();
  }
}

/** Завантажує рівень і скидає стан */
function loadLevel(key) {
  currentLevel = key;
  board  = getInitialBoard(key);
  moves  = 0;
  won    = false;

  levelNameEl.textContent = levels[key].name;
  minMovesEl.textContent  = levels[key].minMoves;

  hideWin();
  renderGrid();
  updateStats();

  // Оновлюємо активну кнопку рівня
  levelBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === key);
  });
}

// Кнопка «Перезапустити»
resetBtn.addEventListener('click', () => loadLevel(currentLevel));

// Кнопки вибору рівня
levelBtns.forEach(btn => {
  btn.addEventListener('click', () => loadLevel(btn.dataset.level));
});

// ==========================================
//  ІНІЦІАЛІЗАЦІЯ (async/await + fetch-імітація)
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    levels = await loadLevels();   // «завантаження з сервера»
    loadLevel('a');
  } catch (err) {
    gridEl.textContent = 'Помилка завантаження даних: ' + err.message;
  }
});
