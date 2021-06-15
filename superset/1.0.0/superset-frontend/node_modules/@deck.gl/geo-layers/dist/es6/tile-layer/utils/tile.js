import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export function tile2latLng(x, y, z) {
  const lng = x / Math.pow(2, z) * 360 - 180;
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
}
export function tile2boundingBox(x, y, z) {
  const _tile2latLng = tile2latLng(x, y, z),
        _tile2latLng2 = _slicedToArray(_tile2latLng, 2),
        west = _tile2latLng2[0],
        north = _tile2latLng2[1];

  const _tile2latLng3 = tile2latLng(x + 1, y + 1, z),
        _tile2latLng4 = _slicedToArray(_tile2latLng3, 2),
        east = _tile2latLng4[0],
        south = _tile2latLng4[1];

  return {
    west,
    north,
    east,
    south
  };
}
export default class Tile {
  constructor(_ref) {
    let getTileData = _ref.getTileData,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        onTileError = _ref.onTileError;
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

  get data() {
    if (this._data) {
      return Promise.resolve(this._data);
    }

    return this._loader;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  _loadData() {
    const x = this.x,
          y = this.y,
          z = this.z,
          bbox = this.bbox;

    if (!this.getTileData) {
      return null;
    }

    const getTileDataPromise = this.getTileData({
      x,
      y,
      z,
      bbox
    });
    return getTileDataPromise.then(buffers => {
      this._data = buffers;
      this._isLoaded = true;
      return buffers;
    }).catch(err => {
      this._isLoaded = true;
      this.onTileError(err);
    });
  }

  isOverlapped(tile) {
    const x = this.x,
          y = this.y,
          z = this.z;
    const m = Math.pow(2, tile.z - z);
    return Math.floor(tile.x / m) === x && Math.floor(tile.y / m) === y;
  }

}
//# sourceMappingURL=tile.js.map