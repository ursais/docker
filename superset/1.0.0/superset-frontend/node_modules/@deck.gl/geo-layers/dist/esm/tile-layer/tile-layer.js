import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';
import TileCache from './utils/tile-cache';
var defaultProps = {
  renderSubLayers: {
    type: 'function',
    value: function value(props) {
      return new GeoJsonLayer(props);
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
  _inherits(TileLayer, _CompositeLayer);

  function TileLayer() {
    _classCallCheck(this, TileLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(TileLayer).apply(this, arguments));
  }

  _createClass(TileLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var _this$props = this.props,
          maxZoom = _this$props.maxZoom,
          minZoom = _this$props.minZoom,
          getTileData = _this$props.getTileData,
          onTileError = _this$props.onTileError;
      this.state = {
        tiles: [],
        tileCache: new TileCache({
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
          tileCache: new TileCache({
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
}(CompositeLayer);

export { TileLayer as default };
TileLayer.layerName = 'TileLayer';
TileLayer.defaultProps = defaultProps;
//# sourceMappingURL=tile-layer.js.map