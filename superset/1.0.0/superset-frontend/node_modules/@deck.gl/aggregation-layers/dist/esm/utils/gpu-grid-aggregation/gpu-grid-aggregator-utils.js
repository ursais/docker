import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Framebuffer, Texture2D } from '@luma.gl/core';
export function getFloatTexture(gl, opts) {
  var _parameters;

  var _opts$width = opts.width,
      width = _opts$width === void 0 ? 1 : _opts$width,
      _opts$height = opts.height,
      height = _opts$height === void 0 ? 1 : _opts$height;
  var texture = new Texture2D(gl, {
    data: null,
    format: 34836,
    type: 5126,
    border: 0,
    mipmaps: false,
    parameters: (_parameters = {}, _defineProperty(_parameters, 10240, 9728), _defineProperty(_parameters, 10241, 9728), _parameters),
    dataFormat: 6408,
    width: width,
    height: height
  });
  return texture;
}
export function getFramebuffer(gl, opts) {
  var id = opts.id,
      _opts$width2 = opts.width,
      width = _opts$width2 === void 0 ? 1 : _opts$width2,
      _opts$height2 = opts.height,
      height = _opts$height2 === void 0 ? 1 : _opts$height2,
      texture = opts.texture;
  var fb = new Framebuffer(gl, {
    id: id,
    width: width,
    height: height,
    attachments: _defineProperty({}, 36064, texture)
  });
  return fb;
}
export function getFloatArray(array, size) {
  var fillValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!array || array.length < size) {
    return new Float32Array(size).fill(fillValue);
  }

  return array;
}
//# sourceMappingURL=gpu-grid-aggregator-utils.js.map