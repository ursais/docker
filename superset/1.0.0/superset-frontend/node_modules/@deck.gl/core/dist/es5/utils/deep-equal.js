"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepEqual = deepEqual;

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  return Object.keys(a).every(function (key) {
    if (Array.isArray(a[key]) && Array.isArray(b[key])) {
      return deepEqual(a[key], b[key]);
    }

    return a[key] === b[key];
  });
}
//# sourceMappingURL=deep-equal.js.map