"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObjectEmpty = isObjectEmpty;
exports.isWebGL2 = isWebGL2;

function isObjectEmpty(object) {
  for (var key in object) {
    return false;
  }

  return true;
}

function isWebGL2(gl) {
  return Boolean(gl && gl._version === 2);
}
//# sourceMappingURL=utils.js.map