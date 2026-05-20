/* ════════════════════════════════════════════
   triangle.js  —  Лабораторна робота №1
   Розв'язання прямокутного трикутника
   ════════════════════════════════════════════ */

const VALID_TYPES = [
  "leg",
  "hypotenuse",
  "adjacent angle",
  "opposite angle",
  "angle"
];

const INSTRUCTION =
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  triangle(val1, type1, val2, type2)
  Розв'язує прямокутний трикутник за двома відомими елементами.

  Допустимі типи:
    "leg"             — катет
    "hypotenuse"      — гіпотенуза
    "adjacent angle"  — кут, прилеглий до катета (в градусах)
    "opposite angle"  — кут, протилежний до катета (в градусах)
    "angle"           — гострий кут разом із гіпотенузою (в градусах)

  Позначення результату:
    c     — гіпотенуза
    a, b  — катети
    alpha — гострий кут навпроти катета a
    beta  — гострий кут навпроти катета b

  Приклади:
    triangle(7,  "leg",            18, "hypotenuse")
    triangle(60, "opposite angle",  5, "leg")
    triangle(30, "angle",          10, "hypotenuse")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

console.log(INSTRUCTION);

// ── helpers ────────────────────────────────────────────────────────
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;
const round = v   => Math.round(v * 1e12) / 1e12;
const badAngle = deg => deg <= 0 || deg >= 90;

// ── main function ──────────────────────────────────────────────────
function triangle(val1, type1, val2, type2) {

  // 1. validate types
  if (!VALID_TYPES.includes(type1) || !VALID_TYPES.includes(type2)) {
    console.log("Невідомий тип аргументу. Будь ласка, перечитайте інструкцію.");
    return "failed";
  }

  // 2. validate positivity
  if (val1 <= 0 || val2 <= 0) {
    return "Zero or negative input";
  }

  // 3. canonicalise order for easier case matching
  let t1 = type1, v1 = val1, t2 = type2, v2 = val2;
  if (t1 > t2) { [t1, v1, t2, v2] = [t2, v2, t1, v1]; }

  const key = `${t1}|${t2}`;

  let a, b, c, alpha, beta;

  switch (key) {

    // ── leg + leg ──────────────────────────────────────────────────
    case "leg|leg": {
      a = v1;
      b = v2;
      c     = Math.sqrt(a * a + b * b);
      alpha = toDeg(Math.atan(a / b));
      beta  = toDeg(Math.atan(b / a));
      break;
    }

    // ── leg + hypotenuse ───────────────────────────────────────────
    case "hypotenuse|leg": {
      const leg = (t1 === "leg") ? v1 : v2;
      const hyp = (t1 === "leg") ? v2 : v1;
      if (leg >= hyp) return "Катет не може бути більшим або рівним гіпотенузі";
      a     = leg;
      c     = hyp;
      b     = Math.sqrt(c * c - a * a);
      alpha = toDeg(Math.asin(a / c));
      beta  = 90 - alpha;
      break;
    }

    // ── leg + adjacent angle ───────────────────────────────────────
    // кут beta прилеглий до катета b
    case "adjacent angle|leg": {
      const leg = (t1 === "leg") ? v1 : v2;
      const ang = (t1 === "leg") ? v2 : v1;
      if (badAngle(ang)) return "Кут повинен бути гострим (0° < кут < 90°)";
      b     = leg;
      beta  = ang;
      alpha = 90 - beta;
      a     = b * Math.tan(toRad(alpha));
      c     = b / Math.cos(toRad(alpha));
      break;
    }

    // ── leg + opposite angle ───────────────────────────────────────
    // кут alpha протилежний до катета a
    case "leg|opposite angle": {
      const leg = (t1 === "leg") ? v1 : v2;
      const ang = (t1 === "leg") ? v2 : v1;
      if (badAngle(ang)) return "Кут повинен бути гострим (0° < кут < 90°)";
      a     = leg;
      alpha = ang;
      beta  = 90 - alpha;
      b     = a / Math.tan(toRad(alpha));
      c     = a / Math.sin(toRad(alpha));
      break;
    }

    // ── hypotenuse + angle ─────────────────────────────────────────
    case "angle|hypotenuse": {
      const hyp = (t1 === "angle") ? v2 : v1;
      const ang = (t1 === "angle") ? v1 : v2;
      if (badAngle(ang)) return "Кут повинен бути гострим (0° < кут < 90°)";
      c     = hyp;
      alpha = ang;
      beta  = 90 - alpha;
      a     = c * Math.sin(toRad(alpha));
      b     = c * Math.cos(toRad(alpha));
      break;
    }

    // ── incompatible pairs ─────────────────────────────────────────
    default: {
      console.log("Несумісна пара типів. Будь ласка, перечитайте інструкцію.");
      return "failed";
    }
  }

  // 4. round results
  a = round(a); b = round(b); c = round(c);
  alpha = round(alpha); beta = round(beta);

  // 5. sanity check after computation
  if (!isFinite(a) || !isFinite(b) || !isFinite(c) ||
      a <= 0 || b <= 0 || c <= 0 ||
      alpha <= 0 || beta <= 0 || alpha >= 90 || beta >= 90) {
    return "Некоректні вхідні дані (перевірте значення)";
  }

  // 6. output results
  console.log(`a = ${a}`);
  console.log(`b = ${b}`);
  console.log(`c = ${c}`);
  console.log(`alpha = ${alpha}`);
  console.log(`beta = ${beta}`);

  return "success";
}
