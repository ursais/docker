import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import Viewport from './viewport';
import { pixelsToWorld, getViewMatrix, addMetersToLngLat, getProjectionParameters, fitBounds } from 'viewport-mercator-project';
import * as vec2 from 'gl-matrix/vec2';
import assert from '../utils/assert';
const ERR_ARGUMENT = 'Illegal argument to WebMercatorViewport';
export default class WebMercatorViewport extends Viewport {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _opts$latitude = opts.latitude,
          latitude = _opts$latitude === void 0 ? 0 : _opts$latitude,
          _opts$longitude = opts.longitude,
          longitude = _opts$longitude === void 0 ? 0 : _opts$longitude,
          _opts$zoom = opts.zoom,
          zoom = _opts$zoom === void 0 ? 11 : _opts$zoom,
          _opts$pitch = opts.pitch,
          pitch = _opts$pitch === void 0 ? 0 : _opts$pitch,
          _opts$bearing = opts.bearing,
          bearing = _opts$bearing === void 0 ? 0 : _opts$bearing,
          _opts$nearZMultiplier = opts.nearZMultiplier,
          nearZMultiplier = _opts$nearZMultiplier === void 0 ? 0.1 : _opts$nearZMultiplier,
          _opts$farZMultiplier = opts.farZMultiplier,
          farZMultiplier = _opts$farZMultiplier === void 0 ? 10 : _opts$farZMultiplier,
          _opts$orthographic = opts.orthographic,
          orthographic = _opts$orthographic === void 0 ? false : _opts$orthographic;
    let width = opts.width,
        height = opts.height,
        _opts$altitude = opts.altitude,
        altitude = _opts$altitude === void 0 ? 1.5 : _opts$altitude;
    width = width || 1;
    height = height || 1;
    altitude = Math.max(0.75, altitude);

    const _getProjectionParamet = getProjectionParameters({
      width,
      height,
      pitch,
      altitude,
      nearZMultiplier,
      farZMultiplier
    }),
          fov = _getProjectionParamet.fov,
          aspect = _getProjectionParamet.aspect,
          focalDistance = _getProjectionParamet.focalDistance,
          near = _getProjectionParamet.near,
          far = _getProjectionParamet.far;

    const viewMatrixUncentered = getViewMatrix({
      height,
      pitch,
      bearing,
      altitude
    });
    const viewportOpts = Object.assign({}, opts, {
      width,
      height,
      viewMatrix: viewMatrixUncentered,
      longitude,
      latitude,
      zoom,
      orthographic,
      fovyRadians: fov,
      aspect,
      orthographicFocalDistance: focalDistance,
      near,
      far
    });
    super(viewportOpts);
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.pitch = pitch;
    this.bearing = bearing;
    this.altitude = altitude;
    this.orthographic = orthographic;
    this.metersToLngLatDelta = this.metersToLngLatDelta.bind(this);
    this.lngLatDeltaToMeters = this.lngLatDeltaToMeters.bind(this);
    this.addMetersToLngLat = this.addMetersToLngLat.bind(this);
    Object.freeze(this);
  }

  metersToLngLatDelta(xyz) {
    const _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          _xyz$ = _xyz[2],
          z = _xyz$ === void 0 ? 0 : _xyz$;

    assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
    const _this$distanceScales = this.distanceScales,
          pixelsPerMeter = _this$distanceScales.pixelsPerMeter,
          degreesPerPixel = _this$distanceScales.degreesPerPixel;
    const deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
    const deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
    return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
  }

  lngLatDeltaToMeters(deltaLngLatZ) {
    const _deltaLngLatZ = _slicedToArray(deltaLngLatZ, 3),
          deltaLng = _deltaLngLatZ[0],
          deltaLat = _deltaLngLatZ[1],
          _deltaLngLatZ$ = _deltaLngLatZ[2],
          deltaZ = _deltaLngLatZ$ === void 0 ? 0 : _deltaLngLatZ$;

    assert(Number.isFinite(deltaLng) && Number.isFinite(deltaLat) && Number.isFinite(deltaZ), ERR_ARGUMENT);
    const _this$distanceScales2 = this.distanceScales,
          pixelsPerDegree = _this$distanceScales2.pixelsPerDegree,
          metersPerPixel = _this$distanceScales2.metersPerPixel;
    const deltaX = deltaLng * pixelsPerDegree[0] * metersPerPixel[0];
    const deltaY = deltaLat * pixelsPerDegree[1] * metersPerPixel[1];
    return deltaLngLatZ.length === 2 ? [deltaX, deltaY] : [deltaX, deltaY, deltaZ];
  }

  addMetersToLngLat(lngLatZ, xyz) {
    return addMetersToLngLat(lngLatZ, xyz);
  }

  getMapCenterByLngLatPosition(_ref) {
    let lngLat = _ref.lngLat,
        pos = _ref.pos;
    const fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
    const toLocation = this.projectFlat(lngLat);
    const translate = vec2.add([], toLocation, vec2.negate([], fromLocation));
    const newCenter = vec2.add([], this.center, translate);
    return this.unprojectFlat(newCenter);
  }

  getLocationAtPoint(_ref2) {
    let lngLat = _ref2.lngLat,
        pos = _ref2.pos;
    return this.getMapCenterByLngLatPosition({
      lngLat,
      pos
    });
  }

  fitBounds(bounds) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const width = this.width,
          height = this.height;

    const _fitBounds = fitBounds(Object.assign({
      width,
      height,
      bounds
    }, options)),
          longitude = _fitBounds.longitude,
          latitude = _fitBounds.latitude,
          zoom = _fitBounds.zoom;

    return new WebMercatorViewport({
      width,
      height,
      longitude,
      latitude,
      zoom
    });
  }

}
WebMercatorViewport.displayName = 'WebMercatorViewport';
//# sourceMappingURL=web-mercator-viewport.js.map