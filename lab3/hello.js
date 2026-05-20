// hello.js — IIFE library that exposes sayHello to the global scope
// The inner variable speakWord stays local (not leaked globally)

var sayHello = (function () {
  var speakWord = "Hello";

  return function (name) {
    console.log(speakWord + " " + name);
  };
})();
