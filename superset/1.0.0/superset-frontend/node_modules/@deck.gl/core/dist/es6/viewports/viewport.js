import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import log from '../utils/log';
import { createMat4, extractCameraVectors } from '../utils/math-utils';
import { Matrix4, Vector3, equals } from 'math.gl';
import * as mat4 from 'gl-matrix/mat4';
import { getDistanceScales, getMeterZoom, lngLatToWorld, worldToLngLat, worldToPixels, pixelsToWorld } from 'viewport-mercator-project';
import assert from '../utils/assert';
const DEGREES_TO_RADIANS = Math.PI / 180;
const IDENTITY = createMat4();
const ZERO_VECTOR = [0, 0, 0];
const DEFAULT_ZOOM = 0;
const ERR_ARGUMENT = 'Illegal argument to Viewport';
export default class Viewport {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _opts$id = opts.id,
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

  equals(viewport) {
    if (!(viewport instanceof Viewport)) {
      return false;
    }

    return viewport.width === this.width && viewport.height === this.height && viewport.scale === this.scale && equals(viewport.projectionMatrix, this.projectionMatrix) && equals(viewport.viewMatrix, this.viewMatrix);
  }

  project(xyz) {
    let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$topLeft = _ref.topLeft,
        topLeft = _ref$topLeft === void 0 ? true : _ref$topLeft;

    const worldPosition = this.projectPosition(xyz);
    const coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

    const _coord = _slicedToArray(coord, 2),
          x = _coord[0],
          y = _coord[1];

    const y2 = topLeft ? y : this.height - y;
    return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
  }

  unproject(xyz) {
    let _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$topLeft = _ref2.topLeft,
        topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft,
        targetZ = _ref2.targetZ;

    const _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

    const y2 = topLeft ? y : this.height - y;
    const targetZWorld = targetZ && targetZ * this.distanceScales.pixelsPerMeter[2];
    const coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

    const _this$unprojectPositi = this.unprojectPosition(coord),
          _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
          X = _this$unprojectPositi2[0],
          Y = _this$unprojectPositi2[1],
          Z = _this$unprojectPositi2[2];

    if (Number.isFinite(z)) {
      return [X, Y, Z];
    }

    return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
  }

  projectPosition(xyz) {
    const _this$projectFlat = this.projectFlat(xyz),
          _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
          X = _this$projectFlat2[0],
          Y = _this$projectFlat2[1];

    const Z = (xyz[2] || 0) * this.distanceScales.pixelsPerMeter[2];
    return [X, Y, Z];
  }

  unprojectPosition(xyz) {
    const _this$unprojectFlat = this.unprojectFlat(xyz),
          _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
          X = _this$unprojectFlat2[0],
          Y = _this$unprojectFlat2[1];

    const Z = (xyz[2] || 0) * this.distanceScales.metersPerPixel[2];
    return [X, Y, Z];
  }

  projectFlat(xyz) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

    if (this.isGeospatial) {
      return lngLatToWorld(xyz, scale);
    }

