"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _tileCache = _interopRequireDefault(require("./utils/tile-cache"));

var defaultProps = {
  renderSubLayers: {
    type: 'function',
    value: function value(props) {
      return new _layers.GeoJsonLayer(props);
    }
  },
  getTileData: {
    type: 'function',
    value: function value(_ref) {
      var x = _ref.x,
          y = _ref.y,
          z = _ref.z;
      return Promise.resolve(null);
    }
  },
  onViewportLoaded: {
    type: 'function',
    value: function value() {}
  },
  onTileError: {
    type: 'function',
    value: function value(err) {
      return console.error(err);
    }
  },
  maxZoom: null,
  minZoom: 0,
  maxCacheSize: null
};

var TileLayer = function (_CompositeLayer) {
  (0, _inherits2.default)(TileLayer, _CompositeLayer);

  function TileLayer() {
    (0, _classCallCheck2.default)(this, TileLayer);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TileLayer).apply(this, arguments));
  }

  (0, _createClass2.default)(TileLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var _this$props = this.props,
          maxZoom = _this$props.maxZoom,
          minZoom = _this$props.minZoom,
          getTileData = _this$props.getTileData,
          onTileError = _this$props.onTileError;
      this.state = {
        tiles: [],
        tileCache: new _tileCache.default({
          getTileData: getTileData,
          maxZoom: maxZoom,
          minZoom: minZoom,
          onTileError: onTileError
        }),
        isLoaded: false
      };
    }
  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(_ref2) {
      var changeFlags = _ref2.changeFlags;
      return changeFlags.somethingChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref3) {
      var _this = this;

      var props = _ref3.props,
          oldProps = _ref3.oldProps,
          context = _ref3.context,
          changeFlags = _ref3.changeFlags;
      var onViewportLoaded = props.onViewportLoaded,
          onTileError = props.onTileError;

      if (changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getTileData)) {
        var getTileData = props.getTileData,
            maxZoom = props.maxZoom,
            minZoom = props.minZoom,
            maxCacheSize = props.maxCacheSize;
        this.state.tileCache.finalize();
        this.setState({
          tileCache: new _tileCache.default({
            getTileData: getTileData,
            maxSize: maxCacheSize,
            maxZoom: maxZoom,
            minZoom: minZoom,
            onTileError: onTileError
          })
        });
      }

      if (changeFlags.viewportChanged) {
        var viewport = context.viewport;
        var z = this.getLayerZoomLevel();

        if (viewport.id !== 'DEFAULT-INITIAL-VIEWPORT') {
          this.state.tileCache.update(viewport, function (tiles) {
            var currTiles = tiles.filter(function (tile) {
              return tile.z === z;
            });
            var allCurrTilesLoaded = currTiles.every(function (tile) {
              return tile.isLoaded;
            });

            _this.setState({
              tiles: tiles,
              isLoaded: allCurrTilesLoaded
            });

            if (!allCurrTilesLoaded) {
              Promise.all(currTiles.map(function (tile) {
                return tile.data;
              })).then(function () {
                _this.setState({
                  isLoaded: true
                });

                onViewportLoaded(currTiles.filter(function (tile) {
                  return tile._data;
                }).map(function (tile) {
                  return tile._data;
                }));
              });
            } else {
              onViewportLoaded(currTiles.filter(function (tile) {
                return tile._data;
              }).map(function (tile) {
                return tile._data;
              }));
            }
          });
        }
      }
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref4) {
      var info = _ref4.info,
          sourceLayer = _ref4.sourceLayer;
      info.sourceLayer = sourceLayer;
      info.tile = sourceLayer.props.tile;
      return info;
    }
  }, {
    key: "getLayerZoomLevel",
    value: function getLayerZoomLevel() {
      var z = Math.floor(this.context.viewport.zoom);
      var _this$props2 = this.props,
          maxZoom = _this$props2.maxZoom,
          minZoom = _this$props2.minZoom;

      if (maxZoom && parseInt(maxZoom, 10) === maxZoom && z > maxZoom) {
        return maxZoom;
      } else if (minZoom && parseInt(minZoom, 10) === minZoom && z < minZoom) {
        return minZoom;
      }

      return z;
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this2 = this;

      var _this$props3 = this.props,
          renderSubLayers = _this$props3.renderSubLayers,
          visible = _this$props3.visible;
      var z = this.getLayerZoomLevel();
      return this.state.tiles.map(function (tile) {
        return renderSubLayers(Object.assign({}, _this2.props, {
          id: "".concat(_this2.id, "-").concat(tile.x, "-").concat(tile.y, "-").concat(tile.z),
          data: tile.data,
          visible: visible && (!_this2.state.isLoaded || tile.z === z),
          tile: tile
        }));
      });
    }
  }]);
  return TileLayer;
}(_core.CompositeLayer);

exports.default = TileLayer;
TileLayer.layerName = 'TileLayer';
TileLayer.defaultProps = defaultProps;
//# sourceMappingURL=tile-layer.js.map