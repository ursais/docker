"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.document = exports.global = exports.window = exports.isBrowser = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var isBrowser = (typeof process === "undefined" ? "undefined" : (0, _typeof2.default)(process)) !== 'object' || String(process) !== '[object process]' || process.browser;
exports.isBrowser = isBrowser;
var window_ = typeof window !== 'undefined' ? window : global;
exports.window = window_;
var global_ = typeof global !== 'undefined' ? global : window;
exports.global = global_;
var document_ = typeof document !== 'undefined' ? document : {};
exports.document = document_;
//# sourceMappingURL=globals.js.map