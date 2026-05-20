// ==========================================
//  Лабораторна №5 — «Лови квадрат»
//  Демонстрація: DOM, події, querySelector
// ==========================================

// --- DOM-елементи ---
const scoreEl   = document.getElementById('score');
const timerEl   = document.getElementById('timer');
const square    = document.getElementById('square');
const arena     = document.getElementById('arena');
const overlay   = document.getElementById('overlay');
const startBtn  = document.getElementById('startBtn');
const overlayTitle = document.getElementById('overlayTitle');
const overlaySub   = document.getElementById('overlaySub');
const overlayScore = document.getElementById('overlayScore');

// --- Стан гри ---
let score        = 0;
let timeLeft     = 3;      // секунд на клік
let tickInterval = null;   // setInterval для таймера
let running      = false;

// --- Складність: чим більше очок, тим менше часу ---
function getTimeLimit() {
  if (score < 5)  return 3;
  if (score < 10) return 2;
  if (score < 20) return 1.5;
  return 1;
}

// --- Розмістити квадрат у випадковому місці ---
function placeSquare() {
  const aW = arena.clientWidth  - 50;
  const aH = arena.clientHeight - 50;
  const x  = Math.floor(Math.random() * aW);
  const y  = Math.floor(Math.random() * aH);

  square.style.left = x + 'px';
  square.style.top  = y + 'px';
  square.style.display = 'block';

  // анімація появи
  square.classList.remove('pop');
  void square.offsetWidth;   // reflow
  square.classList.add('pop');
}

// --- Запустити таймер для поточного кроку ---
function startTick() {
  timeLeft = getTimeLimit();
  updateTimerUI();

  clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(2));
    updateTimerUI();

    if (timeLeft <= 0) {
      // Час вийшов — промах
      clearInterval(tickInterval);
      handleMiss();
    }
  }, 100);
}

function updateTimerUI() {
  timerEl.textContent = timeLeft.toFixed(1);
  timerEl.classList.toggle('urgent', timeLeft <= 1);
}

// --- Попадання по квадрату ---
function handleHit() {
  score++;
  scoreEl.textContent = score;

  // Маленька анімація лічильника
  scoreEl.style.transform = 'scale(1.4)';
  setTimeout(() => { scoreEl.style.transform = ''; }, 150);

  placeSquare();
  startTick();
}

// --- Промах (клік мимо або час вийшов) ---
function handleMiss() {
  running = false;
  clearInterval(tickInterval);

  square.style.display = 'none';

  // Спалах поля
  arena.classList.remove('miss-flash');
  void arena.offsetWidth;
  arena.classList.add('miss-flash');

  // Показати оверлей
  overlayTitle.textContent = score > 0 ? 'ПРОМАХ!' : 'ЛОВИ КВАДРАТ!';
  overlaySub.textContent   = score > 0
    ? 'Квадрат втік або час вийшов. Спробуй ще раз!'
    : 'Натискай на квадрат до того, як час вийде.\nПромах — скидання рахунку.';

  if (score > 0) {
    overlayScore.textContent = `Твій рахунок: ${score}`;
    overlayScore.classList.remove('hidden');
  } else {
    overlayScore.classList.add('hidden');
  }

  startBtn.textContent = score > 0 ? '↺ ЗНОВУ' : '▶ СТАРТ';

  score = 0;
  scoreEl.textContent = 0;
  timerEl.textContent = '–';

  overlay.classList.remove('hidden');
}

// --- Клік на квадрат ---
square.addEventListener('click', function(e) {
  e.stopPropagation();   // не допустити спрацювання кліку по арені
  if (!running) return;
  handleHit();
});

// --- Клік мимо (по арені) ---
arena.addEventListener('click', function() {
  if (!running) return;
  handleMiss();
});

// --- Старт гри ---
function startGame() {
  running = true;
  score   = 0;
  scoreEl.textContent = 0;

  overlay.classList.add('hidden');
  overlayScore.classList.add('hidden');

  placeSquare();
  startTick();
}

// --- Обробник кнопки Старт ---
startBtn.addEventListener('click', startGame);

// --- DOMContentLoaded (демонстрація з теми) ---
document.addEventListener('DOMContentLoaded', function() {
  // Гра чекає на старт — оверлей вже видно за замовчуванням
  timerEl.textContent = '–';
});
