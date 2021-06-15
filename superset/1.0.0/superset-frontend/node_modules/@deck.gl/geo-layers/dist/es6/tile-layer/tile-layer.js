import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';
import TileCache from './utils/tile-cache';
const defaultProps = {
  renderSubLayers: {
    type: 'function',
    value: props => new GeoJsonLayer(props)
  },
  getTileData: {
    type: 'function',
    value: (_ref) => {
      let x = _ref.x,
          y = _ref.y,
          z = _ref.z;
      return Promise.resolve(null);
    }
  },
  onViewportLoaded: {
    type: 'function',
    value: () => {}
  },
  onTileError: {
    type: 'function',
    value: err => console.error(err)
  },
  maxZoom: null,
  minZoom: 0,
  maxCacheSize: null
};
export default class TileLayer extends CompositeLayer {
  initializeState() {
    const _this$props = this.props,
          maxZoom = _this$props.maxZoom,
          minZoom = _this$props.minZoom,
          getTileData = _this$props.getTileData,
          onTileError = _this$props.onTileError;
    this.state = {
      tiles: [],
      tileCache: new TileCache({
        getTileData,
        maxZoom,
        minZoom,
        onTileError
      }),
      isLoaded: false
    };
  }

  shouldUpdateState(_ref2) {
    let changeFlags = _ref2.changeFlags;
    return changeFlags.somethingChanged;
  }

  updateState(_ref3) {
    let props = _ref3.props,
        oldProps = _ref3.oldProps,
        context = _ref3.context,
        changeFlags = _ref3.changeFlags;
    const onViewportLoaded = props.onViewportLoaded,
          onTileError = props.onTileError;

    if (changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getTileData)) {
      const getTileData = props.getTileData,
            maxZoom = props.maxZoom,
            minZoom = props.minZoom,
            maxCacheSize = props.maxCacheSize;
      this.state.tileCache.finalize();
      this.setState({
        tileCache: new TileCache({
          getTileData,
          maxSize: maxCacheSize,
          maxZoom,
          minZoom,
          onTileError
        })
      });
    }

    if (changeFlags.viewportChanged) {
      const viewport = context.viewport;
      const z = this.getLayerZoomLevel();

      if (viewport.id !== 'DEFAULT-INITIAL-VIEWPORT') {
        this.state.tileCache.update(viewport, tiles => {
          const currTiles = tiles.filter(tile => tile.z === z);
          const allCurrTilesLoaded = currTiles.every(tile => tile.isLoaded);
          this.setState({
            tiles,
            isLoaded: allCurrTilesLoaded
          });

          if (!allCurrTilesLoaded) {
            Promise.all(currTiles.map(tile => tile.data)).then(() => {
              this.setState({
                isLoaded: true
              });
              onViewportLoaded(currTiles.filter(tile => tile._data).map(tile => tile._data));
            });
          } else {
            onViewportLoaded(currTiles.filter(tile => tile._data).map(tile => tile._data));
          }
        });
      }
    }
  }

  getPickingInfo(_ref4) {
    let info = _ref4.info,
        sourceLayer = _ref4.sourceLayer;
    info.sourceLayer = sourceLayer;
    info.tile = sourceLayer.props.tile;
    return info;
  }

  getLayerZoomLevel() {
    const z = Math.floor(this.context.viewport.zoom);
    const _this$props2 = this.props,
          maxZoom = _this$props2.maxZoom,
          minZoom = _this$props2.minZoom;

    if (maxZoom && parseInt(maxZoom, 10) === maxZoom && z > maxZoom) {
      return maxZoom;
    } else if (minZoom && parseInt(minZoom, 10) === minZoom && z < minZoom) {
      return minZoom;
    }

    return z;
  }

  renderLayers() {
    const _this$props3 = this.props,
          renderSubLayers = _this$props3.renderSubLayers,
          visible = _this$props3.visible;
    const z = this.getLayerZoomLevel();
    return this.state.tiles.map(tile => {
      return renderSubLayers(Object.assign({}, this.props, {
        id: `${this.id}-${tile.x}-${tile.y}-${tile.z}`,
        data: tile.data,
        visible: visible && (!this.state.isLoaded || tile.z === z),
        tile
      }));
    });
  }

}
TileLayer.layerName = 'TileLayer';
TileLayer.defaultProps = defaultProps;
//# sourceMappingURL=tile-layer.js.map