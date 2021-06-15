"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = deepArrayEqual;

function deepArrayEqual(x, y) {
  if (x === y) {
    return true;
  }

  var isArrayX = Array.isArray(x) || ArrayBuffer.isView(x);
  var isArrayY = Array.isArray(y) || ArrayBuffer.isView(y);

  if (isArrayX && isArrayY && x.length === y.length) {
    for (var i = 0; i < x.length; ++i) {
      if (x[i] !== y[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
}
//# sourceMappingURL=deep-array-equal.js.map