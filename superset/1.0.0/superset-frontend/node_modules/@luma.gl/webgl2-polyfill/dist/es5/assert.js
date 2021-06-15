"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = assert;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'webgl2-polyfill: assertion failed.');
  }
}
//# sourceMappingURL=assert.js.map