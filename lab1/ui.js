/* ════════════════════════════════════════════
   ui.js  —  Simulated browser console UI
   ════════════════════════════════════════════ */

const outputEl = document.getElementById('output');

// ── append a line to the fake console ─────────────────────────────
function appendLine(text, cls) {
  const span = document.createElement('span');
  if (cls) span.className = cls;
  span.textContent = text + '\n';
  outputEl.appendChild(span);
  outputEl.scrollTop = outputEl.scrollHeight;
}

// ── show instruction that triangle.js already printed ─────────────
appendLine(INSTRUCTION, 'line-info');
appendLine('', '');

// ── intercept console.log to mirror into the fake console ─────────
const _nativeLog = console.log.bind(console);
console.log = function (...args) {
  _nativeLog(...args);
  const msg = args.join(' ');
  const cls = msg.startsWith('━') ? 'line-info' : 'line-result';
  appendLine(msg, cls);
};

// ── run arbitrary JS entered by the user ──────────────────────────
function runCmd(raw) {
  const code = raw.trim();
  if (!code) return;

  appendLine('>> ' + code, 'line-prompt');

  try {
    const result = eval(code); // eslint-disable-line no-eval

    if (result !== undefined) {
      let cls = 'line-result';
      if (result === 'success') cls = 'line-success';
      else if (result === 'failed') cls = 'line-failed';
      else if (typeof result === 'string') cls = 'line-error';

      appendLine('\u2190 "' + result + '"', cls);
    }
  } catch (err) {
    appendLine('\u2190 ' + err.message, 'line-error');
  }

  appendLine('', '');
}

// ── button ─────────────────────────────────────────────────────────
document.getElementById('run-btn').addEventListener('click', () => {
  const inp = document.getElementById('cmd');
  runCmd(inp.value);
  inp.value = '';
  inp.focus();
});

// ── enter key ──────────────────────────────────────────────────────
document.getElementById('cmd').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    runCmd(e.target.value);
    e.target.value = '';
  }
});

// ── quick-test chips ───────────────────────────────────────────────
const QUICK_TESTS = [
  'triangle(7, "leg", 18, "hypotenuse")',
  'triangle(18, "hypotenuse", 7, "leg")',
  'triangle(60, "opposite angle", 5, "leg")',
  'triangle(5, "leg", 60, "adjacent angle")',
  'triangle(30, "angle", 10, "hypotenuse")',
  'triangle(3, "leg", 4, "leg")',
  'triangle(43.13, "angle", -2, "hypotenuse")',
  'triangle(5, "leg", 3, "hypotenuse")',
  'triangle(90, "angle", 5, "hypotenuse")',
  'triangle(4, "hypotenus", 8, "leg")',
];

const chipsEl = document.getElementById('chips');

QUICK_TESTS.forEach(test => {
  const btn = document.createElement('button');
  btn.className = 'chip';
  btn.textContent = test;
  btn.addEventListener('click', () => runCmd(test));
  chipsEl.appendChild(btn);
});
