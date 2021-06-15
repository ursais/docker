"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _tile = _interopRequireDefault(require("./tile"));

var _viewportUtil = require("./viewport-util");

var TileCache = function () {
  function TileCache(_ref) {
    var getTileData = _ref.getTileData,
        maxSize = _ref.maxSize,
        maxZoom = _ref.maxZoom,
        minZoom = _ref.minZoom,
        onTileError = _ref.onTileError;
    (0, _classCallCheck2.default)(this, TileCache);
    this._getTileData = getTileData;
    this._maxSize = maxSize;
    this.onTileError = onTileError;
    this._cache = new Map();

    if (maxZoom && parseInt(maxZoom, 10) === maxZoom) {
      this._maxZoom = maxZoom;
    }

    if (minZoom && parseInt(minZoom, 10) === minZoom) {
      this._minZoom = minZoom;
    }
  }

  (0, _createClass2.default)(TileCache, [{
    key: "finalize",
    value: function finalize() {
      this._cache.clear();
    }
  }, {
    key: "update",
    value: function update(viewport, onUpdate) {
      var _cache = this._cache,
          _getTileData = this._getTileData,
          _maxSize = this._maxSize,
          _maxZoom = this._maxZoom,
          _minZoom = this._minZoom;

      this._markOldTiles();

      var tileIndices = (0, _viewportUtil.getTileIndices)(viewport, _maxZoom, _minZoom);

      if (!tileIndices || tileIndices.length === 0) {
        onUpdate(tileIndices);
        return;
      }

      var viewportTiles = new Set();

      _cache.forEach(function (cachedTile) {
        if (tileIndices.some(function (tile) {
          return cachedTile.isOverlapped(tile);
        })) {
          cachedTile.isVisible = true;
          viewportTiles.add(cachedTile);
        }
      });

      for (var i = 0; i < tileIndices.length; i++) {
        var tileIndex = tileIndices[i];
        var x = tileIndex.x,
            y = tileIndex.y,
            z = tileIndex.z;

        var tile = this._getTile(x, y, z);

        if (!tile) {
          tile = new _tile.default({
            getTileData: _getTileData,
            x: x,
            y: y,
            z: z,
            onTileError: this.onTileError
          });
        }

        var tileId = this._getTileId(x, y, z);

        _cache.set(tileId, tile);

        viewportTiles.add(tile);
      }

      var commonZoomRange = 5;

      this._resizeCache(_maxSize || commonZoomRange * tileIndices.length);

      var viewportTilesArray = Array.from(viewportTiles).sort(function (t1, t2) {
        return t1.z - t2.z;
      });
      onUpdate(viewportTilesArray);
    }
  }, {
    key: "_resizeCache",
    value: function _resizeCache(maxSize) {
      var _cache = this._cache;

      if (_cache.size > maxSize) {
        var iterator = _cache[Symbol.iterator]();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = iterator[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cachedTile = _step.value;

            if (_cache.size <= maxSize) {
              break;
            }

            var tileId = cachedTile[0];
            var tile = cachedTile[1];

            if (!tile.isVisible) {
              _cache.delete(tileId);
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
      }
    }
  }, {
    key: "_markOldTiles",
    value: function _markOldTiles() {
      this._cache.forEach(function (cachedTile) {
        cachedTile.isVisible = false;
      });
    }
  }, {
    key: "_getTile",
    value: function _getTile(x, y, z) {
      var tileId = this._getTileId(x, y, z);

      return this._cache.get(tileId);
    }
  }, {
    key: "_getTileId",
    value: function _getTileId(x, y, z) {
      return "".concat(z, "-").concat(x, "-").concat(y);
    }
  }]);
  return TileCache;
}();

exports.default = TileCache;
//# sourceMappingURL=tile-cache.js.map