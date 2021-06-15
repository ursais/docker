import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { S2 } from 's2-geometry';
import Long from 'long';

function getIdFromToken(token) {
  var paddedToken = token.padEnd(16, '0');
  return Long.fromString(paddedToken, 16);
}

var RADIAN_TO_DEGREE = 180 / Math.PI;
var MAX_RESOLUTION = 100;

function XYZToLngLat(_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      x = _ref2[0],
      y = _ref2[1],
      z = _ref2[2];

  var lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  var lng = Math.atan2(y, x);
  return [lng * RADIAN_TO_DEGREE, lat * RADIAN_TO_DEGREE];
}

function getGeoBounds(_ref3) {
  var face = _ref3.face,
      ij = _ref3.ij,
      level = _ref3.level;
  var result = [];
  var offsets = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];
  var resolution = Math.max(1, MAX_RESOLUTION * Math.pow(2, -level));

  for (var i = 0; i < 4; i++) {
    var offset = offsets[i].slice(0);
    var nextOffset = offsets[i + 1];
    var stepI = (nextOffset[0] - offset[0]) / resolution;
    var stepJ = (nextOffset[1] - offset[1]) / resolution;

    for (var j = 0; j < resolution; j++) {
      offset[0] += stepI;
      offset[1] += stepJ;
      var st = S2.IJToST(ij, level, offset);
      var uv = S2.STToUV(st);
      var xyz = S2.FaceUVToXYZ(face, uv);
      result.push(XYZToLngLat(xyz));
    }
  }

  return result;
}

export function getS2QuadKey(token) {
  if (typeof token === 'string') {
    if (token.indexOf('/') > 0) {
      return token;
    }

    token = getIdFromToken(token);
  }

  return S2.S2Cell.toHilbertQuadkey(token.toString());
}
export function getS2Polygon(token) {
  var key = getS2QuadKey(token);
  var s2cell = S2.S2Cell.FromHilbertQuadKey(key);
  return getGeoBounds(s2cell);
}
//# sourceMappingURL=s2-utils.js.map