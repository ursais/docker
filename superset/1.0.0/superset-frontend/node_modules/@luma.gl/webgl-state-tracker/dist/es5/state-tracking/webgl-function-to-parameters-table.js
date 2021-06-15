"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _default = {
  enable: function enable(update, capability) {
    return update((0, _defineProperty2["default"])({}, capability, true));
  },
  disable: function disable(update, capability) {
    return update((0, _defineProperty2["default"])({}, capability, false));
  },
  pixelStorei: function pixelStorei(update, pname, value) {
    return update((0, _defineProperty2["default"])({}, pname, value));
  },
  hint: function hint(update, pname, _hint) {
    return update((0, _defineProperty2["default"])({}, pname, _hint));
  },
  bindFramebuffer: function bindFramebuffer(update, target, framebuffer) {
    var _update5;

    switch (target) {
      case 36160:
        return update((_update5 = {}, (0, _defineProperty2["default"])(_update5, 36006, framebuffer), (0, _defineProperty2["default"])(_update5, 36010, framebuffer), _update5));

      case 36009:
        return update((0, _defineProperty2["default"])({}, 36006, framebuffer));

      case 36008:
        return update((0, _defineProperty2["default"])({}, 36010, framebuffer));

      default:
        return null;
    }
  },
  blendColor: function blendColor(update, r, g, b, a) {
    return update((0, _defineProperty2["default"])({}, 32773, new Float32Array([r, g, b, a])));
  },
  blendEquation: function blendEquation(update, mode) {
    var _update9;

    return update((_update9 = {}, (0, _defineProperty2["default"])(_update9, 32777, mode), (0, _defineProperty2["default"])(_update9, 34877, mode), _update9));
  },
  blendEquationSeparate: function blendEquationSeparate(update, modeRGB, modeAlpha) {
    var _update10;

    return update((_update10 = {}, (0, _defineProperty2["default"])(_update10, 32777, modeRGB), (0, _defineProperty2["default"])(_update10, 34877, modeAlpha), _update10));
  },
  blendFunc: function blendFunc(update, src, dst) {
    var _update11;

    return update((_update11 = {}, (0, _defineProperty2["default"])(_update11, 32969, src), (0, _defineProperty2["default"])(_update11, 32968, dst), (0, _defineProperty2["default"])(_update11, 32971, src), (0, _defineProperty2["default"])(_update11, 32970, dst), _update11));
  },
  blendFuncSeparate: function blendFuncSeparate(update, srcRGB, dstRGB, srcAlpha, dstAlpha) {
    var _update12;

    return update((_update12 = {}, (0, _defineProperty2["default"])(_update12, 32969, srcRGB), (0, _defineProperty2["default"])(_update12, 32968, dstRGB), (0, _defineProperty2["default"])(_update12, 32971, srcAlpha), (0, _defineProperty2["default"])(_update12, 32970, dstAlpha), _update12));
  },
  clearColor: function clearColor(update, r, g, b, a) {
    return update((0, _defineProperty2["default"])({}, 3106, new Float32Array([r, g, b, a])));
  },
  clearDepth: function clearDepth(update, depth) {
    return update((0, _defineProperty2["default"])({}, 2931, depth));
  },
  clearStencil: function clearStencil(update, s) {
    return update((0, _defineProperty2["default"])({}, 2961, s));
  },
  colorMask: function colorMask(update, r, g, b, a) {
    return update((0, _defineProperty2["default"])({}, 3107, [r, g, b, a]));
  },
  cullFace: function cullFace(update, mode) {
    return update((0, _defineProperty2["default"])({}, 2885, mode));
  },
  depthFunc: function depthFunc(update, func) {
    return update((0, _defineProperty2["default"])({}, 2932, func));
  },
  depthRange: function depthRange(update, zNear, zFar) {
    return update((0, _defineProperty2["default"])({}, 2928, new Float32Array([zNear, zFar])));
  },
  depthMask: function depthMask(update, mask) {
    return update((0, _defineProperty2["default"])({}, 2930, mask));
  },
  frontFace: function frontFace(update, face) {
    return update((0, _defineProperty2["default"])({}, 2886, face));
  },
  lineWidth: function lineWidth(update, width) {
    return update((0, _defineProperty2["default"])({}, 2849, width));
  },
  polygonOffset: function polygonOffset(update, factor, units) {
    var _update23;

    return update((_update23 = {}, (0, _defineProperty2["default"])(_update23, 32824, factor), (0, _defineProperty2["default"])(_update23, 10752, units), _update23));
  },
  sampleCoverage: function sampleCoverage(update, value, invert) {
    var _update24;

    return update((_update24 = {}, (0, _defineProperty2["default"])(_update24, 32938, value), (0, _defineProperty2["default"])(_update24, 32939, invert), _update24));
  },
  scissor: function scissor(update, x, y, width, height) {
    return update((0, _defineProperty2["default"])({}, 3088, new Int32Array([x, y, width, height])));
  },
  stencilMask: function stencilMask(update, mask) {
    var _update26;

    return update((_update26 = {}, (0, _defineProperty2["default"])(_update26, 2968, mask), (0, _defineProperty2["default"])(_update26, 36005, mask), _update26));
  },
  stencilMaskSeparate: function stencilMaskSeparate(update, face, mask) {
    return update((0, _defineProperty2["default"])({}, face === 1028 ? 2968 : 36005, mask));
  },
  stencilFunc: function stencilFunc(update, func, ref, mask) {
    var _update28;

    return update((_update28 = {}, (0, _defineProperty2["default"])(_update28, 2962, func), (0, _defineProperty2["default"])(_update28, 2967, ref), (0, _defineProperty2["default"])(_update28, 2963, mask), (0, _defineProperty2["default"])(_update28, 34816, func), (0, _defineProperty2["default"])(_update28, 36003, ref), (0, _defineProperty2["default"])(_update28, 36004, mask), _update28));
  },
  stencilFuncSeparate: function stencilFuncSeparate(update, face, func, ref, mask) {
    var _update29;

    return update((_update29 = {}, (0, _defineProperty2["default"])(_update29, face === 1028 ? 2962 : 34816, func), (0, _defineProperty2["default"])(_update29, face === 1028 ? 2967 : 36003, ref), (0, _defineProperty2["default"])(_update29, face === 1028 ? 2963 : 36004, mask), _update29));
  },
  stencilOp: function stencilOp(update, fail, zfail, zpass) {
    var _update30;

    return update((_update30 = {}, (0, _defineProperty2["default"])(_update30, 2964, fail), (0, _defineProperty2["default"])(_update30, 2965, zfail), (0, _defineProperty2["default"])(_update30, 2966, zpass), (0, _defineProperty2["default"])(_update30, 34817, fail), (0, _defineProperty2["default"])(_update30, 34818, zfail), (0, _defineProperty2["default"])(_update30, 34819, zpass), _update30));
  },
  stencilOpSeparate: function stencilOpSeparate(update, face, fail, zfail, zpass) {
    var _update31;

    return update((_update31 = {}, (0, _defineProperty2["default"])(_update31, face === 1028 ? 2964 : 34817, fail), (0, _defineProperty2["default"])(_update31, face === 1028 ? 2965 : 34818, zfail), (0, _defineProperty2["default"])(_update31, face === 1028 ? 2966 : 34819, zpass), _update31));
  },
  viewport: function viewport(update, x, y, width, height) {
    return update((0, _defineProperty2["default"])({}, 2978, new Int32Array([x, y, width, height])));
  }
};
exports["default"] = _default;
//# sourceMappingURL=webgl-function-to-parameters-table.js.map