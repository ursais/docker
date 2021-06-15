import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { clamp } from 'math.gl';
import Controller from './controller';
import ViewState from './view-state';
import WebMercatorViewport, { normalizeViewportProps } from 'viewport-mercator-project';
import assert from '../utils/assert';
import LinearInterpolator from '../transitions/linear-interpolator';
import { TRANSITION_EVENTS } from './transition-manager';
const PITCH_MOUSE_THRESHOLD = 5;
const PITCH_ACCEL = 1.2;
const LINEAR_TRANSITION_PROPS = {
  transitionDuration: 300,
  transitionEasing: t => t,
  transitionInterpolator: new LinearInterpolator(),
  transitionInterruption: TRANSITION_EVENTS.BREAK
};
const NO_TRANSITION_PROPS = {
  transitionDuration: 0
};
export const MAPBOX_LIMITS = {
  minZoom: 0,
  maxZoom: 20,
  minPitch: 0,
  maxPitch: 60
};
const DEFAULT_STATE = {
  pitch: 0,
  bearing: 0,
  altitude: 1.5
};

class MapState extends ViewState {
  constructor() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        latitude = _ref.latitude,
        longitude = _ref.longitude,
        zoom = _ref.zoom,
        _ref$bearing = _ref.bearing,
        bearing = _ref$bearing === void 0 ? DEFAULT_STATE.bearing : _ref$bearing,
        _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === void 0 ? DEFAULT_STATE.pitch : _ref$pitch,
        _ref$altitude = _ref.altitude,
        altitude = _ref$altitude === void 0 ? DEFAULT_STATE.altitude : _ref$altitude,
        _ref$maxZoom = _ref.maxZoom,
        maxZoom = _ref$maxZoom === void 0 ? MAPBOX_LIMITS.maxZoom : _ref$maxZoom,
        _ref$minZoom = _ref.minZoom,
        minZoom = _ref$minZoom === void 0 ? MAPBOX_LIMITS.minZoom : _ref$minZoom,
        _ref$maxPitch = _ref.maxPitch,
        maxPitch = _ref$maxPitch === void 0 ? MAPBOX_LIMITS.maxPitch : _ref$maxPitch,
        _ref$minPitch = _ref.minPitch,
        minPitch = _ref$minPitch === void 0 ? MAPBOX_LIMITS.minPitch : _ref$minPitch,
        startPanLngLat = _ref.startPanLngLat,
        startZoomLngLat = _ref.startZoomLngLat,
        startBearing = _ref.startBearing,
        startPitch = _ref.startPitch,
        startZoom = _ref.startZoom;

