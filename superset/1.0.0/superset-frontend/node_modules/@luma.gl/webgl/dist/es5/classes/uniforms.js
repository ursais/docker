"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUniformName = parseUniformName;
exports.getUniformSetter = getUniformSetter;
exports.checkUniformValues = checkUniformValues;
exports.areUniformsEqual = areUniformsEqual;
exports.getUniformCopy = getUniformCopy;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _framebuffer = _interopRequireDefault(require("./framebuffer"));

var _renderbuffer = _interopRequireDefault(require("./renderbuffer"));

var _texture = _interopRequireDefault(require("./texture"));

var _utils = require("../utils");

var _UNIFORM_SETTERS;

var UNIFORM_SETTERS = (_UNIFORM_SETTERS = {}, (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 5126, function (gl, location, value) {
  return gl.uniform1fv(location, toFloatArray(value, 1));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35664, function (gl, location, value) {
  return gl.uniform2fv(location, toFloatArray(value, 2));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35665, function (gl, location, value) {
  return gl.uniform3fv(location, toFloatArray(value, 3));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35666, function (gl, location, value) {
  return gl.uniform4fv(location, toFloatArray(value, 4));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 5124, function (gl, location, value) {
  return gl.uniform1iv(location, toIntArray(value, 1));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35667, function (gl, location, value) {
  return gl.uniform2iv(location, toIntArray(value, 2));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35668, function (gl, location, value) {
  return gl.uniform3iv(location, toIntArray(value, 3));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35669, function (gl, location, value) {
  return gl.uniform4iv(location, toIntArray(value, 4));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35670, function (gl, location, value) {
  return gl.uniform1iv(location, toIntArray(value, 1));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35671, function (gl, location, value) {
  return gl.uniform2iv(location, toIntArray(value, 2));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35672, function (gl, location, value) {
  return gl.uniform3iv(location, toIntArray(value, 3));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35673, function (gl, location, value) {
  return gl.uniform4iv(location, toIntArray(value, 4));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35674, function (gl, location, value) {
  return gl.uniformMatrix2fv(location, false, toFloatArray(value, 4));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35675, function (gl, location, value) {
  return gl.uniformMatrix3fv(location, false, toFloatArray(value, 9));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35676, function (gl, location, value) {
  return gl.uniformMatrix4fv(location, false, toFloatArray(value, 16));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35678, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35680, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 5125, function (gl, location, value) {
  return gl.uniform1uiv(location, toUIntArray(value, 1));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36294, function (gl, location, value) {
  return gl.uniform2uiv(location, toUIntArray(value, 2));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36295, function (gl, location, value) {
  return gl.uniform3uiv(location, toUIntArray(value, 3));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36296, function (gl, location, value) {
  return gl.uniform4uiv(location, toUIntArray(value, 4));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35685, function (gl, location, value) {
  return gl.uniformMatrix2x3fv(location, false, toFloatArray(value, 6));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35686, function (gl, location, value) {
  return gl.uniformMatrix2x4fv(location, false, toFloatArray(value, 8));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35687, function (gl, location, value) {
  return gl.uniformMatrix3x2fv(location, false, toFloatArray(value, 6));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35688, function (gl, location, value) {
  return gl.uniformMatrix3x4fv(location, false, toFloatArray(value, 12));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35689, function (gl, location, value) {
  return gl.uniformMatrix4x2fv(location, false, toFloatArray(value, 8));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35690, function (gl, location, value) {
  return gl.uniformMatrix4x3fv(location, false, toFloatArray(value, 12));
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35679, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 35682, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36289, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36292, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36293, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36298, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36299, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36300, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36303, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36306, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36307, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36308, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), (0, _defineProperty2["default"])(_UNIFORM_SETTERS, 36311, function (gl, location, value) {
  return gl.uniform1i(location, value);
}), _UNIFORM_SETTERS);
var FLOAT_ARRAY = {};
var INT_ARRAY = {};
var UINT_ARRAY = {};
var array1 = [0];

function toTypedArray(value, uniformLength, Type, cache) {
  if (uniformLength === 1 && typeof value === 'boolean') {
    value = value ? 1 : 0;
  }

  if (Number.isFinite(value)) {
    array1[0] = value;
    value = array1;
  }

  var length = value.length;

  if (length % uniformLength) {
    _utils.log.warn("Uniform size should be multiples of ".concat(uniformLength), value)();
  }

  if (value instanceof Type) {
    return value;
  }

  var result = cache[length];

  if (!result) {
    result = new Type(length);
    cache[length] = result;
  }

  for (var i = 0; i < length; i++) {
    result[i] = value[i];
  }

  return result;
}

function toFloatArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Float32Array, FLOAT_ARRAY);
}

function toIntArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Int32Array, INT_ARRAY);
}

function toUIntArray(value, uniformLength) {
  return toTypedArray(value, uniformLength, Uint32Array, UINT_ARRAY);
}

function parseUniformName(name) {
  if (name[name.length - 1] !== ']') {
    return {
      name: name,
      length: 1,
      isArray: false
    };
  }

  var UNIFORM_NAME_REGEXP = /([^[]*)(\[[0-9]+\])?/;
  var matches = name.match(UNIFORM_NAME_REGEXP);

  if (!matches || matches.length < 2) {
    throw new Error("Failed to parse GLSL uniform name ".concat(name));
  }

  return {
    name: matches[1],
    length: matches[2] || 1,
    isArray: Boolean(matches[2])
  };
}

function getUniformSetter(gl, location, info) {
  var setter = UNIFORM_SETTERS[info.type];

  if (!setter) {
    throw new Error("Unknown GLSL uniform type ".concat(info.type));
  }

  return setter.bind(null, gl, location);
}

function checkUniformValues(uniforms, source, uniformMap) {
  for (var uniformName in uniforms) {
    var value = uniforms[uniformName];
    var shouldCheck = !uniformMap || Boolean(uniformMap[uniformName]);

    if (shouldCheck && !checkUniformValue(value)) {
      source = source ? "".concat(source, " ") : '';
      console.error("".concat(source, " Bad uniform ").concat(uniformName), value);
      throw new Error("".concat(source, " Bad uniform ").concat(uniformName));
    }
  }

  return true;
}

function checkUniformValue(value) {
  if (Array.isArray(value) || ArrayBuffer.isView(value)) {
    return checkUniformArray(value);
  }

  if (isFinite(value)) {
    return true;
  } else if (value === true || value === false) {
    return true;
  } else if (value instanceof _texture["default"]) {
    return true;
  } else if (value instanceof _renderbuffer["default"]) {
    return true;
  } else if (value instanceof _framebuffer["default"]) {
    return Boolean(value.texture);
  }

  return false;
}

function checkUniformArray(value) {
  if (value.length === 0) {
    return false;
  }

  var checkLength = Math.min(value.length, 16);

  for (var i = 0; i < checkLength; ++i) {
    if (!Number.isFinite(value[i])) {
      return false;
    }
  }

  return true;
}

function areUniformsEqual(uniform1, uniform2) {
  if (Array.isArray(uniform1) || ArrayBuffer.isView(uniform1)) {
    if (!uniform2) {
      return false;
    }

    var len = uniform1.length;

    if (uniform2.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      if (uniform1[i] !== uniform2[i]) {
        return false;
      }
    }

    return true;
  }

  return uniform1 === uniform2;
}

function getUniformCopy(uniform) {
  if (Array.isArray(uniform) || ArrayBuffer.isView(uniform)) {
    return uniform.slice();
  }

  return uniform;
}
//# sourceMappingURL=uniforms.js.map