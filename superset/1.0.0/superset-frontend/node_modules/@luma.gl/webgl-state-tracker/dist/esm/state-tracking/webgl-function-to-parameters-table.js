import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export default {
  enable: function enable(update, capability) {
    return update(_defineProperty({}, capability, true));
  },
  disable: function disable(update, capability) {
    return update(_defineProperty({}, capability, false));
  },
  pixelStorei: function pixelStorei(update, pname, value) {
    return update(_defineProperty({}, pname, value));
  },
  hint: function hint(update, pname, _hint) {
    return update(_defineProperty({}, pname, _hint));
  },
  bindFramebuffer: function bindFramebuffer(update, target, framebuffer) {
    var _update5;

    switch (target) {
      case 36160:
        return update((_update5 = {}, _defineProperty(_update5, 36006, framebuffer), _defineProperty(_update5, 36010, framebuffer), _update5));

      case 36009:
        return update(_defineProperty({}, 36006, framebuffer));

      case 36008:
        return update(_defineProperty({}, 36010, framebuffer));

      default:
        return null;
    }
  },
  blendColor: function blendColor(update, r, g, b, a) {
    return update(_defineProperty({}, 32773, new Float32Array([r, g, b, a])));
  },
  blendEquation: function blendEquation(update, mode) {
    var _update9;

    return update((_update9 = {}, _defineProperty(_update9, 32777, mode), _defineProperty(_update9, 34877, mode), _update9));
  },
  blendEquationSeparate: function blendEquationSeparate(update, modeRGB, modeAlpha) {
    var _update10;

    return update((_update10 = {}, _defineProperty(_update10, 32777, modeRGB), _defineProperty(_update10, 34877, modeAlpha), _update10));
  },
  blendFunc: function blendFunc(update, src, dst) {
    var _update11;

    return update((_update11 = {}, _defineProperty(_update11, 32969, src), _defineProperty(_update11, 32968, dst), _defineProperty(_update11, 32971, src), _defineProperty(_update11, 32970, dst), _update11));
  },
  blendFuncSeparate: function blendFuncSeparate(update, srcRGB, dstRGB, srcAlpha, dstAlpha) {
    var _update12;

    return update((_update12 = {}, _defineProperty(_update12, 32969, srcRGB), _defineProperty(_update12, 32968, dstRGB), _defineProperty(_update12, 32971, srcAlpha), _defineProperty(_update12, 32970, dstAlpha), _update12));
  },
  clearColor: function clearColor(update, r, g, b, a) {
    return update(_defineProperty({}, 3106, new Float32Array([r, g, b, a])));
  },
  clearDepth: function clearDepth(update, depth) {
    return update(_defineProperty({}, 2931, depth));
  },
  clearStencil: function clearStencil(update, s) {
    return update(_defineProperty({}, 2961, s));
  },
  colorMask: function colorMask(update, r, g, b, a) {
    return update(_defineProperty({}, 3107, [r, g, b, a]));
  },
  cullFace: function cullFace(update, mode) {
    return update(_defineProperty({}, 2885, mode));
  },
  depthFunc: function depthFunc(update, func) {
    return update(_defineProperty({}, 2932, func));
  },
  depthRange: function depthRange(update, zNear, zFar) {
    return update(_defineProperty({}, 2928, new Float32Array([zNear, zFar])));
  },
  depthMask: function depthMask(update, mask) {
    return update(_defineProperty({}, 2930, mask));
  },
  frontFace: function frontFace(update, face) {
    return update(_defineProperty({}, 2886, face));
  },
  lineWidth: function lineWidth(update, width) {
    return update(_defineProperty({}, 2849, width));
  },
  polygonOffset: function polygonOffset(update, factor, units) {
    var _update23;

    return update((_update23 = {}, _defineProperty(_update23, 32824, factor), _defineProperty(_update23, 10752, units), _update23));
  },
  sampleCoverage: function sampleCoverage(update, value, invert) {
    var _update24;

    return update((_update24 = {}, _defineProperty(_update24, 32938, value), _defineProperty(_update24, 32939, invert), _update24));
  },
  scissor: function scissor(update, x, y, width, height) {
    return update(_defineProperty({}, 3088, new Int32Array([x, y, width, height])));
  },
  stencilMask: function stencilMask(update, mask) {
    var _update26;

    return update((_update26 = {}, _defineProperty(_update26, 2968, mask), _defineProperty(_update26, 36005, mask), _update26));
  },
  stencilMaskSeparate: function stencilMaskSeparate(update, face, mask) {
    return update(_defineProperty({}, face === 1028 ? 2968 : 36005, mask));
  },
  stencilFunc: function stencilFunc(update, func, ref, mask) {
    var _update28;

    return update((_update28 = {}, _defineProperty(_update28, 2962, func), _defineProperty(_update28, 2967, ref), _defineProperty(_update28, 2963, mask), _defineProperty(_update28, 34816, func), _defineProperty(_update28, 36003, ref), _defineProperty(_update28, 36004, mask), _update28));
  },
  stencilFuncSeparate: function stencilFuncSeparate(update, face, func, ref, mask) {
    var _update29;

    return update((_update29 = {}, _defineProperty(_update29, face === 1028 ? 2962 : 34816, func), _defineProperty(_update29, face === 1028 ? 2967 : 36003, ref), _defineProperty(_update29, face === 1028 ? 2963 : 36004, mask), _update29));
  },
  stencilOp: function stencilOp(update, fail, zfail, zpass) {
    var _update30;

    return update((_update30 = {}, _defineProperty(_update30, 2964, fail), _defineProperty(_update30, 2965, zfail), _defineProperty(_update30, 2966, zpass), _defineProperty(_update30, 34817, fail), _defineProperty(_update30, 34818, zfail), _defineProperty(_update30, 34819, zpass), _update30));
  },
  stencilOpSeparate: function stencilOpSeparate(update, face, fail, zfail, zpass) {
    var _update31;

    return update((_update31 = {}, _defineProperty(_update31, face === 1028 ? 2964 : 34817, fail), _defineProperty(_update31, face === 1028 ? 2965 : 34818, zfail), _defineProperty(_update31, face === 1028 ? 2966 : 34819, zpass), _update31));
  },
  viewport: function viewport(update, x, y, width, height) {
    return update(_defineProperty({}, 2978, new Int32Array([x, y, width, height])));
  }
};
//# sourceMappingURL=webgl-function-to-parameters-table.js.map