    assert(Number.isFinite(longitude), '`longitude` must be supplied');
    assert(Number.isFinite(latitude), '`latitude` must be supplied');
    assert(Number.isFinite(zoom), '`zoom` must be supplied');
    super({
      width,
      height,
      latitude,
      longitude,
      zoom,
      bearing,
      pitch,
      altitude,
      maxZoom,
      minZoom,
      maxPitch,
      minPitch
    });
    this._interactiveState = {
      startPanLngLat,
      startZoomLngLat,
      startBearing,
      startPitch,
      startZoom
    };
  }

  getViewportProps() {
    return this._viewportProps;
  }

  getInteractiveState() {
    return this._interactiveState;
  }

  panStart(_ref2) {
    let pos = _ref2.pos;
    return this._getUpdatedState({
      startPanLngLat: this._unproject(pos)
    });
  }

  pan(_ref3) {
    let pos = _ref3.pos,
        startPos = _ref3.startPos;

    const startPanLngLat = this._interactiveState.startPanLngLat || this._unproject(startPos);

    if (!startPanLngLat) {
      return this;
    }

    const _this$_calculateNewLn = this._calculateNewLngLat({
      startPanLngLat,
      pos
    }),
          _this$_calculateNewLn2 = _slicedToArray(_this$_calculateNewLn, 2),
          longitude = _this$_calculateNewLn2[0],
          latitude = _this$_calculateNewLn2[1];

    return this._getUpdatedState({
      longitude,
      latitude
    });
  }

  panEnd() {
    return this._getUpdatedState({
      startPanLngLat: null
    });
  }

  rotateStart(_ref4) {
    let pos = _ref4.pos;
    return this._getUpdatedState({
      startBearing: this._viewportProps.bearing,
      startPitch: this._viewportProps.pitch
    });
  }

  rotate(_ref5) {
    let _ref5$deltaScaleX = _ref5.deltaScaleX,
        deltaScaleX = _ref5$deltaScaleX === void 0 ? 0 : _ref5$deltaScaleX,
        _ref5$deltaScaleY = _ref5.deltaScaleY,
        deltaScaleY = _ref5$deltaScaleY === void 0 ? 0 : _ref5$deltaScaleY;
    const _this$_interactiveSta = this._interactiveState,
          startBearing = _this$_interactiveSta.startBearing,
          startPitch = _this$_interactiveSta.startPitch;

    if (!Number.isFinite(startBearing) || !Number.isFinite(startPitch)) {
      return this;
    }

    const _this$_calculateNewPi = this._calculateNewPitchAndBearing({
      deltaScaleX,
      deltaScaleY,
      startBearing,
      startPitch
    }),
          pitch = _this$_calculateNewPi.pitch,
          bearing = _this$_calculateNewPi.bearing;

    return this._getUpdatedState({
      bearing,
      pitch
    });
  }

  rotateEnd() {
    return this._getUpdatedState({
      startBearing: null,
      startPitch: null
    });
  }

  zoomStart(_ref6) {
    let pos = _ref6.pos;
    return this._getUpdatedState({
      startZoomLngLat: this._unproject(pos),
      startZoom: this._viewportProps.zoom
    });
  }

  zoom(_ref7) {
    let pos = _ref7.pos,
        startPos = _ref7.startPos,
        scale = _ref7.scale;
    assert(scale > 0, '`scale` must be a positive number');
    let _this$_interactiveSta2 = this._interactiveState,
        startZoom = _this$_interactiveSta2.startZoom,
        startZoomLngLat = _this$_interactiveSta2.startZoomLngLat;

    if (!Number.isFinite(startZoom)) {
      startZoom = this._viewportProps.zoom;
      startZoomLngLat = this._unproject(startPos) || this._unproject(pos);
    }

    assert(startZoomLngLat, '`startZoomLngLat` prop is required ' + 'for zoom behavior to calculate where to position the map.');

    const zoom = this._calculateNewZoom({
      scale,
      startZoom
    });

    const zoomedViewport = new WebMercatorViewport(Object.assign({}, this._viewportProps, {
      zoom
    }));

    const _zoomedViewport$getLo = zoomedViewport.getLocationAtPoint({
      lngLat: startZoomLngLat,
      pos
    }),
          _zoomedViewport$getLo2 = _slicedToArray(_zoomedViewport$getLo, 2),
          longitude = _zoomedViewport$getLo2[0],
          latitude = _zoomedViewport$getLo2[1];

    return this._getUpdatedState({
      zoom,
      longitude,
      latitude
    });
  }

  zoomEnd() {
    return this._getUpdatedState({
      startZoomLngLat: null,
      startZoom: null
    });
  }

  zoomIn() {
    return this._zoomFromCenter(2);
  }

  zoomOut() {
    return this._zoomFromCenter(0.5);
  }

  moveLeft() {
    return this._panFromCenter([100, 0]);
  }

  moveRight() {
    return this._panFromCenter([-100, 0]);
  }

  moveUp() {
    return this._panFromCenter([0, 100]);
  }

  moveDown() {
    return this._panFromCenter([0, -100]);
  }

  rotateLeft() {
    return this._getUpdatedState({
      bearing: this._viewportProps.bearing - 15
    });
  }

  rotateRight() {
    return this._getUpdatedState({
      bearing: this._viewportProps.bearing + 15
    });
  }

  rotateUp() {
    return this._getUpdatedState({
      pitch: this._viewportProps.pitch + 10
    });
  }

  rotateDown() {
    return this._getUpdatedState({
      pitch: this._viewportProps.pitch - 10
    });
  }

  shortestPathFrom(viewState) {
    const fromProps = viewState.getViewportProps();
    const props = Object.assign({}, this._viewportProps);
    const bearing = props.bearing,
          longitude = props.longitude;

    if (Math.abs(bearing - fromProps.bearing) > 180) {
      props.bearing = bearing < 0 ? bearing + 360 : bearing - 360;
    }

    if (Math.abs(longitude - fromProps.longitude) > 180) {
      props.longitude = longitude < 0 ? longitude + 360 : longitude - 360;
    }

    return props;
  }

  _zoomFromCenter(scale) {
    const _this$_viewportProps = this._viewportProps,
          width = _this$_viewportProps.width,
          height = _this$_viewportProps.height;
    return this.zoom({
      pos: [width / 2, height / 2],
      scale
    });
  }

  _panFromCenter(offset) {
    const _this$_viewportProps2 = this._viewportProps,
          width = _this$_viewportProps2.width,
          height = _this$_viewportProps2.height;
    return this.pan({
      startPos: [width / 2, height / 2],
      pos: [width / 2 + offset[0], height / 2 + offset[1]]
    });
  }

  _getUpdatedState(newProps) {
    return new MapState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
  }

  _applyConstraints(props) {
    const maxZoom = props.maxZoom,
          minZoom = props.minZoom,
          zoom = props.zoom;
    props.zoom = clamp(zoom, minZoom, maxZoom);
    const maxPitch = props.maxPitch,
          minPitch = props.minPitch,
          pitch = props.pitch;
    props.pitch = clamp(pitch, minPitch, maxPitch);
    Object.assign(props, normalizeViewportProps(props));
    return props;
  }

  _unproject(pos) {
    const viewport = new WebMercatorViewport(this._viewportProps);
    return pos && viewport.unproject(pos);
  }

  _calculateNewLngLat(_ref8) {
    let startPanLngLat = _ref8.startPanLngLat,
        pos = _ref8.pos;
    const viewport = new WebMercatorViewport(this._viewportProps);
    return viewport.getMapCenterByLngLatPosition({
      lngLat: startPanLngLat,
      pos
    });
  }

  _calculateNewZoom(_ref9) {
    let scale = _ref9.scale,
        startZoom = _ref9.startZoom;
    const _this$_viewportProps3 = this._viewportProps,
          maxZoom = _this$_viewportProps3.maxZoom,
          minZoom = _this$_viewportProps3.minZoom;
    const zoom = startZoom + Math.log2(scale);
    return clamp(zoom, minZoom, maxZoom);
  }

  _calculateNewPitchAndBearing(_ref10) {
    let deltaScaleX = _ref10.deltaScaleX,
        deltaScaleY = _ref10.deltaScaleY,
        startBearing = _ref10.startBearing,
        startPitch = _ref10.startPitch;
    deltaScaleY = clamp(deltaScaleY, -1, 1);
    const _this$_viewportProps4 = this._viewportProps,
          minPitch = _this$_viewportProps4.minPitch,
          maxPitch = _this$_viewportProps4.maxPitch;
    const bearing = startBearing + 180 * deltaScaleX;
    let pitch = startPitch;

    if (deltaScaleY > 0) {
      pitch = startPitch + deltaScaleY * (maxPitch - startPitch);
    } else if (deltaScaleY < 0) {
      pitch = startPitch - deltaScaleY * (minPitch - startPitch);
    }

    return {
      pitch,
      bearing
    };
  }

}

