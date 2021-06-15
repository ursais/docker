"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointToDensityGridDataCPU = pointToDensityGridDataCPU;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _core = require("@deck.gl/core");

var R_EARTH = 6378000;

function pointToDensityGridDataCPU(points, cellSize, getPosition) {
  var _pointsToGridHashing2 = _pointsToGridHashing(points, cellSize, getPosition),
      gridHash = _pointsToGridHashing2.gridHash,
      gridOffset = _pointsToGridHashing2.gridOffset;

  var layerData = _getGridLayerDataFromGridHash(gridHash, gridOffset);

  return {
    gridHash: gridHash,
    gridOffset: gridOffset,
    layerData: layerData
  };
}

function _pointsToGridHashing() {
  var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var cellSize = arguments.length > 1 ? arguments[1] : undefined;
  var getPosition = arguments.length > 2 ? arguments[2] : undefined;
  var latMin = Infinity;
  var latMax = -Infinity;
  var pLat;

  var _createIterable = (0, _core.createIterable)(points),
      iterable = _createIterable.iterable,
      objectInfo = _createIterable.objectInfo;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var pt = _step.value;
      objectInfo.index++;
      pLat = getPosition(pt, objectInfo)[1];

      if (Number.isFinite(pLat)) {
        latMin = pLat < latMin ? pLat : latMin;
        latMax = pLat > latMax ? pLat : latMax;
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

  var centerLat = (latMin + latMax) / 2;

  var gridOffset = _calculateGridLatLonOffset(cellSize, centerLat);

  if (gridOffset.xOffset <= 0 || gridOffset.yOffset <= 0) {
    return {
      gridHash: {},
      gridOffset: gridOffset
    };
  }

  var gridHash = {};
  objectInfo.index = -1;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = iterable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _pt = _step2.value;
      objectInfo.index++;

      var _getPosition = getPosition(_pt, objectInfo),
          _getPosition2 = (0, _slicedToArray2.default)(_getPosition, 2),
          lng = _getPosition2[0],
          lat = _getPosition2[1];

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        var latIdx = Math.floor((lat + 90) / gridOffset.yOffset);
        var lonIdx = Math.floor((lng + 180) / gridOffset.xOffset);
        var key = "".concat(latIdx, "-").concat(lonIdx);
        gridHash[key] = gridHash[key] || {
          count: 0,
          points: []
        };
        gridHash[key].count += 1;
        gridHash[key].points.push(_pt);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return {
    gridHash: gridHash,
    gridOffset: gridOffset
  };
}

function _getGridLayerDataFromGridHash(gridHash, gridOffset) {
  return Object.keys(gridHash).reduce(function (accu, key, i) {
    var idxs = key.split('-');
    var latIdx = parseInt(idxs[0], 10);
    var lonIdx = parseInt(idxs[1], 10);
    accu.push(Object.assign({
      index: i,
      position: [-180 + gridOffset.xOffset * lonIdx, -90 + gridOffset.yOffset * latIdx]
    }, gridHash[key]));
    return accu;
  }, []);
}

function _calculateGridLatLonOffset(cellSize, latitude) {
  var yOffset = _calculateLatOffset(cellSize);

  var xOffset = _calculateLonOffset(latitude, cellSize);

  return {
    yOffset: yOffset,
    xOffset: xOffset
  };
}

function _calculateLatOffset(dy) {
  return dy / R_EARTH * (180 / Math.PI);
}

function _calculateLonOffset(lat, dx) {
  return dx / R_EARTH * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
}
//# sourceMappingURL=grid-aggregator.js.map