    const pixelsPerMeter = this.distanceScales.pixelsPerMeter;
    return [xyz[0] * pixelsPerMeter[0], xyz[1] * pixelsPerMeter[1]];
  }

  unprojectFlat(xyz) {
    let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;

    if (this.isGeospatial) {
      return worldToLngLat(xyz, scale);
    }

    const metersPerPixel = this.distanceScales.metersPerPixel;
    return [xyz[0] * metersPerPixel[0], xyz[1] * metersPerPixel[1]];
  }

  getDistanceScales() {
    let coordinateOrigin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (coordinateOrigin) {
      return getDistanceScales({
        longitude: coordinateOrigin[0],
        latitude: coordinateOrigin[1],
        scale: this.scale,
        highPrecision: true
      });
    }

    return this.distanceScales;
  }

  getMatrices() {
    let _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$modelMatrix = _ref3.modelMatrix,
        modelMatrix = _ref3$modelMatrix === void 0 ? null : _ref3$modelMatrix;

    let modelViewProjectionMatrix = this.viewProjectionMatrix;
    let pixelProjectionMatrix = this.pixelProjectionMatrix;
    let pixelUnprojectionMatrix = this.pixelUnprojectionMatrix;

    if (modelMatrix) {
      modelViewProjectionMatrix = mat4.multiply([], this.viewProjectionMatrix, modelMatrix);
      pixelProjectionMatrix = mat4.multiply([], this.pixelProjectionMatrix, modelMatrix);
      pixelUnprojectionMatrix = mat4.invert([], pixelProjectionMatrix);
    }

    const matrices = Object.assign({
      modelViewProjectionMatrix,
      viewProjectionMatrix: this.viewProjectionMatrix,
      viewMatrix: this.viewMatrix,
      projectionMatrix: this.projectionMatrix,
      pixelProjectionMatrix,
      pixelUnprojectionMatrix,
      width: this.width,
      height: this.height,
      scale: this.scale
    });
    return matrices;
  }

  containsPixel(_ref4) {
    let x = _ref4.x,
        y = _ref4.y,
        _ref4$width = _ref4.width,
        width = _ref4$width === void 0 ? 1 : _ref4$width,
        _ref4$height = _ref4.height,
        height = _ref4$height === void 0 ? 1 : _ref4$height;
    return x < this.x + this.width && this.x < x + width && y < this.y + this.height && this.y < y + height;
  }

  getCameraPosition() {
    return this.cameraPosition;
  }

  getCameraDirection() {
    return this.cameraDirection;
  }

  getCameraUp() {
    return this.cameraUp;
  }

  _addMetersToLngLat(lngLatZ, xyz) {
    const _lngLatZ = _slicedToArray(lngLatZ, 3),
          lng = _lngLatZ[0],
          lat = _lngLatZ[1],
          _lngLatZ$ = _lngLatZ[2],
          Z = _lngLatZ$ === void 0 ? 0 : _lngLatZ$;

    const _this$_metersToLngLat = this._metersToLngLatDelta(xyz),
          _this$_metersToLngLat2 = _slicedToArray(_this$_metersToLngLat, 3),
          deltaLng = _this$_metersToLngLat2[0],
          deltaLat = _this$_metersToLngLat2[1],
          _this$_metersToLngLat3 = _this$_metersToLngLat2[2],
          deltaZ = _this$_metersToLngLat3 === void 0 ? 0 : _this$_metersToLngLat3;

    return lngLatZ.length === 2 ? [lng + deltaLng, lat + deltaLat] : [lng + deltaLng, lat + deltaLat, Z + deltaZ];
  }

  _metersToLngLatDelta(xyz) {
    const _xyz2 = _slicedToArray(xyz, 3),
          x = _xyz2[0],
          y = _xyz2[1],
          _xyz2$ = _xyz2[2],
          z = _xyz2$ === void 0 ? 0 : _xyz2$;

    assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), ERR_ARGUMENT);
    const _this$distanceScales = this.distanceScales,
          pixelsPerMeter = _this$distanceScales.pixelsPerMeter,
          degreesPerPixel = _this$distanceScales.degreesPerPixel;
    const deltaLng = x * pixelsPerMeter[0] * degreesPerPixel[0];
    const deltaLat = y * pixelsPerMeter[1] * degreesPerPixel[1];
    return xyz.length === 2 ? [deltaLng, deltaLat] : [deltaLng, deltaLat, z];
  }

  _createProjectionMatrix(_ref5) {
    let orthographic = _ref5.orthographic,
        fovyRadians = _ref5.fovyRadians,
        aspect = _ref5.aspect,
        focalDistance = _ref5.focalDistance,
        near = _ref5.near,
        far = _ref5.far;
    assert(Number.isFinite(fovyRadians));
    return orthographic ? new Matrix4().orthographic({
      fovy: fovyRadians,
      aspect,
      focalDistance,
      near,
      far
    }) : new Matrix4().perspective({
      fovy: fovyRadians,
      aspect,
      near,
      far
    });
  }

  _initViewMatrix(opts) {
    const _opts$viewMatrix = opts.viewMatrix,
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
        latitude
      }) + Math.log2(focalDistance) : DEFAULT_ZOOM;
    }

    const scale = Math.pow(2, this.zoom);
    this.scale = scale;
    this.distanceScales = this.isGeospatial ? getDistanceScales({
      latitude,
      longitude,
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
        longitude,
        latitude
      });
      this.viewMatrixUncentered = mat4.scale([], viewMatrix, [1, -1, 1]);
    } else {
      this.center = position ? this.projectPosition(position) : [0, 0, 0];
      this.viewMatrixUncentered = viewMatrix;
    }

    this.viewMatrix = new Matrix4().multiplyRight(this.viewMatrixUncentered).translate(new Vector3(this.center || ZERO_VECTOR).negate());
  }

  _getCenterInWorld(_ref6) {
    let longitude = _ref6.longitude,
        latitude = _ref6.latitude;
    const meterOffset = this.meterOffset,
          scale = this.scale,
          distanceScales = this.distanceScales;
    const center2d = this.projectFlat([longitude, latitude], scale);
    const center = new Vector3(center2d[0], center2d[1], 0);

    if (meterOffset) {
      const pixelPosition = new Vector3(meterOffset).scale(distanceScales.pixelsPerMeter);
      center.add(pixelPosition);
    }

    return center;
  }

  _initProjectionMatrix(opts) {
    const _opts$projectionMatri = opts.projectionMatrix,
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
    const radians = fovyRadians || (fovyDegrees || fovy || 75) * DEGREES_TO_RADIANS;
    this.projectionMatrix = projectionMatrix || this._createProjectionMatrix({
      orthographic,
      fovyRadians: radians,
      aspect: this.width / this.height,
      focalDistance: orthographicFocalDistance || focalDistance,
      near,
      far
    });
  }

  _initPixelMatrices() {
    const vpm = createMat4();
    mat4.multiply(vpm, vpm, this.projectionMatrix);
    mat4.multiply(vpm, vpm, this.viewMatrix);
    this.viewProjectionMatrix = vpm;
    this.viewMatrixInverse = mat4.invert([], this.viewMatrix) || this.viewMatrix;

    const _extractCameraVectors = extractCameraVectors({
      viewMatrix: this.viewMatrix,
      viewMatrixInverse: this.viewMatrixInverse
    }),
          eye = _extractCameraVectors.eye,
          direction = _extractCameraVectors.direction,
          up = _extractCameraVectors.up;

    this.cameraPosition = eye;
    this.cameraDirection = direction;
    this.cameraUp = up;
    const viewportMatrix = createMat4();
    const pixelProjectionMatrix = createMat4();
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

}
Viewport.displayName = 'Viewport';
//# sourceMappingURL=viewport.js.map