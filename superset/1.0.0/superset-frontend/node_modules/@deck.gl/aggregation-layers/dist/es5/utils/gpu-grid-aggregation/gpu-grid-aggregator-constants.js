"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEIGHT_SIZE = exports.PIXEL_SIZE = exports.IDENTITY_MATRIX = exports.DEFAULT_WEIGHT_PARAMS = exports.ELEMENTCOUNT = exports.EQUATION_MAP = exports.MAX_MIN_BLEND_EQUATION = exports.MAX_BLEND_EQUATION = exports.MIN_BLEND_EQUATION = exports.MAX_32_BIT_FLOAT = exports.DEFAULT_RUN_PARAMS = exports.DEFAULT_CHANGE_FLAGS = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _aggregationOperationUtils = require("../aggregation-operation-utils");

var _EQUATION_MAP;

var DEFAULT_CHANGE_FLAGS = {
  dataChanged: true,
  viewportChanged: true,
  cellSizeChanged: true
};
exports.DEFAULT_CHANGE_FLAGS = DEFAULT_CHANGE_FLAGS;
var DEFAULT_RUN_PARAMS = {
  changeFlags: DEFAULT_CHANGE_FLAGS,
  projectPoints: false,
  useGPU: true,
  fp64: false,
  viewport: null,
  gridTransformMatrix: null,
  createBufferObjects: true
};
exports.DEFAULT_RUN_PARAMS = DEFAULT_RUN_PARAMS;
var MAX_32_BIT_FLOAT = 3.402823466e38;
exports.MAX_32_BIT_FLOAT = MAX_32_BIT_FLOAT;
var MIN_BLEND_EQUATION = [32775, 32774];
exports.MIN_BLEND_EQUATION = MIN_BLEND_EQUATION;
var MAX_BLEND_EQUATION = [32776, 32774];
exports.MAX_BLEND_EQUATION = MAX_BLEND_EQUATION;
var MAX_MIN_BLEND_EQUATION = [32776, 32775];
exports.MAX_MIN_BLEND_EQUATION = MAX_MIN_BLEND_EQUATION;
var EQUATION_MAP = (_EQUATION_MAP = {}, (0, _defineProperty2.default)(_EQUATION_MAP, _aggregationOperationUtils.AGGREGATION_OPERATION.SUM, 32774), (0, _defineProperty2.default)(_EQUATION_MAP, _aggregationOperationUtils.AGGREGATION_OPERATION.MEAN, 32774), (0, _defineProperty2.default)(_EQUATION_MAP, _aggregationOperationUtils.AGGREGATION_OPERATION.MIN, MIN_BLEND_EQUATION), (0, _defineProperty2.default)(_EQUATION_MAP, _aggregationOperationUtils.AGGREGATION_OPERATION.MAX, MAX_BLEND_EQUATION), _EQUATION_MAP);
exports.EQUATION_MAP = EQUATION_MAP;
var ELEMENTCOUNT = 4;
exports.ELEMENTCOUNT = ELEMENTCOUNT;
var DEFAULT_WEIGHT_PARAMS = {
  size: 1,
  operation: _aggregationOperationUtils.AGGREGATION_OPERATION.SUM,
  needMin: false,
  needMax: false,
  combineMaxMin: false
};
exports.DEFAULT_WEIGHT_PARAMS = DEFAULT_WEIGHT_PARAMS;
var IDENTITY_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
var PIXEL_SIZE = 4;
exports.PIXEL_SIZE = PIXEL_SIZE;
var WEIGHT_SIZE = 3;
exports.WEIGHT_SIZE = WEIGHT_SIZE;
//# sourceMappingURL=gpu-grid-aggregator-constants.js.map