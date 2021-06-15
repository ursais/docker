"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

function isArray(array) {
  return Array.isArray(array) || ArrayBuffer.isView(array);
}

var _default = {
  framebuffer: function framebuffer(gl, _framebuffer) {
    var handle = _framebuffer && 'handle' in _framebuffer ? _framebuffer.handle : _framebuffer;
    return gl.bindFramebuffer(36160, handle);
  },
  blend: function blend(gl, value) {
    return value ? gl.enable(3042) : gl.disable(3042);
  },
  blendColor: function blendColor(gl, value) {
    return gl.blendColor.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  blendEquation: function blendEquation(gl, args) {
    args = isArray(args) ? args : [args, args];
    gl.blendEquationSeparate.apply(gl, (0, _toConsumableArray2["default"])(args));
  },
  blendFunc: function blendFunc(gl, args) {
    args = isArray(args) && args.length === 2 ? [].concat((0, _toConsumableArray2["default"])(args), (0, _toConsumableArray2["default"])(args)) : args;
    gl.blendFuncSeparate.apply(gl, (0, _toConsumableArray2["default"])(args));
  },
  clearColor: function clearColor(gl, value) {
    return gl.clearColor.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  clearDepth: function clearDepth(gl, value) {
    return gl.clearDepth(value);
  },
  clearStencil: function clearStencil(gl, value) {
    return gl.clearStencil(value);
  },
  colorMask: function colorMask(gl, value) {
    return gl.colorMask.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  cull: function cull(gl, value) {
    return value ? gl.enable(2884) : gl.disable(2884);
  },
  cullFace: function cullFace(gl, value) {
    return gl.cullFace(value);
  },
  depthTest: function depthTest(gl, value) {
    return value ? gl.enable(2929) : gl.disable(2929);
  },
  depthFunc: function depthFunc(gl, value) {
    return gl.depthFunc(value);
  },
  depthMask: function depthMask(gl, value) {
    return gl.depthMask(value);
  },
  depthRange: function depthRange(gl, value) {
    return gl.depthRange.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  dither: function dither(gl, value) {
    return value ? gl.enable(3024) : gl.disable(3024);
  },
  derivativeHint: function derivativeHint(gl, value) {
    gl.hint(35723, value);
  },
  frontFace: function frontFace(gl, value) {
    return gl.frontFace(value);
  },
  mipmapHint: function mipmapHint(gl, value) {
    return gl.hint(33170, value);
  },
  lineWidth: function lineWidth(gl, value) {
    return gl.lineWidth(value);
  },
  polygonOffsetFill: function polygonOffsetFill(gl, value) {
    return value ? gl.enable(32823) : gl.disable(32823);
  },
  polygonOffset: function polygonOffset(gl, value) {
    return gl.polygonOffset.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  sampleCoverage: function sampleCoverage(gl, value) {
    return gl.sampleCoverage.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  scissorTest: function scissorTest(gl, value) {
    return value ? gl.enable(3089) : gl.disable(3089);
  },
  scissor: function scissor(gl, value) {
    return gl.scissor.apply(gl, (0, _toConsumableArray2["default"])(value));
  },
  stencilTest: function stencilTest(gl, value) {
    return value ? gl.enable(2960) : gl.disable(2960);
  },
  stencilMask: function stencilMask(gl, value) {
    value = isArray(value) ? value : [value, value];

    var _value = value,
        _value2 = (0, _slicedToArray2["default"])(_value, 2),
        mask = _value2[0],
        backMask = _value2[1];

    gl.stencilMaskSeparate(1028, mask);
    gl.stencilMaskSeparate(1029, backMask);
  },
  stencilFunc: function stencilFunc(gl, args) {
    args = isArray(args) && args.length === 3 ? [].concat((0, _toConsumableArray2["default"])(args), (0, _toConsumableArray2["default"])(args)) : args;

    var _args = args,
        _args2 = (0, _slicedToArray2["default"])(_args, 6),
        func = _args2[0],
        ref = _args2[1],
        mask = _args2[2],
        backFunc = _args2[3],
        backRef = _args2[4],
        backMask = _args2[5];

    gl.stencilFuncSeparate(1028, func, ref, mask);
    gl.stencilFuncSeparate(1029, backFunc, backRef, backMask);
  },
  stencilOp: function stencilOp(gl, args) {
    args = isArray(args) && args.length === 3 ? [].concat((0, _toConsumableArray2["default"])(args), (0, _toConsumableArray2["default"])(args)) : args;

    var _args3 = args,
        _args4 = (0, _slicedToArray2["default"])(_args3, 6),
        sfail = _args4[0],
        dpfail = _args4[1],
        dppass = _args4[2],
        backSfail = _args4[3],
        backDpfail = _args4[4],
        backDppass = _args4[5];

    gl.stencilOpSeparate(1028, sfail, dpfail, dppass);
    gl.stencilOpSeparate(1029, backSfail, backDpfail, backDppass);
  },
  viewport: function viewport(gl, value) {
    return gl.viewport.apply(gl, (0, _toConsumableArray2["default"])(value));
  }
};
exports["default"] = _default;
//# sourceMappingURL=webgl-setter-function-table.js.map