"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compodoc = require("./compodoc");

Object.keys(_compodoc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compodoc[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _compodoc[key];
    }
  });
});