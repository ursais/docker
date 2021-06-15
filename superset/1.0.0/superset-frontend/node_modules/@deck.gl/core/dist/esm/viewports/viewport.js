import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import log from '../utils/log';
import { createMat4, extractCameraVectors } from '../utils/math-utils';
import { Matrix4, Vector3, equals as _equals } from 'math.gl';
import * as mat4 from 'gl-matrix/mat4';
import { getDistanceScales as _getDistanceScales, getMeterZoom, lngLatToWorld, worldToLngLat, worldToPixels, pixelsToWorld } from 'viewport-mercator-project';
import assert from '../utils/assert';
var DEGREES_TO_RADIANS = Math.PI / 180;
var IDENTITY = createMat4();
var ZERO_VECTOR = [0, 0, 0];
var DEFAULT_ZOOM = 0;
var ERR_ARGUMENT = 'Illegal argument to Viewport';

var Viewport = function () {
  function Viewport() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Viewport);

    var _opts$id = opts.id,
        id = _opts$id === void 0 ? null : _opts$id,
        _opts$x = opts.x,
        x = _opts$x === void 0 ? 0 : _opts$x,
        _opts$y = opts.y,
        y = _opts$y === void 0 ? 0 : _opts$y,
        _opts$width = opts.width,
        width = _opts$width === void 0 ? 1 : _opts$width,
        _opts$height = opts.height,
        height = _opts$height === void 0 ? 1 : _opts$height;
    this.id = id || this.constructor.displayName || 'viewport';
    this.x = x;
    this.y = y;
    this.width = width || 1;
    this.height = height || 1;

    this._initViewMatrix(opts);

    this._initProjectionMatrix(opts);

    this._initPixelMatrices();

    this.equals = this.equals.bind(this);
    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.projectPosition = this.projectPosition.bind(this);
    this.unprojectPosition = this.unprojectPosition.bind(this);
    this.projectFlat = this.projectFlat.bind(this);
    this.unprojectFlat = this.unprojectFlat.bind(this);
    this.getMatrices = this.getMatrices.bind(this);
  }

  _createClass(Viewport, [{
    key: "equals",
    value: function equals(viewport) {
      if (!(viewport instanceof Viewport)) {
        return false;
      }

      return viewport.width === this.width && viewport.height === this.height && viewport.scale === this.scale && _equals(viewport.projectionMatrix, this.projectionMatrix) && _equals(viewport.viewMatrix, this.viewMatrix);
    }
  }, {
    key: "project",
    value: function project(xyz) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$topLeft = _ref.topLeft,
          topLeft = _ref$topLeft === void 0 ? true : _ref$topLeft;

      var worldPosition = this.projectPosition(xyz);
      var coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

      var _coord = _slicedToArray(coord, 2),
          x = _coord[0],
          y = _coord[1];

      var y2 = topLeft ? y : this.height - y;
      return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
    }
  }, {
    key: "unproject",
    value: function unproject(xyz) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$topLeft = _ref2.topLeft,
          topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft,
          targetZ = _ref2.targetZ;

      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

      var y2 = topLeft ? y : this.height - y;
      var targetZWorld = targetZ && targetZ * this.distanceScales.pixelsPerMeter[2];
      var coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

      var _this$unprojectPositi = this.unprojectPosition(coord),
          _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
          X = _this$unprojectPositi2[0],
          Y = _this$unprojectPositi2[1],
          Z = _this$unprojectPositi2[2];

      if (Number.isFinite(z)) {
        return [X, Y, Z];
      }

      return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
    }
  }, {
    key: "projectPosition",
    value: function projectPosition(xyz) {
      var _this$projectFlat = this.projectFlat(xyz),
          _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
          X = _this$projectFlat2[0],
          Y = _this$projectFlat2[1];

      var Z = (xyz[2] || 0) * this.distanceScales.pixelsPerMeter[2];
      return [X, Y, Z];
    }
  }, {
    key: "unprojectPosition",
    value: function unprojectPosition(xyz) {
      var _this$unprojectFlat = this.unprojectFlat(xyz),
          _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
          X = _this$unprojectFlat2[0],
          Y = _this$unprojectFlat2[1];

      var Z = (xyz[2] || 0) * this.distanceScales.metersPerPixel[2];
      return [X, Y, Z];
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

      if (this.isGeospatial) {
        return lngLatToWorld(xyz, scale);
      }

      var pixelsPerMeter = this.distanceScales.pixelsPerMeter;
      return [xyz[0] * pixelsPerMeter[0], xyz[1] * pixelsPerMeter[1]];
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

      if (this.isGeospatial) {
        return worldToLngLat(xyz, scale);
      }

      var metersPerPixel = this.distanceScales.metersPerPixel;
      return [xyz[0] * metersPerPixel[0], xyz[1] * metersPerPixel[1]];
    }
  }, {
    key: "getDistanceScales",
    value: function getDistanceScales() {
      var coordinateOrigin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (coordinateOrigin) {
        return _getDistanceScales({
          longitude: coordinateOrigin[0],
          latitude: coordinateOrigin[1],
          scale: this.scale,
          highPrecision: true
        });
      }

      return this.distanceScales;
    }
  }, {
    key: "getMatrices",
    value: function getMatrices() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$modelMatrix = _ref3.modelMatrix,
          modelMatrix = _ref3$modelMatrix === void 0 ? null : _ref3$modelMatrix;

      var modelViewProjectionMatrix = this.viewProjectionMatrix;
      var pixelProjectionMatrix = this.pixelProjectionMatrix;
      var pixelUnprojectionMatrix = this.pixelUnprojectionMatrix;

      if (modelMatrix) {
        modelViewProjectionMatrix = mat4.multiply([], this.viewProjectionMatrix, modelMatrix);
        pixelProjectionMatrix = mat4.multiply([], this.pixelProjectionMatrix, modelMatrix);
        pixelUnprojectionMatrix = mat4.invert([], pixelProjectionMatrix);
      }

      var matrices = Object.assign({
        modelViewProjectionMatrix: modelViewProjectionMatrix,
        viewProjectionMatrix: this.viewProjectionMatrix,
        viewMatrix: this.viewMatrix,
        projectionMatrix: this.projectionMatrix,
        pixelProjectionMatrix: pixelProjectionMatrix,
        pixelUnprojectionMatrix: pixelUnprojectionMatrix,
        width: this.width,
        height: this.height,
        scale: this.scale
      });
      return matrices;
    }
  }, {
    key: "containsPixel",
    value: function containsPixel(_ref4) {
      var x = _ref4.x,
          y = _ref4.y,
          _ref4$width = _ref4.width,
          width = _ref4$width === void 0 ? 1 : _ref4$width,
          _ref4$height = _ref4.height,
          height = _ref4$height === void 0 ? 1 : _ref4$height;
      return x < this.x + this.width && this.x < x + width && y < this.y + this.height && this.y < y + height;
    }
  }, {
    key: "getCameraPosition",
    value: function getCameraPosition() {
      return this.cameraPosition;
    }
  }, {
    key: "getCameraDirection",
    value: function getCameraDirection() {
      return this.cameraDirection;
    }
  }, {
    key: "getCameraUp",
    value: function getCameraUp() {
      return this.cameraUp;
    }
  }, {
    key: "_addMetersToLngLat",
    value: function _addMetersToLngLat(lngLatZ, xyz) {
      var _lngLatZ = _slicedToArray(lngLatZ, 3),
          lng = _lngLatZ[0],
          lat = _lngLatZ[1],
          _lngLatZ$ = _lngLatZ[2],
          Z = _lngLatZ$ === void 0 ? 0 : _lngLatZ$;

      var _this$_metersToLngLat = this._metersToLngLatDelta(xyz),
          _this$_metersToLngLat2 = _slicedToArray(_this$_metersToLngLat, 3),
          deltaLng = _this$_metersToLngLat2[0],
          deltaLat = _this$_metersToLngLat2[1],
          _this$_metersToLngLat3 = _this$_metersToLngLat2[2],
          deltaZ = _this$_metersToLngLat3 === void 0 ? 0 : _this$_metersToLngLat3;

      return lngLatZ.length === 2 ? [lng + deltaLng, lat + deltaLat] : [lng + deltaLng, lat + deltaLat, Z + deltaZ];
    }
  }, {
    key: "_metersToLngLatDelta",
    value: function _metersToLngLatDelta(xyz) {
      var _xyz2 = _slicedToArray(xyz, 3),
          x = _xyz2[0],
          y = _xyz2[1],
          _xyz2$ = _xyz2[2],
          z = _xyz2$ === void 0 ? 0 : _xyz2$;

      assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
      var _this$distanceScales = this.distanceScales,
          pixelsPerMeter = _this$distanceScales.pixelsPerMeter,
          degreesPerPixel = _this$distanceScales.degreesPerPixel;
      var deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
      var deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
      return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
    }
  }, {
    key: "_createProjectionMatrix",
    value: function _createProjectionMatrix(_ref5) {
      var orthographic = _ref5.orthographic,
          fovyRadians = _ref5.fovyRadians,
          aspect = _ref5.aspect,
          focalDistance = _ref5.focalDistance,
          near = _ref5.near,
          far = _ref5.far;
      assert(Number.isFinite(fovyRadians));
      return orthographic ? new Matrix4().orthographic({
        fovy: fovyRadians,
        aspect: aspect,
        focalDistance: focalDistance,
        near: near,
        far: far
      }) : new Matrix4().perspective({
        fovy: fovyRadians,
        aspect: aspect,
        near: near,
        far: far
      });
    }
  }, {
    key: "_initViewMatrix",
    value: function _initViewMatrix(opts) {
      var _opts$viewMatrix = opts.viewMatrix,
          viewMatrix = _opts$viewMatrix === void 0 ? IDENTITY : _opts$viewMatrix,
          _opts$longitude = opts.longitude,
          longitude = _opts$longitude === void 0 ? null : _opts$longitude,
          _opts$latitude = opts.latitude,
          latitude = _opts$latitude === void 0 ? null : _opts$latitude,
          _opts$zoom = opts.zoom,
          zoom = _opts$zoom === void 0 ? null : _opts$zoom,
          _opts$position = opts.position,
          position = _opts$position === void 0 ? null : _opts$position,
          _opts$modelMatrix = opts.modelMatrix,
          modelMatrix = _opts$modelMatrix === void 0 ? null : _opts$modelMatrix,
          _opts$focalDistance = opts.focalDistance,
          focalDistance = _opts$focalDistance === void 0 ? 1 : _opts$focalDistance,
          _opts$distanceScales = opts.distanceScales,
          distanceScales = _opts$distanceScales === void 0 ? null : _opts$distanceScales;
      this.isGeospatial = Number.isFinite(latitude) && Number.isFinite(longitude);
      this.zoom = zoom;

      if (!Number.isFinite(this.zoom)) {
        this.zoom = this.isGeospatial ? getMeterZoom({
          latitude: latitude
        }) + Math.log2(focalDistance) : DEFAULT_ZOOM;
      }

      var scale = Math.pow(2, this.zoom);
      this.scale = scale;
      this.distanceScales = this.isGeospatial ? _getDistanceScales({
        latitude: latitude,
        longitude: longitude,
        scale: this.scale
      }) : distanceScales || {
        pixelsPerMeter: [scale, scale, scale],
        metersPerPixel: [1 / scale, 1 / scale, 1 / scale]
      };
      this.focalDistance = focalDistance;
      this.distanceScales.metersPerPixel = new Vector3(this.distanceScales.metersPerPixel);
      this.distanceScales.pixelsPerMeter = new Vector3(this.distanceScales.pixelsPerMeter);
      this.position = ZERO_VECTOR;
      this.meterOffset = ZERO_VECTOR;

      if (position) {
        this.position = position;
        this.modelMatrix = modelMatrix;
        this.meterOffset = modelMatrix ? modelMatrix.transformVector(position) : position;
      }

      if (this.isGeospatial) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.center = this._getCenterInWorld({
          longitude: longitude,
          latitude: latitude
        });
        this.viewMatrixUncentered = mat4.scale([], viewMatrix, [1, -1, 1]);
      } else {
        this.center = position ? this.projectPosition(position) : [0, 0, 0];
        this.viewMatrixUncentered = viewMatrix;
      }

      this.viewMatrix = new Matrix4().multiplyRight(this.viewMatrixUncentered).translate(new Vector3(this.center || ZERO_VECTOR).negate());
    }
  }, {
    key: "_getCenterInWorld",
    value: function _getCenterInWorld(_ref6) {
      var longitude = _ref6.longitude,
          latitude = _ref6.latitude;
      var meterOffset = this.meterOffset,
          scale = this.scale,
          distanceScales = this.distanceScales;
      var center2d = this.projectFlat([longitude, latitude], scale);
      var center = new Vector3(center2d[0], center2d[1], 0);

      if (meterOffset) {
        var pixelPosition = new Vector3(meterOffset).scale(distanceScales.pixelsPerMeter);
        center.add(pixelPosition);
      }

      return center;
    }
  }, {
    key: "_initProjectionMatrix",
    value: function _initProjectionMatrix(opts) {
      var _opts$projectionMatri = opts.projectionMatrix,
          projectionMatrix = _opts$projectionMatri === void 0 ? null : _opts$projectionMatri,
          _opts$orthographic = opts.orthographic,
          orthographic = _opts$orthographic === void 0 ? false : _opts$orthographic,
          fovyRadians = opts.fovyRadians,
          fovyDegrees = opts.fovyDegrees,
          fovy = opts.fovy,
          _opts$near = opts.near,
          near = _opts$near === void 0 ? 0.1 : _opts$near,
          _opts$far = opts.far,
          far = _opts$far === void 0 ? 1000 : _opts$far,
          _opts$focalDistance2 = opts.focalDistance,
          focalDistance = _opts$focalDistance2 === void 0 ? 1 : _opts$focalDistance2,
          orthographicFocalDistance = opts.orthographicFocalDistance;
      var radians = fovyRadians || (fovyDegrees || fovy || 75) * DEGREES_TO_RADIANS;
      this.projectionMatrix = projectionMatrix || this._createProjectionMatrix({
        orthographic: orthographic,
        fovyRadians: radians,
        aspect: this.width / this.height,
        focalDistance: orthographicFocalDistance || focalDistance,
        near: near,
        far: far
      });
    }
  }, {
    key: "_initPixelMatrices",
    value: function _initPixelMatrices() {
      var vpm = createMat4();
      mat4.multiply(vpm, vpm, this.projectionMatrix);
      mat4.multiply(vpm, vpm, this.viewMatrix);
      this.viewProjectionMatrix = vpm;
      this.viewMatrixInverse = mat4.invert([], this.viewMatrix) || this.viewMatrix;

      var _extractCameraVectors = extractCameraVectors({
        viewMatrix: this.viewMatrix,
        viewMatrixInverse: this.viewMatrixInverse
      }),
          eye = _extractCameraVectors.eye,
          direction = _extractCameraVectors.direction,
          up = _extractCameraVectors.up;

      this.cameraPosition = eye;
      this.cameraDirection = direction;
      this.cameraUp = up;
      var viewportMatrix = createMat4();
      var pixelProjectionMatrix = createMat4();
      mat4.scale(viewportMatrix, viewportMatrix, [this.width / 2, -this.height / 2, 1]);
      mat4.translate(viewportMatrix, viewportMatrix, [1, -1, 0]);
      mat4.multiply(pixelProjectionMatrix, viewportMatrix, this.viewProjectionMatrix);
      this.pixelProjectionMatrix = pixelProjectionMatrix;
      this.viewportMatrix = viewportMatrix;
      this.pixelUnprojectionMatrix = mat4.invert(createMat4(), this.pixelProjectionMatrix);

      if (!this.pixelUnprojectionMatrix) {
        log.warn('Pixel project matrix not invertible')();
      }
    }
  }]);

  return Viewport;
}();

export { Viewport as default };
Viewport.displayName = 'Viewport';
//# sourceMappingURL=viewport.js.map