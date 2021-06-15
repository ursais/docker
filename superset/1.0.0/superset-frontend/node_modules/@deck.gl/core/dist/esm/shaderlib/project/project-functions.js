import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { COORDINATE_SYSTEM } from '../../lib/constants';
import { LNGLAT_AUTO_OFFSET_ZOOM_THRESHOLD } from './viewport-uniforms';
import * as vec4 from 'gl-matrix/vec4';
import * as vec3 from 'gl-matrix/vec3';
import { getDistanceScales, addMetersToLngLat } from 'viewport-mercator-project';

function lngLatZToWorldPosition(lngLatZ, viewport) {
  var offsetMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var _lngLatZ = _slicedToArray(lngLatZ, 3),
      longitude = _lngLatZ[0],
      latitude = _lngLatZ[1],
      _lngLatZ$ = _lngLatZ[2],
      z = _lngLatZ$ === void 0 ? 0 : _lngLatZ$;

  var _viewport$projectFlat = viewport.projectFlat(lngLatZ),
      _viewport$projectFlat2 = _slicedToArray(_viewport$projectFlat, 2),
      X = _viewport$projectFlat2[0],
      Y = _viewport$projectFlat2[1];

  var distanceScales = offsetMode ? getDistanceScales({
    longitude: longitude,
    latitude: latitude,
    scale: viewport.scale
  }) : viewport.getDistanceScales();
  var Z = z * distanceScales.pixelsPerMeter[2];
  return [X, Y, Z];
}

function normalizeParameters(opts) {
  var normalizedParams = Object.assign({}, opts);
  var viewport = opts.viewport,
      coordinateSystem = opts.coordinateSystem,
      coordinateOrigin = opts.coordinateOrigin,
      fromCoordinateSystem = opts.fromCoordinateSystem,
      fromCoordinateOrigin = opts.fromCoordinateOrigin;

  if (fromCoordinateSystem === undefined) {
    normalizedParams.fromCoordinateSystem = coordinateSystem;
  }

  if (fromCoordinateOrigin === undefined) {
    normalizedParams.fromCoordinateOrigin = coordinateOrigin;
  }

  if (coordinateSystem === COORDINATE_SYSTEM.LNGLAT && viewport.zoom >= LNGLAT_AUTO_OFFSET_ZOOM_THRESHOLD) {
    normalizedParams.coordinateSystem = COORDINATE_SYSTEM.LNGLAT_OFFSETS;
    normalizedParams.coordinateOrigin = [Math.fround(viewport.longitude), Math.fround(viewport.latitude)];
  }

  return normalizedParams;
}

export function getWorldPosition(position, _ref) {
  var viewport = _ref.viewport,
      modelMatrix = _ref.modelMatrix,
      coordinateSystem = _ref.coordinateSystem,
      coordinateOrigin = _ref.coordinateOrigin,
      offsetMode = _ref.offsetMode;

  var _position = _slicedToArray(position, 3),
      x = _position[0],
      y = _position[1],
      z = _position[2];

  if (modelMatrix) {
    var _vec4$transformMat = vec4.transformMat4([], [x, y, z, 1.0], modelMatrix);

    var _vec4$transformMat2 = _slicedToArray(_vec4$transformMat, 3);

    x = _vec4$transformMat2[0];
    y = _vec4$transformMat2[1];
    z = _vec4$transformMat2[2];
  }

  switch (coordinateSystem) {
    case COORDINATE_SYSTEM.LNGLAT:
    case COORDINATE_SYSTEM.LNGLAT_DEPRECATED:
      return lngLatZToWorldPosition([x, y, z], viewport, offsetMode);

    case COORDINATE_SYSTEM.LNGLAT_OFFSETS:
      return lngLatZToWorldPosition([x + coordinateOrigin[0], y + coordinateOrigin[1], z + (coordinateOrigin[2] || 0)], viewport, offsetMode);

    case COORDINATE_SYSTEM.METER_OFFSETS:
      return lngLatZToWorldPosition(addMetersToLngLat(coordinateOrigin, [x, y, z]), viewport, offsetMode);

    case COORDINATE_SYSTEM.IDENTITY:
    default:
      return viewport.projectPosition([x, y, z]);
  }
}
export function projectPosition(position, params) {
  var _normalizeParameters = normalizeParameters(params),
      viewport = _normalizeParameters.viewport,
      coordinateSystem = _normalizeParameters.coordinateSystem,
      coordinateOrigin = _normalizeParameters.coordinateOrigin,
      modelMatrix = _normalizeParameters.modelMatrix,
      fromCoordinateSystem = _normalizeParameters.fromCoordinateSystem,
      fromCoordinateOrigin = _normalizeParameters.fromCoordinateOrigin;

  switch (coordinateSystem) {
    case COORDINATE_SYSTEM.LNGLAT_OFFSETS:
    case COORDINATE_SYSTEM.METER_OFFSETS:
      {
        var worldPosition = getWorldPosition(position, {
          viewport: viewport,
          modelMatrix: modelMatrix,
          coordinateSystem: fromCoordinateSystem,
          coordinateOrigin: fromCoordinateOrigin,
          offsetMode: true
        });
        var originWorld = lngLatZToWorldPosition(coordinateOrigin, viewport, true);
        vec3.sub(worldPosition, worldPosition, originWorld);
        return worldPosition;
      }

    case COORDINATE_SYSTEM.LNGLAT:
    case COORDINATE_SYSTEM.LNGLAT_DEPRECATED:
    case COORDINATE_SYSTEM.IDENTITY:
    default:
      return getWorldPosition(position, {
        viewport: viewport,
        modelMatrix: modelMatrix,
        coordinateSystem: fromCoordinateSystem,
        coordinateOrigin: fromCoordinateOrigin,
        offsetMode: false
      });
  }
}
//# sourceMappingURL=project-functions.js.map