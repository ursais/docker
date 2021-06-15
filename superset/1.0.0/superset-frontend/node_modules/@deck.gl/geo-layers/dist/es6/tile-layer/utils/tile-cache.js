import Tile from './tile';
import { getTileIndices } from './viewport-util';
export default class TileCache {
  constructor(_ref) {
    let getTileData = _ref.getTileData,
        maxSize = _ref.maxSize,
        maxZoom = _ref.maxZoom,
        minZoom = _ref.minZoom,
        onTileError = _ref.onTileError;
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

  finalize() {
    this._cache.clear();
  }

  update(viewport, onUpdate) {
    const _cache = this._cache,
          _getTileData = this._getTileData,
          _maxSize = this._maxSize,
          _maxZoom = this._maxZoom,
          _minZoom = this._minZoom;

    this._markOldTiles();

    const tileIndices = getTileIndices(viewport, _maxZoom, _minZoom);

    if (!tileIndices || tileIndices.length === 0) {
      onUpdate(tileIndices);
      return;
    }

    const viewportTiles = new Set();

    _cache.forEach(cachedTile => {
      if (tileIndices.some(tile => cachedTile.isOverlapped(tile))) {
        cachedTile.isVisible = true;
        viewportTiles.add(cachedTile);
      }
    });

    for (let i = 0; i < tileIndices.length; i++) {
      const tileIndex = tileIndices[i];
      const x = tileIndex.x,
            y = tileIndex.y,
            z = tileIndex.z;

      let tile = this._getTile(x, y, z);

      if (!tile) {
        tile = new Tile({
          getTileData: _getTileData,
          x,
          y,
          z,
          onTileError: this.onTileError
        });
      }

      const tileId = this._getTileId(x, y, z);

      _cache.set(tileId, tile);

      viewportTiles.add(tile);
    }

    const commonZoomRange = 5;

    this._resizeCache(_maxSize || commonZoomRange * tileIndices.length);

    const viewportTilesArray = Array.from(viewportTiles).sort((t1, t2) => t1.z - t2.z);
    onUpdate(viewportTilesArray);
  }

  _resizeCache(maxSize) {
    const _cache = this._cache;

    if (_cache.size > maxSize) {
      const iterator = _cache[Symbol.iterator]();

      for (const cachedTile of iterator) {
        if (_cache.size <= maxSize) {
          break;
        }

        const tileId = cachedTile[0];
        const tile = cachedTile[1];

        if (!tile.isVisible) {
          _cache.delete(tileId);
        }
      }
    }
  }

  _markOldTiles() {
    this._cache.forEach(cachedTile => {
      cachedTile.isVisible = false;
    });
  }

  _getTile(x, y, z) {
    const tileId = this._getTileId(x, y, z);

    return this._cache.get(tileId);
  }

  _getTileId(x, y, z) {
    return `${z}-${x}-${y}`;
  }

}
//# sourceMappingURL=tile-cache.js.map