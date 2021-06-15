"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTileIndices = getTileIndices;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _viewportMercatorProject = require("viewport-mercator-project");

var TILE_SIZE = 512;

function getBoundingBox(viewport) {
  var corners = [viewport.unproject([0, 0]), viewport.unproject([viewport.width, 0]), viewport.unproject([0, viewport.height]), viewport.unproject([viewport.width, viewport.height])];
  return [corners.reduce(function (minLng, p) {
    return minLng < p[0] ? minLng : p[0];
  }, 180), corners.reduce(function (minLat, p) {
    return minLat < p[1] ? minLat : p[1];
  }, 90), corners.reduce(function (maxLng, p) {
    return maxLng > p[0] ? maxLng : p[0];
  }, -180), corners.reduce(function (maxLat, p) {
    return maxLat > p[1] ? maxLat : p[1];
  }, -90)];
}

function pixelsToTileIndex(a) {
  return a / TILE_SIZE;
}

function getTileIndices(viewport, maxZoom, minZoom) {
  var z = Math.floor(viewport.zoom);

  if (minZoom && z < minZoom) {
    return [];
  }

  viewport = new viewport.constructor(Object.assign({}, viewport, {
    zoom: z
  }));
  var bbox = getBoundingBox(viewport);

  var _lngLatToWorld$map = (0, _viewportMercatorProject.lngLatToWorld)([bbox[0], bbox[3]], viewport.scale).map(pixelsToTileIndex),
      _lngLatToWorld$map2 = (0, _slicedToArray2.default)(_lngLatToWorld$map, 2),
      minX = _lngLatToWorld$map2[0],
      minY = _lngLatToWorld$map2[1];

  var _lngLatToWorld$map3 = (0, _viewportMercatorProject.lngLatToWorld)([bbox[2], bbox[1]], viewport.scale).map(pixelsToTileIndex),
      _lngLatToWorld$map4 = (0, _slicedToArray2.default)(_lngLatToWorld$map3, 2),
      maxX = _lngLatToWorld$map4[0],
      maxY = _lngLatToWorld$map4[1];

  minX = Math.max(0, Math.floor(minX));
  maxX = Math.min(viewport.scale, Math.ceil(maxX));
  minY = Math.max(0, Math.floor(minY));
  maxY = Math.min(viewport.scale, Math.ceil(maxY));
  var indices = [];

  for (var x = minX; x < maxX; x++) {
    for (var y = minY; y < maxY; y++) {
      if (maxZoom && z > maxZoom) {
        indices.push(getAdjustedTileIndex({
          x: x,
          y: y,
          z: z
        }, maxZoom));
      } else {
        indices.push({
          x: x,
          y: y,
          z: z
        });
      }
    }
  }

  return indices;
}

function getAdjustedTileIndex(_ref, adjustedZ) {
  var x = _ref.x,
      y = _ref.y,
      z = _ref.z;
  var m = Math.pow(2, z - adjustedZ);
  return {
    x: Math.floor(x / m),
    y: Math.floor(y / m),
    z: adjustedZ
  };
}
//# sourceMappingURL=viewport-util.js.map