/* ════════════════════════════════════════════════════════════
   lab2.js — Лабораторна робота №2
   Об'єктно-орієнтоване програмування у JavaScript
   ════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   ЧАСТИНА 1 (1.2.3 – 1.2.10): БЕЗ синтаксису класів ES6
   ────────────────────────────────────────────────────────── */

console.log("═══ 1.2.3 — car1 (new Object()) ═══");

// 1.2.3 — car1 через new Object()
var car1 = new Object();
car1.color = "red";
car1.maxSpeed = 220;
car1.driver = new Object();
car1.driver.name = "Ivan Petrenko";
car1.driver.category = "C";
car1.driver["personal limitations"] = "No driving at night";
car1.tuning = true;
car1["number of accidents"] = 0;

console.log(car1);

// ──────────────────────────────────────────────────────────
console.log("═══ 1.2.4 — car2 (literal) ═══");

// 1.2.4 — car2 через літерал об'єкта
var car2 = {
  color: "blue",
  maxSpeed: 180,
  driver: {
    name: "Ivan Petrenko",
    category: "B",
    "personal limitations": null
  },
  tuning: false,
  "number of accidents": 2
};

console.log(car2);

// ──────────────────────────────────────────────────────────
console.log("═══ 1.2.5 — car1.drive() ═══");

// 1.2.5 — метод drive для car1
car1.drive = function() {
  console.log("I am not driving at night");
};
car1.drive();

// ──────────────────────────────────────────────────────────
console.log("═══ 1.2.6 — car2.drive() ═══");

// 1.2.6 — метод drive для car2
car2.drive = function() {
  console.log("I can drive anytime");
};
car2.drive();

// ──────────────────────────────────────────────────────────
console.log("═══ 1.2.7 — Конструктор Truck ═══");

// 1.2.7 — конструктор Truck
function Truck(color, weight, avgSpeed, brand, model) {
  this.color    = color;
  this.weight   = weight;
  this.avgSpeed = avgSpeed;
  this.brand    = brand;
  this.model    = model;

  // 1.2.9 — метод trip всередині конструктора
  this.trip = function() {
    if (!this.driver) {
      console.log("No driver assigned");
      return;
    }
    var nightPart = this.driver.nightDriving
      ? "drives at night"
      : "does not drive at night";
    console.log(
      "Driver " + this.driver.name +
      " " + nightPart +
      " and has " + this.driver.experience + " years of experience"
    );
  };
}

// 1.2.8 — AssignDriver через prototype
Truck.prototype.AssignDriver = function(name, nightDriving, experience) {
  this.driver = {
    name:         name,
    nightDriving: nightDriving,
    experience:   experience
  };
};

// ──────────────────────────────────────────────────────────
console.log("═══ 1.2.10 — Два об'єкти Truck ═══");

// 1.2.10 — два об'єкти Truck
var truck1 = new Truck("white", 8000, 90.5, "Volvo", "FH16");
var truck2 = new Truck("black", 12000, 80.0, "Scania", "R500");

truck1.AssignDriver("Ivan Petrenko", true,  7);
truck2.AssignDriver("Ivan Petrenko", false, 3);

truck1.trip();   // drives at night
truck2.trip();   // does not drive at night

// truck без водія — демонстрація
var truck3 = new Truck("gray", 5000, 70, "MAN", "TGX");
truck3.trip();   // No driver assigned


/* ──────────────────────────────────────────────────────────
   ЧАСТИНА 2 (1.2.12 – 1.2.24): ES6 класи
   ────────────────────────────────────────────────────────── */

// ── 1.2.12–1.2.15 — Square ────────────────────────────────
class Square {
  constructor(a) {
    this.a = a;
  }

  static help() {
    console.log(
      "Square — правильний чотирикутник. " +
      "Усі 4 сторони рівні, усі 4 кути = 90°. " +
      "Периметр = 4·a, Площа = a²."
    );
  }

  length() {
    console.log("Периметр квадрата: " + 4 * this.a);
  }

  square() {
    console.log("Площа квадрата: " + this.a * this.a);
  }

  info() {
    console.log("── Square info ──");
    console.log("Сторони: a = b = c = d = " + this.a);
    console.log("Кути: всі = 90°");
    console.log("Периметр: " + 4 * this.a);
    console.log("Площа: " + this.a * this.a);
  }
}

// ── 1.2.16–1.2.17 — Rectangle extends Square ──────────────
class Rectangle extends Square {
  constructor(a, b) {
    super(a);
    this.b = b;
  }

  static help() {
    console.log(
      "Rectangle — прямокутник. " +
      "Протилежні сторони рівні, всі кути = 90°. " +
      "Периметр = 2·(a+b), Площа = a·b."
    );
  }

  length() {
    console.log("Периметр прямокутника: " + 2 * (this.a + this.b));
  }

  square() {
    console.log("Площа прямокутника: " + this.a * this.b);
  }

  info() {
    console.log("── Rectangle info ──");
    console.log("Сторони: a = c = " + this.a + ", b = d = " + this.b);
    console.log("Кути: всі = 90°");
    console.log("Периметр: " + 2 * (this.a + this.b));
    console.log("Площа: " + this.a * this.b);
  }
}

// ── 1.2.18–1.2.19 — Rhombus extends Square ────────────────
class Rhombus extends Square {
  constructor(a, alpha, beta) {
    super(a);
    this.alpha = alpha;   // тупий кут
    this.beta  = beta;    // гострий кут
  }

  static help() {
    console.log(
      "Rhombus — ромб. " +
      "Усі 4 сторони рівні, протилежні кути рівні, " +
      "сума сусідніх кутів = 180°. " +
      "Периметр = 4·a, Площа = a²·sin(alpha)."
    );
  }

