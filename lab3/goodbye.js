// goodbye.js — IIFE library that exposes sayGoodbye to the global scope
// The inner variable speakWord stays local (not leaked globally)

var sayGoodbye = (function () {
  var speakWord = "Goodbye";

  return function (name) {
    console.log(speakWord + " " + name);
  };
})();
