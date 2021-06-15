import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _EQUATION_MAP;

import { AGGREGATION_OPERATION } from '../aggregation-operation-utils';
export var DEFAULT_CHANGE_FLAGS = {
  dataChanged: true,
  viewportChanged: true,
  cellSizeChanged: true
};
export var DEFAULT_RUN_PARAMS = {
  changeFlags: DEFAULT_CHANGE_FLAGS,
  projectPoints: false,
  useGPU: true,
  fp64: false,
  viewport: null,
  gridTransformMatrix: null,
  createBufferObjects: true
};
export var MAX_32_BIT_FLOAT = 3.402823466e38;
export var MIN_BLEND_EQUATION = [32775, 32774];
export var MAX_BLEND_EQUATION = [32776, 32774];
export var MAX_MIN_BLEND_EQUATION = [32776, 32775];
export var EQUATION_MAP = (_EQUATION_MAP = {}, _defineProperty(_EQUATION_MAP, AGGREGATION_OPERATION.SUM, 32774), _defineProperty(_EQUATION_MAP, AGGREGATION_OPERATION.MEAN, 32774), _defineProperty(_EQUATION_MAP, AGGREGATION_OPERATION.MIN, MIN_BLEND_EQUATION), _defineProperty(_EQUATION_MAP, AGGREGATION_OPERATION.MAX, MAX_BLEND_EQUATION), _EQUATION_MAP);
export var ELEMENTCOUNT = 4;
export var DEFAULT_WEIGHT_PARAMS = {
  size: 1,
  operation: AGGREGATION_OPERATION.SUM,
  needMin: false,
  needMax: false,
  combineMaxMin: false
};
export var IDENTITY_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
export var PIXEL_SIZE = 4;
export var WEIGHT_SIZE = 3;
//# sourceMappingURL=gpu-grid-aggregator-constants.js.map