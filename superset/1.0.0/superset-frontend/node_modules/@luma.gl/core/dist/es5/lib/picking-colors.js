"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodePickingColor = encodePickingColor;
exports.decodePickingColor = decodePickingColor;
exports.getNullPickingColor = getNullPickingColor;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var NULL_PICKING_COLOR = new Uint8Array([0, 0, 0]);

function encodePickingColor(i) {
  return [i + 1 & 255, i + 1 >> 8 & 255, i + 1 >> 16 & 255];
}

function decodePickingColor(color) {
  var _color = (0, _slicedToArray2["default"])(color, 3),
      i1 = _color[0],
      i2 = _color[1],
      i3 = _color[2];

  var index = i1 + i2 * 256 + i3 * 65536 - 1;
  return index;
}

function getNullPickingColor() {
  return NULL_PICKING_COLOR;
}
//# sourceMappingURL=picking-colors.js.map