  length() {
    console.log("Периметр ромба: " + 4 * this.a);
  }

  square() {
    var s = this.a * this.a * Math.sin(this.alpha * Math.PI / 180);
    console.log("Площа ромба: " + s.toFixed(4));
  }

  info() {
    var s = this.a * this.a * Math.sin(this.alpha * Math.PI / 180);
    console.log("── Rhombus info ──");
    console.log("Сторони: a = b = c = d = " + this.a);
    console.log("Кути: alpha = gamma = " + this.alpha + "°, beta = delta = " + this.beta + "°");
    console.log("Периметр: " + 4 * this.a);
    console.log("Площа: " + s.toFixed(4));
  }
}

// ── 1.2.20–1.2.21 — Parallelogram extends Rectangle ───────
// (Rectangle НЕ є базою для Parallelogram → Rhombus отримає геттери/сеттери)
class Parallelogram extends Rectangle {
  constructor(a, b, alpha, beta) {
    super(a, b);
    this.alpha = alpha;
    this.beta  = beta;
  }

  static help() {
    console.log(
      "Parallelogram — паралелограм. " +
      "Протилежні сторони та кути рівні, сума сусідніх кутів = 180°. " +
      "Периметр = 2·(a+b), Площа = a·b·sin(alpha)."
    );
  }

  length() {
    console.log("Периметр паралелограма: " + 2 * (this.a + this.b));
  }

  square() {
    var s = this.a * this.b * Math.sin(this.alpha * Math.PI / 180);
    console.log("Площа паралелограма: " + s.toFixed(4));
  }

  info() {
    var s = this.a * this.b * Math.sin(this.alpha * Math.PI / 180);
    console.log("── Parallelogram info ──");
    console.log("Сторони: a = c = " + this.a + ", b = d = " + this.b);
    console.log("Кути: alpha = gamma = " + this.alpha + "°, beta = delta = " + this.beta + "°");
    console.log("Периметр: " + 2 * (this.a + this.b));
    console.log("Площа: " + s.toFixed(4));
  }
}

// ── 1.2.22 — геттери та сеттери для Rhombus ───────────────
// (Rhombus — той клас, що НЕ є базою для Parallelogram)
class RhombusGS extends Rhombus {
  constructor(a, alpha, beta) {
    super(a, alpha, beta);
    this._a     = a;
    this._alpha = alpha;
    this._beta  = beta;
  }

  get a()     { return this._a; }
  set a(val)  { if (val > 0) this._a = val; }

  get alpha()     { return this._alpha; }
  set alpha(val)  { if (val > 90 && val < 180) this._alpha = val; }

  get beta()     { return this._beta; }
  set beta(val)  { if (val > 0 && val < 90) this._beta = val; }
}

// ── 1.2.23 — виклик статичного help для кожного класу ─────
console.log("═══ 1.2.23 — static help() ═══");
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

// ── 1.2.24 — об'єкти та виклик info() ────────────────────
console.log("═══ 1.2.24 — info() для кожного об'єкта ═══");

var sq   = new Square(5);
var rect = new Rectangle(6, 4);
var rhom = new RhombusGS(7, 120, 60);
var para = new Parallelogram(8, 5, 110, 70);

sq.info();
rect.info();
rhom.info();
para.info();


/* ──────────────────────────────────────────────────────────
   ЧАСТИНА 3 (1.2.25 – 1.2.31): функції вищого порядку
   ────────────────────────────────────────────────────────── */

// ── 1.2.25–1.2.26 — Triangular ────────────────────────────
console.log("═══ 1.2.25–1.2.26 — Triangular ═══");

function Triangular({ a = 3, b = 4, c = 5 } = {}) {
  return { a, b, c };
}

var tri1 = Triangular({});                  // default (3,4,5)
var tri2 = Triangular({ a: 5, b: 12, c: 13 });
var tri3 = Triangular({ a: 7, b: 24, c: 25 });

console.log(tri1);
console.log(tri2);
console.log(tri3);

// ── 1.2.27–1.2.28 — PiMultiplier ──────────────────────────
console.log("═══ 1.2.27–1.2.28 — PiMultiplier ═══");

function PiMultiplier(factor) {
  return function() {
    return Math.PI * factor;
  };
}

var piTimes2    = PiMultiplier(2);
var piTimes2o3  = PiMultiplier(2 / 3);
var piDiv2      = PiMultiplier(1 / 2);

console.log("π × 2    = " + piTimes2());
console.log("π × 2/3  = " + piTimes2o3());
console.log("π ÷ 2    = " + piDiv2());

// ── 1.2.29–1.2.31 — Painter ───────────────────────────────
console.log("═══ 1.2.29–1.2.31 — Painter ═══");

function Painter(color) {
  return function(obj) {
    var type = (obj && obj.type !== undefined)
      ? obj.type
      : "No 'type' property occurred!";
    console.log("Color: " + color + " | Type: " + type);
  };
}

var PaintBlue   = Painter("blue");
var PaintRed    = Painter("red");
var PaintYellow = Painter("yellow");

// тестові об'єкти з таблиці 12
var testObj1 = { maxSpeed: 280, type: "Sportcar",  color: "magenta" };
var testObj2 = { type: "Truck", "avg speed": 90, "load capacity": 2400 };
var testObj3 = { maxSpeed: 180, color: "purple", isCar: true };  // без type

[testObj1, testObj2, testObj3].forEach(function(obj, i) {
  console.log("-- Object " + (i + 1) + " --");
  PaintBlue(obj);
  PaintRed(obj);
  PaintYellow(obj);
});
