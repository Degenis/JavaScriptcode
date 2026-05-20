// ==========================================
//  Лабораторна №5 — Клікер-гра
//  Демонстрація: DOM, події, querySelector
// ==========================================

// --- Отримання елементів через DOM ---
const scoreEl      = document.getElementById('score');
const levelEl      = document.getElementById('level');
const cpsEl        = document.getElementById('cps');
const nextLevelEl  = document.getElementById('nextLevel');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const clickBtn     = document.getElementById('clickBtn');
const resetBtn     = document.getElementById('resetBtn');
const floatContainer = document.getElementById('floatContainer');

const upgradeButtons = document.querySelectorAll('.upgrade-btn');

// --- Стан гри ---
let score       = 0;
let level       = 1;
let clickValue  = 1;       // очок за клік
let clicksThisSec = 0;
let cps         = 0;

// Пороги для кожного рівня: рівень N потребує levelThreshold(N) очок
function levelThreshold(lvl) {
  return Math.floor(50 * Math.pow(1.8, lvl - 1));
}

// --- Оновлення інтерфейсу ---
function updateUI() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  cpsEl.textContent   = cps;

  const required = levelThreshold(level);
  const prevReq  = level > 1 ? levelThreshold(level - 1) : 0;
  const current  = score - prevReq;
  const needed   = required - prevReq;

  progressText.textContent = `${current} / ${needed}`;
  progressFill.style.width = `${Math.min(100, (current / needed) * 100)}%`;
  nextLevelEl.textContent  = level + 1;

  // Увімкнути/вимкнути кнопки покращень
  upgradeButtons.forEach(btn => {
    if (btn.classList.contains('bought')) return;
    const cost = parseInt(btn.dataset.cost, 10);
    btn.disabled = score < cost;
  });
}

// --- Перевірка підвищення рівня ---
function checkLevelUp() {
  const required = levelThreshold(level);
  if (score >= required) {
    level++;
    showLevelUpEffect();
    updateUI();
  }
}

// --- Ефект підвищення рівня ---
function showLevelUpEffect() {
  const msg = document.createElement('div');
  msg.classList.add('float-text');
  msg.textContent = `🎉 РІВЕНЬ ${level}!`;
  msg.style.left = '50%';
  msg.style.top  = '40%';
  msg.style.transform = 'translateX(-50%)';
  msg.style.fontSize = '2.4rem';
  msg.style.color = '#5effa0';
  floatContainer.appendChild(msg);
  setTimeout(() => msg.remove(), 1000);
}

// --- Плаваючий текст при кліку ---
function spawnFloat(x, y, text) {
  const el = document.createElement('div');
  el.classList.add('float-text');
  el.textContent = text;
  el.style.left = `${x - 16}px`;
  el.style.top  = `${y - 20}px`;
  floatContainer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// --- Анімація "bump" для лічильника ---
function bumpStat(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 200);
}

// --- Анімація пульсу кнопки ---
function ringEffect() {
  clickBtn.classList.remove('ring');
  void clickBtn.offsetWidth;
  clickBtn.classList.add('ring');
}

// --- Обробник кліку на головну кнопку ---
clickBtn.addEventListener('click', function(event) {
  score += clickValue;
  clicksThisSec++;

  spawnFloat(event.clientX, event.clientY, `+${clickValue}`);
  bumpStat(scoreEl);
  ringEffect();
  checkLevelUp();
  updateUI();
});

// --- Підтримка натискання клавіші пробіл / Enter ---
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault();
    const rect = clickBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;

    score += clickValue;
    clicksThisSec++;
    spawnFloat(cx, cy, `+${clickValue}`);
    bumpStat(scoreEl);
    ringEffect();
    checkLevelUp();
    updateUI();
  }
});

// --- Обробники покращень (event delegation через querySelectorAll) ---
upgradeButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const cost = parseInt(this.dataset.cost, 10);
    const mult = parseInt(this.dataset.mult, 10);

    if (score < cost) return;

    score      -= cost;
    clickValue *= mult;

    this.classList.add('bought');
    this.querySelector('.upg-name').textContent += ' ✓';
    this.querySelector('.upg-cost').textContent = 'Куплено!';

    bumpStat(scoreEl);
    updateUI();
  });
});

// --- Скидання гри ---
resetBtn.addEventListener('click', function() {
  if (!confirm('Скинути прогрес?')) return;

  score      = 0;
  level      = 1;
  clickValue = 1;
  cps        = 0;

  upgradeButtons.forEach(btn => {
    btn.classList.remove('bought');
    btn.disabled = false;
    const origNames = ['Подвійний клік', 'Мегаклік ×5', 'Ультраклік ×10'];
    const origCosts = ['💰 10 очок', '💰 50 очок', '💰 200 очок'];
    const i = [...upgradeButtons].indexOf(btn);
    btn.querySelector('.upg-name').textContent = origNames[i];
    btn.querySelector('.upg-cost').textContent = origCosts[i];
  });

  updateUI();
});

// --- Лічильник кліків за секунду ---
setInterval(function() {
  cps = clicksThisSec;
  clicksThisSec = 0;
  cpsEl.textContent = cps;
}, 1000);

// --- Подія DOMContentLoaded (демонстрація з лекції) ---
document.addEventListener('DOMContentLoaded', function() {
  updateUI();
});

// Початкове відображення (якщо DOMContentLoaded вже відбувся)
updateUI();
