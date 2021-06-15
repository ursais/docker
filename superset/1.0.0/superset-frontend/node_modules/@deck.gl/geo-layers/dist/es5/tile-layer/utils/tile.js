"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tile2latLng = tile2latLng;
exports.tile2boundingBox = tile2boundingBox;
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function tile2latLng(x, y, z) {
  var lng = x / Math.pow(2, z) * 360 - 180;
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  var lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
}

function tile2boundingBox(x, y, z) {
  var _tile2latLng = tile2latLng(x, y, z),
      _tile2latLng2 = (0, _slicedToArray2.default)(_tile2latLng, 2),
      west = _tile2latLng2[0],
      north = _tile2latLng2[1];

  var _tile2latLng3 = tile2latLng(x + 1, y + 1, z),
      _tile2latLng4 = (0, _slicedToArray2.default)(_tile2latLng3, 2),
      east = _tile2latLng4[0],
      south = _tile2latLng4[1];

  return {
    west: west,
    north: north,
    east: east,
    south: south
  };
}

var Tile = function () {
  function Tile(_ref) {
    var getTileData = _ref.getTileData,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        onTileError = _ref.onTileError;
    (0, _classCallCheck2.default)(this, Tile);
    this.x = x;
    this.y = y;
    this.z = z;
    this.bbox = tile2boundingBox(this.x, this.y, this.z);
    this.isVisible = true;
    this.getTileData = getTileData;
    this._data = null;
    this._isLoaded = false;
    this._loader = this._loadData();
    this.onTileError = onTileError;
  }

  (0, _createClass2.default)(Tile, [{
    key: "_loadData",
    value: function _loadData() {
      var _this = this;

      var x = this.x,
          y = this.y,
          z = this.z,
          bbox = this.bbox;

      if (!this.getTileData) {
        return null;
      }

      var getTileDataPromise = this.getTileData({
        x: x,
        y: y,
        z: z,
        bbox: bbox
      });
      return getTileDataPromise.then(function (buffers) {
        _this._data = buffers;
        _this._isLoaded = true;
        return buffers;
      }).catch(function (err) {
        _this._isLoaded = true;

        _this.onTileError(err);
      });
    }
  }, {
    key: "isOverlapped",
    value: function isOverlapped(tile) {
      var x = this.x,
          y = this.y,
          z = this.z;
      var m = Math.pow(2, tile.z - z);
      return Math.floor(tile.x / m) === x && Math.floor(tile.y / m) === y;
    }
  }, {
    key: "data",
    get: function get() {
      if (this._data) {
        return Promise.resolve(this._data);
      }

      return this._loader;
    }
  }, {
    key: "isLoaded",
    get: function get() {
      return this._isLoaded;
    }
  }]);
  return Tile;
}();

exports.default = Tile;
//# sourceMappingURL=tile.js.map