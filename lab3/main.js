// main.js

// ─── Task 1.2.2 ────────────────────────────────────────────────────────────
// The array is wrapped in an IIFE so it never enters the global scope.
// sayHello / sayGoodbye come from the two external library files.

(function () {
  var names = [
    "Alice", "Bob", "Charlie", "James",
    "Diana", "Jack", "Eve", "John", "Frank", "Julia"
  ];

  console.log("=== Task 1.2.2 — Hello / Goodbye by first letter ===");

  names.forEach(function (name) {
    // charAt(0) returns the first character; toLowerCase() normalises case
    if (name.charAt(0).toLowerCase() === "j") {
      sayGoodbye(name);
    } else {
      sayHello(name);
    }
  });
})();


// ─── Task 1.2.3 ────────────────────────────────────────────────────────────
// New selection criterion: sum of ASCII codes of all letters in the name.
// Names whose ASCII sum is >= 500 get "Hello"; the rest get "Goodbye".
// A higher threshold means longer / "heavier" names are greeted warmly.

(function () {
  var names = [
    "Alice", "Bob", "Charlie", "James",
    "Diana", "Jack", "Eve", "John", "Frank", "Julia",
    "Maximilian", "Ed", "Stephanie", "Tom", "Bartholomew"
  ];

  var THRESHOLD = 500;

  console.log(
    "\n=== Task 1.2.3 — Hello / Goodbye by ASCII-sum threshold (" +
      THRESHOLD + ") ==="
  );
  console.log(
    "Approach: compute the sum of char-codes for every letter in a name.\n" +
    "Names with sum >= " + THRESHOLD + " → Hello; below → Goodbye.\n"
  );

  names.forEach(function (name) {
    var asciiSum = 0;
    for (var i = 0; i < name.length; i++) {
      asciiSum += name.charCodeAt(i);
    }

    console.log(
      name + " (ASCII sum = " + asciiSum + "): " +
      (asciiSum >= THRESHOLD ? "Hello " : "Goodbye ") + name
    );
  });
})();
