"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointToDensityGridData = pointToDensityGridData;
exports.alignToCell = alignToCell;

var _math = require("math.gl");

var _core = require("@luma.gl/core");

var _core2 = require("@deck.gl/core");

var count = _core2.experimental.count;
var fp64LowPart = _core.fp64.fp64LowPart;
var R_EARTH = 6378000;

function toFinite(n) {
  return Number.isFinite(n) ? n : 0;
}

function pointToDensityGridData(_ref) {
  var data = _ref.data,
      getPosition = _ref.getPosition,
      cellSizeMeters = _ref.cellSizeMeters,
      gpuGridAggregator = _ref.gpuGridAggregator,
      gpuAggregation = _ref.gpuAggregation,
      aggregationFlags = _ref.aggregationFlags,
      weightParams = _ref.weightParams,
      _ref$fp = _ref.fp64,
      fp64 = _ref$fp === void 0 ? false : _ref$fp,
      _ref$coordinateSystem = _ref.coordinateSystem,
      coordinateSystem = _ref$coordinateSystem === void 0 ? _core2.COORDINATE_SYSTEM.LNGLAT : _ref$coordinateSystem,
      _ref$viewport = _ref.viewport,
      viewport = _ref$viewport === void 0 ? null : _ref$viewport,
      _ref$boundingBox = _ref.boundingBox,
      boundingBox = _ref$boundingBox === void 0 ? null : _ref$boundingBox;
  var gridData = {};

  if (aggregationFlags.dataChanged) {
    gridData = parseGridData(data, getPosition, weightParams);
    boundingBox = gridData.boundingBox;
  }

  var cellSize = [cellSizeMeters, cellSizeMeters];
  var worldOrigin = [0, 0];

  _core2.log.assert(coordinateSystem === _core2.COORDINATE_SYSTEM.LNGLAT || coordinateSystem === _core2.COORDINATE_SYSTEM.IDENTITY);

  switch (coordinateSystem) {
    case _core2.COORDINATE_SYSTEM.LNGLAT:
    case _core2.COORDINATE_SYSTEM.LNGLAT_DEPRECATED:
      var gridOffset = getGridOffset(boundingBox, cellSizeMeters);
      cellSize = [gridOffset.xOffset, gridOffset.yOffset];
      worldOrigin = [-180, -90];
      break;

    case _core2.COORDINATE_SYSTEM.IDENTITY:
      var width = viewport.width,
          height = viewport.height;
      worldOrigin = [-width / 2, -height / 2];
      break;

    default:
      _core2.log.assert(false);

  }

  var opts = getGPUAggregationParams({
    boundingBox: boundingBox,
    cellSize: cellSize,
    worldOrigin: worldOrigin
  });
  var aggregatedData = gpuGridAggregator.run({
    positions: gridData.positions,
    positions64xyLow: gridData.positions64xyLow,
    weights: gridData.weights,
    cellSize: cellSize,
    width: opts.width,
    height: opts.height,
    gridTransformMatrix: opts.gridTransformMatrix,
    useGPU: gpuAggregation,
    changeFlags: aggregationFlags,
    fp64: fp64
  });
  return {
    weights: aggregatedData,
    gridSize: opts.gridSize,
    gridOrigin: opts.gridOrigin,
    cellSize: cellSize,
    boundingBox: boundingBox
  };
}

function parseGridData(data, getPosition, weightParams) {
  var pointCount = count(data);
  var positions = new Float64Array(pointCount * 2);
  var positions64xyLow = new Float32Array(pointCount * 2);
  var yMin = Infinity;
  var yMax = -Infinity;
  var xMin = Infinity;
  var xMax = -Infinity;
  var y;
  var x;
  var weights = {};

  for (var name in weightParams) {
    weights[name] = Object.assign({}, weightParams[name], {
      values: new Float32Array(pointCount * 3)
    });
  }

  var _createIterable = (0, _core2.createIterable)(data),
      iterable = _createIterable.iterable,
      objectInfo = _createIterable.objectInfo;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var object = _step.value;
      objectInfo.index++;
      var position = getPosition(object, objectInfo);
      var index = objectInfo.index;
      x = position[0];
      y = position[1];
      positions[index * 2] = x;
      positions[index * 2 + 1] = y;
      positions64xyLow[index * 2] = fp64LowPart(x);
      positions64xyLow[index * 2 + 1] = fp64LowPart(y);

      for (var _name in weightParams) {
        var weight = weightParams[_name].getWeight(object);

        if (Array.isArray(weight)) {
          weights[_name].values[index * 3] = weight[0];
          weights[_name].values[index * 3 + 1] = weight[1];
          weights[_name].values[index * 3 + 2] = weight[2];
        } else {
          weights[_name].values[index * 3] = weight;
        }
      }

      if (Number.isFinite(y) && Number.isFinite(x)) {
        yMin = y < yMin ? y : yMin;
        yMax = y > yMax ? y : yMax;
        xMin = x < xMin ? x : xMin;
        xMax = x > xMax ? x : xMax;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var boundingBox = {
    xMin: toFinite(xMin),
    xMax: toFinite(xMax),
    yMin: toFinite(yMin),
    yMax: toFinite(yMax)
  };
  return {
    positions: positions,
    positions64xyLow: positions64xyLow,
    weights: weights,
    boundingBox: boundingBox
  };
}

function getGridOffset(boundingBox, cellSize) {
  var yMin = boundingBox.yMin,
      yMax = boundingBox.yMax;
  var latMin = yMin;
  var latMax = yMax;
  var centerLat = (latMin + latMax) / 2;
  return calculateGridLatLonOffset(cellSize, centerLat);
}

function calculateGridLatLonOffset(cellSize, latitude) {
  var yOffset = calculateLatOffset(cellSize);
  var xOffset = calculateLonOffset(latitude, cellSize);
  return {
    yOffset: yOffset,
    xOffset: xOffset
  };
}

function calculateLatOffset(dy) {
  return dy / R_EARTH * (180 / Math.PI);
}

function calculateLonOffset(lat, dx) {
  return dx / R_EARTH * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
}

function alignToCell(inValue, cellSize) {
  var sign = inValue < 0 ? -1 : 1;
  var value = sign < 0 ? Math.abs(inValue) + cellSize : Math.abs(inValue);
  value = Math.floor(value / cellSize) * cellSize;
  return value * sign;
}

function getGPUAggregationParams(_ref2) {
  var boundingBox = _ref2.boundingBox,
      cellSize = _ref2.cellSize,
      worldOrigin = _ref2.worldOrigin;
  var yMin = boundingBox.yMin,
      yMax = boundingBox.yMax,
      xMin = boundingBox.xMin,
      xMax = boundingBox.xMax;
  var originX = alignToCell(xMin - worldOrigin[0], cellSize[0]) + worldOrigin[0];
  var originY = alignToCell(yMin - worldOrigin[1], cellSize[1]) + worldOrigin[1];
  var gridTransformMatrix = new _math.Matrix4().translate([-1 * originX, -1 * originY, 0]);
  var gridOrigin = [originX, originY];
  var width = xMax - xMin + cellSize[0];
  var height = yMax - yMin + cellSize[1];
  var gridSize = [Math.ceil(width / cellSize[0]), Math.ceil(height / cellSize[1])];
  return {
    gridOrigin: gridOrigin,
    gridSize: gridSize,
    width: width,
    height: height,
    gridTransformMatrix: gridTransformMatrix
  };
}
//# sourceMappingURL=grid-aggregation-utils.js.map