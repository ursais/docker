"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function isElectron() {
  if (typeof window !== 'undefined' && (0, _typeof2["default"])(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  }

  if (typeof process !== 'undefined' && (0, _typeof2["default"])(process.versions) === 'object' && Boolean(process.versions.electron)) {
    return true;
  }

  if ((typeof navigator === "undefined" ? "undefined" : (0, _typeof2["default"])(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

var _default = isElectron();

exports["default"] = _default;
//# sourceMappingURL=is-electron.js.map