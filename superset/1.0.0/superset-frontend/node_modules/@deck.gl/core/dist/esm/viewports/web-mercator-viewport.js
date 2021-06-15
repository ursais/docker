import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import Viewport from './viewport';
import { pixelsToWorld, getViewMatrix, addMetersToLngLat as _addMetersToLngLat, getProjectionParameters, fitBounds as _fitBounds } from 'viewport-mercator-project';
import * as vec2 from 'gl-matrix/vec2';
import assert from '../utils/assert';
var ERR_ARGUMENT = 'Illegal argument to WebMercatorViewport';

var WebMercatorViewport = function (_Viewport) {
  _inherits(WebMercatorViewport, _Viewport);

  function WebMercatorViewport() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebMercatorViewport);

    var _opts$latitude = opts.latitude,
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
    var width = opts.width,
        height = opts.height,
        _opts$altitude = opts.altitude,
        altitude = _opts$altitude === void 0 ? 1.5 : _opts$altitude;
    width = width || 1;
    height = height || 1;
    altitude = Math.max(0.75, altitude);

    var _getProjectionParamet = getProjectionParameters({
      width: width,
      height: height,
      pitch: pitch,
      altitude: altitude,
      nearZMultiplier: nearZMultiplier,
      farZMultiplier: farZMultiplier
    }),
        fov = _getProjectionParamet.fov,
        aspect = _getProjectionParamet.aspect,
        focalDistance = _getProjectionParamet.focalDistance,
        near = _getProjectionParamet.near,
        far = _getProjectionParamet.far;

    var viewMatrixUncentered = getViewMatrix({
      height: height,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude
    });
    var viewportOpts = Object.assign({}, opts, {
      width: width,
      height: height,
      viewMatrix: viewMatrixUncentered,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
      orthographic: orthographic,
      fovyRadians: fov,
      aspect: aspect,
      orthographicFocalDistance: focalDistance,
      near: near,
      far: far
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebMercatorViewport).call(this, viewportOpts));
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;
    _this.orthographic = orthographic;
    _this.metersToLngLatDelta = _this.metersToLngLatDelta.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.lngLatDeltaToMeters = _this.lngLatDeltaToMeters.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.addMetersToLngLat = _this.addMetersToLngLat.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    Object.freeze(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(WebMercatorViewport, [{
    key: "metersToLngLatDelta",
    value: function metersToLngLatDelta(xyz) {
      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          _xyz$ = _xyz[2],
          z = _xyz$ === void 0 ? 0 : _xyz$;

      assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
      var _this$distanceScales = this.distanceScales,
          pixelsPerMeter = _this$distanceScales.pixelsPerMeter,
          degreesPerPixel = _this$distanceScales.degreesPerPixel;
      var deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
      var deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
      return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
    }
  }, {
    key: "lngLatDeltaToMeters",
    value: function lngLatDeltaToMeters(deltaLngLatZ) {
      var _deltaLngLatZ = _slicedToArray(deltaLngLatZ, 3),
          deltaLng = _deltaLngLatZ[0],
          deltaLat = _deltaLngLatZ[1],
          _deltaLngLatZ$ = _deltaLngLatZ[2],
          deltaZ = _deltaLngLatZ$ === void 0 ? 0 : _deltaLngLatZ$;

      assert(Number.isFinite(deltaLng) && Number.isFinite(deltaLat) && Number.isFinite(deltaZ), ERR_ARGUMENT);
      var _this$distanceScales2 = this.distanceScales,
          pixelsPerDegree = _this$distanceScales2.pixelsPerDegree,
          metersPerPixel = _this$distanceScales2.metersPerPixel;
      var deltaX = deltaLng * pixelsPerDegree[0] * metersPerPixel[0];
      var deltaY = deltaLat * pixelsPerDegree[1] * metersPerPixel[1];
      return deltaLngLatZ.length === 2 ? [deltaX, deltaY] : [deltaX, deltaY, deltaZ];
    }
  }, {
    key: "addMetersToLngLat",
    value: function addMetersToLngLat(lngLatZ, xyz) {
      return _addMetersToLngLat(lngLatZ, xyz);
    }
  }, {
    key: "getMapCenterByLngLatPosition",
    value: function getMapCenterByLngLatPosition(_ref) {
      var lngLat = _ref.lngLat,
          pos = _ref.pos;
      var fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
      var toLocation = this.projectFlat(lngLat);
      var translate = vec2.add([], toLocation, vec2.negate([], fromLocation));
      var newCenter = vec2.add([], this.center, translate);
      return this.unprojectFlat(newCenter);
    }
  }, {
    key: "getLocationAtPoint",
    value: function getLocationAtPoint(_ref2) {
      var lngLat = _ref2.lngLat,
          pos = _ref2.pos;
      return this.getMapCenterByLngLatPosition({
        lngLat: lngLat,
        pos: pos
      });
    }
  }, {
    key: "fitBounds",
    value: function fitBounds(bounds) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var width = this.width,
          height = this.height;

      var _fitBounds2 = _fitBounds(Object.assign({
        width: width,
        height: height,
        bounds: bounds
      }, options)),
          longitude = _fitBounds2.longitude,
          latitude = _fitBounds2.latitude,
          zoom = _fitBounds2.zoom;

      return new WebMercatorViewport({
        width: width,
        height: height,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom
      });
    }
  }]);

  return WebMercatorViewport;
}(Viewport);

export { WebMercatorViewport as default };
WebMercatorViewport.displayName = 'WebMercatorViewport';
//# sourceMappingURL=web-mercator-viewport.js.map