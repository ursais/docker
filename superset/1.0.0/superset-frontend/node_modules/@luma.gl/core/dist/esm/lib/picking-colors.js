import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
var NULL_PICKING_COLOR = new Uint8Array([0, 0, 0]);
export function encodePickingColor(i) {
  return [i + 1 & 255, i + 1 >> 8 & 255, i + 1 >> 16 & 255];
}
export function decodePickingColor(color) {
  var _color = _slicedToArray(color, 3),
      i1 = _color[0],
      i2 = _color[1],
      i3 = _color[2];

  var index = i1 + i2 * 256 + i3 * 65536 - 1;
  return index;
}
export function getNullPickingColor() {
  return NULL_PICKING_COLOR;
}
//# sourceMappingURL=picking-colors.js.map