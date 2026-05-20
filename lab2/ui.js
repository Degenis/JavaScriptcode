/* ════════════════════════════════════════════
   ui.js — інтерфейс симульованої консолі
   ════════════════════════════════════════════ */

const outputEl = document.getElementById('output');

function appendLine(text, cls) {
  const span = document.createElement('span');
  if (cls) span.className = cls;
  span.textContent = text + '\n';
  outputEl.appendChild(span);
  outputEl.scrollTop = outputEl.scrollHeight;
}

// Перехоплення console.log
const _nativeLog = console.log.bind(console);
console.log = function (...args) {
  _nativeLog(...args);
  const msg = args.length === 1 && typeof args[0] === 'object'
    ? JSON.stringify(args[0], null, 2)
    : args.join(' ');
  const cls = msg.startsWith('═══') ? 'line-section' : 'line-result';
  appendLine(msg, cls);
};

// Повторне виконання lab2.js (щоб вивід потрапив у консоль)
// Все вже виконалось при завантаженні — виводимо мітку
appendLine('✓ lab2.js завантажено та виконано. Всі об\'єкти доступні в консолі.', 'line-success');
appendLine('', '');

// Виконання команди
function runCmd(raw) {
  const code = raw.trim();
  if (!code) return;
  appendLine('>> ' + code, 'line-prompt');
  try {
    const result = eval(code);
    if (result !== undefined) {
      const out = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      appendLine('\u2190 ' + out, 'line-success');
    }
  } catch (err) {
    appendLine('\u2190 ' + err.message, 'line-error');
  }
  appendLine('', '');
}

document.getElementById('run-btn').addEventListener('click', () => {
  const inp = document.getElementById('cmd');
  runCmd(inp.value);
  inp.value = '';
  inp.focus();
});

document.getElementById('cmd').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    runCmd(e.target.value);
    e.target.value = '';
  }
});

// Швидкі тести
const QUICK_TESTS = [
  'car1.drive()',
  'car2.drive()',
  'truck1.trip()',
  'truck2.trip()',
  'truck3.trip()',
  'Square.help()',
  'sq.info()',
  'rect.info()',
  'rhom.info()',
  'para.info()',
  'piTimes2()',
  'PaintBlue(testObj1)',
  'PaintRed(testObj3)',
  'PaintYellow(testObj2)',
];

const chipsEl = document.getElementById('chips');
QUICK_TESTS.forEach(test => {
  const btn = document.createElement('button');
  btn.className = 'chip';
  btn.textContent = test;
  btn.addEventListener('click', () => runCmd(test));
  chipsEl.appendChild(btn);
});
