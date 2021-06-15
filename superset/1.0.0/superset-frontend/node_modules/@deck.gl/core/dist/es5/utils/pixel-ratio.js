"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPixelRatio;

var _assert = _interopRequireDefault(require("../utils/assert"));

function getPixelRatio(useDevicePixels) {
  (0, _assert.default)(typeof useDevicePixels === 'boolean', 'Invalid useDevicePixels');
  return useDevicePixels && typeof window !== 'undefined' ? window.devicePixelRatio : 1;
}
//# sourceMappingURL=pixel-ratio.js.map