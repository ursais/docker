"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformVector = transformVector;
exports.createMat4 = createMat4;
exports.extractCameraVectors = extractCameraVectors;
exports.mod = mod;

var vec4 = _interopRequireWildcard(require("gl-matrix/vec4"));

var _assert = _interopRequireDefault(require("../utils/assert"));

function transformVector(matrix, vector) {
  if (!matrix) {
    return null;
  }

  var result = vec4.transformMat4([0, 0, 0, 0], vector, matrix);
  var scale = 1 / result[3];
  vec4.multiply(result, result, [scale, scale, scale, scale]);
  return result;
}

function createMat4() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function extractCameraVectors(_ref) {
  var viewMatrix = _ref.viewMatrix,
      viewMatrixInverse = _ref.viewMatrixInverse;
  return {
    eye: [viewMatrixInverse[12], viewMatrixInverse[13], viewMatrixInverse[14]],
    direction: [viewMatrix[2], viewMatrix[6], viewMatrix[10]],
    up: [viewMatrix[1], viewMatrix[5], viewMatrix[9]]
  };
}

function mod(value, divisor) {
  (0, _assert.default)(Number.isFinite(value) && Number.isFinite(divisor));
  var modulus = value % divisor;
  return modulus < 0 ? divisor + modulus : modulus;
}
//# sourceMappingURL=math-utils.js.map