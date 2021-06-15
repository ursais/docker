import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { createIterable } from '@deck.gl/core';
const R_EARTH = 6378000;
export function pointToDensityGridDataCPU(points, cellSize, getPosition) {
  const _pointsToGridHashing2 = _pointsToGridHashing(points, cellSize, getPosition),
        gridHash = _pointsToGridHashing2.gridHash,
        gridOffset = _pointsToGridHashing2.gridOffset;

  const layerData = _getGridLayerDataFromGridHash(gridHash, gridOffset);

  return {
    gridHash,
    gridOffset,
    layerData
  };
}

function _pointsToGridHashing() {
  let points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let cellSize = arguments.length > 1 ? arguments[1] : undefined;
  let getPosition = arguments.length > 2 ? arguments[2] : undefined;
  let latMin = Infinity;
  let latMax = -Infinity;
  let pLat;

  const _createIterable = createIterable(points),
        iterable = _createIterable.iterable,
        objectInfo = _createIterable.objectInfo;

  for (const pt of iterable) {
    objectInfo.index++;
    pLat = getPosition(pt, objectInfo)[1];

    if (Number.isFinite(pLat)) {
      latMin = pLat < latMin ? pLat : latMin;
      latMax = pLat > latMax ? pLat : latMax;
    }
  }

  const centerLat = (latMin + latMax) / 2;

  const gridOffset = _calculateGridLatLonOffset(cellSize, centerLat);

  if (gridOffset.xOffset <= 0 || gridOffset.yOffset <= 0) {
    return {
      gridHash: {},
      gridOffset
    };
  }

  const gridHash = {};
  objectInfo.index = -1;

  for (const pt of iterable) {
    objectInfo.index++;

    const _getPosition = getPosition(pt, objectInfo),
          _getPosition2 = _slicedToArray(_getPosition, 2),
          lng = _getPosition2[0],
          lat = _getPosition2[1];

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const latIdx = Math.floor((lat + 90) / gridOffset.yOffset);
      const lonIdx = Math.floor((lng + 180) / gridOffset.xOffset);
      const key = `${latIdx}-${lonIdx}`;
      gridHash[key] = gridHash[key] || {
        count: 0,
        points: []
      };
      gridHash[key].count += 1;
      gridHash[key].points.push(pt);
    }
  }

  return {
    gridHash,
    gridOffset
  };
}

function _getGridLayerDataFromGridHash(gridHash, gridOffset) {
  return Object.keys(gridHash).reduce((accu, key, i) => {
    const idxs = key.split('-');
    const latIdx = parseInt(idxs[0], 10);
    const lonIdx = parseInt(idxs[1], 10);
    accu.push(Object.assign({
      index: i,
      position: [-180 + gridOffset.xOffset * lonIdx, -90 + gridOffset.yOffset * latIdx]
    }, gridHash[key]));
    return accu;
  }, []);
}

function _calculateGridLatLonOffset(cellSize, latitude) {
  const yOffset = _calculateLatOffset(cellSize);

  const xOffset = _calculateLonOffset(latitude, cellSize);

  return {
    yOffset,
    xOffset
  };
}

function _calculateLatOffset(dy) {
  return dy / R_EARTH * (180 / Math.PI);
}

function _calculateLonOffset(lat, dx) {
  return dx / R_EARTH * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
}
//# sourceMappingURL=grid-aggregator.js.map