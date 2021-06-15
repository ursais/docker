"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fp64ify", {
  enumerable: true,
  get: function get() {
    return _fp64Utils.fp64ify;
  }
});
Object.defineProperty(exports, "fp64LowPart", {
  enumerable: true,
  get: function get() {
    return _fp64Utils.fp64LowPart;
  }
});
Object.defineProperty(exports, "fp64ifyMatrix4", {
  enumerable: true,
  get: function get() {
    return _fp64Utils.fp64ifyMatrix4;
  }
});
exports.fp64fs = exports.fp64arithmetic = exports["default"] = void 0;

var _fp64Utils = require("./fp64-utils");

var _fp64Arithmetic = _interopRequireDefault(require("./fp64-arithmetic.glsl"));

var _fp64Functions = _interopRequireDefault(require("./fp64-functions.glsl"));

var fp64shader = "".concat(_fp64Arithmetic["default"], "\n").concat(_fp64Functions["default"]);
var CONST_UNIFORMS = {
  ONE: 1.0
};

function getUniforms() {
  return Object.assign({}, CONST_UNIFORMS);
}

var _default = {
  name: 'fp64',
  vs: fp64shader,
  fs: null,
  fp64ify: _fp64Utils.fp64ify,
  fp64LowPart: _fp64Utils.fp64LowPart,
  fp64ifyMatrix4: _fp64Utils.fp64ifyMatrix4,
  getUniforms: getUniforms
};
exports["default"] = _default;
var fp64arithmetic = {
  name: 'fp64-arithmetic',
  vs: "".concat(_fp64Arithmetic["default"]),
  fs: null
};
exports.fp64arithmetic = fp64arithmetic;
var fp64fs = {
  name: 'fp64-fs',
  vs: null,
  fs: fp64shader
};
exports.fp64fs = fp64fs;
//# sourceMappingURL=fp64.js.map