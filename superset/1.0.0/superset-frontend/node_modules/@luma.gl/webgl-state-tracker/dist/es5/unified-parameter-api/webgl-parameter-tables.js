"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GL_PARAMETER_GETTERS = exports.GL_COMPOSITE_PARAMETER_SETTERS = exports.GL_PARAMETER_SETTERS = exports.GL_PARAMETER_DEFAULTS = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("../utils");

var _GL_PARAMETER_DEFAULT, _GL_PARAMETER_SETTERS, _GL_PARAMETER_GETTERS;

var GL_PARAMETER_DEFAULTS = (_GL_PARAMETER_DEFAULT = {}, (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3042, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32773, new Float32Array([0, 0, 0, 0])), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32777, 32774), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 34877, 32774), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32969, 1), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32968, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32971, 1), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32970, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3106, new Float32Array([0, 0, 0, 0])), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3107, [true, true, true, true]), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2884, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2885, 1029), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2929, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2931, 1), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2932, 513), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2928, new Float32Array([0, 1])), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2930, true), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3024, true), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 36006, null), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2886, 2305), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 33170, 4352), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2849, 1), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32823, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32824, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 10752, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32938, 1.0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32939, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3089, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3088, new Int32Array([0, 0, 1024, 1024])), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2960, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2961, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2968, 0xffffffff), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 36005, 0xffffffff), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2962, 519), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2967, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2963, 0xffffffff), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 34816, 519), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 36003, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 36004, 0xffffffff), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2964, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2965, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2966, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 34817, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 34818, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 34819, 7680), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 2978, new Int32Array([0, 0, 1024, 1024])), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3333, 4), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3317, 4), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 37440, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 37441, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 37443, 37444), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 35723, 4352), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 36010, null), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 35977, false), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3330, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3332, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3331, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3314, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32878, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3316, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 3315, 0), (0, _defineProperty2["default"])(_GL_PARAMETER_DEFAULT, 32877, 0), _GL_PARAMETER_DEFAULT);
exports.GL_PARAMETER_DEFAULTS = GL_PARAMETER_DEFAULTS;

var enable = function enable(gl, value, key) {
  return value ? gl.enable(key) : gl.disable(key);
};

var hint = function hint(gl, value, key) {
  return gl.hint(key, value);
};

var pixelStorei = function pixelStorei(gl, value, key) {
  return gl.pixelStorei(key, value);
};

var drawFramebuffer = function drawFramebuffer(gl, value) {
  var target = (0, _utils.isWebGL2)(gl) ? 36009 : 36160;
  return gl.bindFramebuffer(target, value);
};

var readFramebuffer = function readFramebuffer(gl, value) {
  return gl.bindFramebuffer(36008, value);
};

var GL_PARAMETER_SETTERS = (_GL_PARAMETER_SETTERS = {}, (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3042, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32773, function (gl, value) {
  return gl.blendColor.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32777, 'blendEquation'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 34877, 'blendEquation'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32969, 'blendFunc'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32968, 'blendFunc'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32971, 'blendFunc'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32970, 'blendFunc'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3106, function (gl, value) {
  return gl.clearColor.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3107, function (gl, value) {
  return gl.colorMask.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2884, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2885, function (gl, value) {
  return gl.cullFace(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2929, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2931, function (gl, value) {
  return gl.clearDepth(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2932, function (gl, value) {
  return gl.depthFunc(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2928, function (gl, value) {
  return gl.depthRange.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2930, function (gl, value) {
  return gl.depthMask(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3024, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 35723, hint), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 36006, drawFramebuffer), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2886, function (gl, value) {
  return gl.frontFace(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 33170, hint), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2849, function (gl, value) {
  return gl.lineWidth(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32823, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32824, 'polygonOffset'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 10752, 'polygonOffset'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 35977, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32938, 'sampleCoverage'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32939, 'sampleCoverage'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3089, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3088, function (gl, value) {
  return gl.scissor.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2960, enable), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2961, function (gl, value) {
  return gl.clearStencil(value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2968, function (gl, value) {
  return gl.stencilMaskSeparate(1028, value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 36005, function (gl, value) {
  return gl.stencilMaskSeparate(1029, value);
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2962, 'stencilFuncFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2967, 'stencilFuncFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2963, 'stencilFuncFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 34816, 'stencilFuncBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 36003, 'stencilFuncBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 36004, 'stencilFuncBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2964, 'stencilOpFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2965, 'stencilOpFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2966, 'stencilOpFront'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 34817, 'stencilOpBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 34818, 'stencilOpBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 34819, 'stencilOpBack'), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 2978, function (gl, value) {
  return gl.viewport.apply(gl, (0, _toConsumableArray2["default"])(value));
}), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3333, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3317, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 37440, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 37441, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 37443, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3330, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3332, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3331, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 36010, readFramebuffer), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3314, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32878, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3316, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 3315, pixelStorei), (0, _defineProperty2["default"])(_GL_PARAMETER_SETTERS, 32877, pixelStorei), _GL_PARAMETER_SETTERS);
exports.GL_PARAMETER_SETTERS = GL_PARAMETER_SETTERS;
var GL_COMPOSITE_PARAMETER_SETTERS = {
  blendEquation: function blendEquation(gl, values) {
    return gl.blendEquationSeparate(values[32777], values[34877]);
  },
  blendFunc: function blendFunc(gl, values) {
    return gl.blendFuncSeparate(values[32969], values[32968], values[32971], values[32970]);
  },
  polygonOffset: function polygonOffset(gl, values) {
    return gl.polygonOffset(values[32824], values[10752]);
  },
  sampleCoverage: function sampleCoverage(gl, values) {
    return gl.sampleCoverage(values[32938], values[32939]);
  },
  stencilFuncFront: function stencilFuncFront(gl, values) {
    return gl.stencilFuncSeparate(1028, values[2962], values[2967], values[2963]);
  },
  stencilFuncBack: function stencilFuncBack(gl, values) {
    return gl.stencilFuncSeparate(1029, values[34816], values[36003], values[36004]);
  },
  stencilOpFront: function stencilOpFront(gl, values) {
    return gl.stencilOpSeparate(1028, values[2964], values[2965], values[2966]);
  },
  stencilOpBack: function stencilOpBack(gl, values) {
    return gl.stencilOpSeparate(1029, values[34817], values[34818], values[34819]);
  }
};
exports.GL_COMPOSITE_PARAMETER_SETTERS = GL_COMPOSITE_PARAMETER_SETTERS;

var isEnabled = function isEnabled(gl, key) {
  return gl.isEnabled(key);
};

var GL_PARAMETER_GETTERS = (_GL_PARAMETER_GETTERS = {}, (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 3042, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 2884, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 2929, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 3024, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 32823, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 32926, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 32928, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 3089, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 2960, isEnabled), (0, _defineProperty2["default"])(_GL_PARAMETER_GETTERS, 35977, isEnabled), _GL_PARAMETER_GETTERS);
exports.GL_PARAMETER_GETTERS = GL_PARAMETER_GETTERS;
//# sourceMappingURL=webgl-parameter-tables.js.map