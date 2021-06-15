"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isOldIE;

var _globals = require("./globals");

function isOldIE() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigator = _globals.window.navigator || {};
  var userAgent = opts.userAgent || navigator.userAgent || '';
  var isMSIE = userAgent.indexOf('MSIE ') !== -1;
  var isTrident = userAgent.indexOf('Trident/') !== -1;
  return isMSIE || isTrident;
}
//# sourceMappingURL=is-old-ie.js.map