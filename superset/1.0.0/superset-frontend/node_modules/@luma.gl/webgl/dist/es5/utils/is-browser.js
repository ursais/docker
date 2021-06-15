"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.isBrowserMainThread = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _isElectron = _interopRequireDefault(require("./is-electron"));

var isNode = (typeof process === "undefined" ? "undefined" : (0, _typeof2["default"])(process)) === 'object' && String(process) === '[object process]' && !process.browser;
var isBrowser = !isNode || _isElectron["default"];
var isBrowserMainThread = isBrowser && typeof document !== 'undefined';
exports.isBrowserMainThread = isBrowserMainThread;
var _default = isBrowser;
exports["default"] = _default;
//# sourceMappingURL=is-browser.js.map