export default class MapController extends Controller {
  constructor(props) {
    super(MapState, props);
    this.invertPan = true;
  }

  _getTransitionProps() {
    return LINEAR_TRANSITION_PROPS;
  }

  _onPanRotate(event) {
    if (!this.dragRotate) {
      return false;
    }

    const deltaX = event.deltaX,
          deltaY = event.deltaY;

    const _this$getCenter = this.getCenter(event),
          _this$getCenter2 = _slicedToArray(_this$getCenter, 2),
          centerY = _this$getCenter2[1];

    const startY = centerY - deltaY;

    const _this$controllerState = this.controllerState.getViewportProps(),
          width = _this$controllerState.width,
          height = _this$controllerState.height;

    const deltaScaleX = deltaX / width;
    let deltaScaleY = 0;

    if (deltaY > 0) {
      if (Math.abs(height - startY) > PITCH_MOUSE_THRESHOLD) {
        deltaScaleY = deltaY / (startY - height) * PITCH_ACCEL;
      }
    } else if (deltaY < 0) {
      if (startY > PITCH_MOUSE_THRESHOLD) {
        deltaScaleY = 1 - centerY / startY;
      }
    }

    deltaScaleY = Math.min(1, Math.max(-1, deltaScaleY));
    const newControllerState = this.controllerState.rotate({
      deltaScaleX,
      deltaScaleY
    });
    return this.updateViewport(newControllerState, NO_TRANSITION_PROPS, {
      isDragging: true
    });
  }

}
export const testExports = {
  MapState
};
//# sourceMappingURL=map-controller.js.map