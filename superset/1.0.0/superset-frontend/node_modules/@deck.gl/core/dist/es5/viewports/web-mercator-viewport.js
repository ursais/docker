"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _viewport = _interopRequireDefault(require("./viewport"));

var _viewportMercatorProject = require("viewport-mercator-project");

var vec2 = _interopRequireWildcard(require("gl-matrix/vec2"));

var _assert = _interopRequireDefault(require("../utils/assert"));

var ERR_ARGUMENT = 'Illegal argument to WebMercatorViewport';

var WebMercatorViewport = function (_Viewport) {
  (0, _inherits2.default)(WebMercatorViewport, _Viewport);

  function WebMercatorViewport() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, WebMercatorViewport);
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

    var _getProjectionParamet = (0, _viewportMercatorProject.getProjectionParameters)({
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

    var viewMatrixUncentered = (0, _viewportMercatorProject.getViewMatrix)({
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
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WebMercatorViewport).call(this, viewportOpts));
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;
    _this.orthographic = orthographic;
    _this.metersToLngLatDelta = _this.metersToLngLatDelta.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.lngLatDeltaToMeters = _this.lngLatDeltaToMeters.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.addMetersToLngLat = _this.addMetersToLngLat.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    Object.freeze((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(WebMercatorViewport, [{
    key: "metersToLngLatDelta",
    value: function metersToLngLatDelta(xyz) {
      var _xyz = (0, _slicedToArray2.default)(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          _xyz$ = _xyz[2],
          z = _xyz$ === void 0 ? 0 : _xyz$;

      (0, _assert.default)(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
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
      var _deltaLngLatZ = (0, _slicedToArray2.default)(deltaLngLatZ, 3),
          deltaLng = _deltaLngLatZ[0],
          deltaLat = _deltaLngLatZ[1],
          _deltaLngLatZ$ = _deltaLngLatZ[2],
          deltaZ = _deltaLngLatZ$ === void 0 ? 0 : _deltaLngLatZ$;

      (0, _assert.default)(Number.isFinite(deltaLng) && Number.isFinite(deltaLat) && Number.isFinite(deltaZ), ERR_ARGUMENT);
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
      return (0, _viewportMercatorProject.addMetersToLngLat)(lngLatZ, xyz);
    }
  }, {
    key: "getMapCenterByLngLatPosition",
    value: function getMapCenterByLngLatPosition(_ref) {
      var lngLat = _ref.lngLat,
          pos = _ref.pos;
      var fromLocation = (0, _viewportMercatorProject.pixelsToWorld)(pos, this.pixelUnprojectionMatrix);
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

      var _fitBounds2 = (0, _viewportMercatorProject.fitBounds)(Object.assign({
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
}(_viewport.default);

exports.default = WebMercatorViewport;
WebMercatorViewport.displayName = 'WebMercatorViewport';
//# sourceMappingURL=web-mercator-viewport.js.map