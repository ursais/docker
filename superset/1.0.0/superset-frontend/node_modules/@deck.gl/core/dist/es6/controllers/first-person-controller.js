import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import Controller from './controller';
import ViewState from './view-state';
import { Vector3, clamp } from 'math.gl';
const MOVEMENT_SPEED = 1;
const ROTATION_STEP_DEGREES = 2;

function ensureFinite(value, fallbackValue) {
  return Number.isFinite(value) ? value : fallbackValue;
}

class FirstPersonState extends ViewState {
  constructor(_ref) {
    let width = _ref.width,
        height = _ref.height,
        position = _ref.position,
        bearing = _ref.bearing,
        pitch = _ref.pitch,
        longitude = _ref.longitude,
        latitude = _ref.latitude,
        zoom = _ref.zoom,
        _ref$syncBearing = _ref.syncBearing,
        syncBearing = _ref$syncBearing === void 0 ? true : _ref$syncBearing,
        bounds = _ref.bounds,
        startPanEventPosition = _ref.startPanEventPosition,
        startPanPosition = _ref.startPanPosition,
        startRotateCenter = _ref.startRotateCenter,
        startRotateViewport = _ref.startRotateViewport,
        startZoomPos = _ref.startZoomPos,
        startZoom = _ref.startZoom;
    super({
      width,
      height,
      position,
      bearing,
      pitch,
      longitude,
      latitude,
      zoom
    });
    this._interactiveState = {
      startPanEventPosition,
      startPanPosition,
      startRotateCenter,
      startRotateViewport,
      startZoomPos,
      startZoom
    };
  }

  getInteractiveState() {
    return this._interactiveState;
  }

  panStart(_ref2) {
    let pos = _ref2.pos;
    const _this$_viewportProps = this._viewportProps,
          translationX = _this$_viewportProps.translationX,
          translationY = _this$_viewportProps.translationY;
    return this._getUpdatedState({
      startPanPosition: [translationX, translationY],
      startPanEventPosition: pos
    });
  }

  pan(_ref3) {
    let pos = _ref3.pos,
        startPos = _ref3.startPos;
    const startPanEventPosition = this._interactiveState.startPanEventPosition || startPos;

    if (!startPanEventPosition) {
      return this;
    }

    let _ref4 = this._interactiveState.startPanPosition || [],
        _ref5 = _slicedToArray(_ref4, 2),
        translationX = _ref5[0],
        translationY = _ref5[1];

    translationX = ensureFinite(translationX, this._viewportProps.translationX);
    translationY = ensureFinite(translationY, this._viewportProps.translationY);
    const deltaX = pos[0] - startPanEventPosition[0];
    const deltaY = pos[1] - startPanEventPosition[1];
    return this._getUpdatedState({
      translationX: translationX + deltaX,
      translationY: translationY - deltaY
    });
  }

  panEnd() {
    return this._getUpdatedState({
      startPanPosition: null,
      startPanPos: null
    });
  }

  rotateStart(_ref6) {
    let pos = _ref6.pos;
    return this._getUpdatedState({
      startRotateCenter: this._viewportProps.position,
      startRotateViewport: this._viewportProps
    });
  }

  rotate(_ref7) {
    let deltaScaleX = _ref7.deltaScaleX,
        deltaScaleY = _ref7.deltaScaleY;

    if (!this._interactiveState.startRotateCenter) {
      return this;
    }

    const _this$_viewportProps2 = this._viewportProps,
          bearing = _this$_viewportProps2.bearing,
          pitch = _this$_viewportProps2.pitch;
    return this._getUpdatedState({
      bearing: bearing + deltaScaleX * 10,
      pitch: pitch - deltaScaleY * 10
    });
  }

  rotateEnd() {
    return this._getUpdatedState({
      startRotateCenter: null,
      startRotateViewport: null
    });
  }

  zoomStart(_ref8) {
    let pos = _ref8.pos;
    return this._getUpdatedState({
      startZoomPos: pos,
      startZoom: this._viewportProps.zoom
    });
  }

  zoom(_ref9) {
    let pos = _ref9.pos,
        startPos = _ref9.startPos,
        scale = _ref9.scale;
    const _this$_viewportProps3 = this._viewportProps,
          zoom = _this$_viewportProps3.zoom,
          minZoom = _this$_viewportProps3.minZoom,
          maxZoom = _this$_viewportProps3.maxZoom,
          width = _this$_viewportProps3.width,
          height = _this$_viewportProps3.height,
          translationX = _this$_viewportProps3.translationX,
          translationY = _this$_viewportProps3.translationY;
    const startZoomPos = this._interactiveState.startZoomPos || startPos || pos;
    const newZoom = clamp(zoom * scale, minZoom, maxZoom);
    const deltaX = pos[0] - startZoomPos[0];
    const deltaY = pos[1] - startZoomPos[1];
    const cx = startZoomPos[0] - width / 2;
    const cy = height / 2 - startZoomPos[1];
    const newTranslationX = cx - (cx - translationX) * newZoom / zoom + deltaX;
    const newTranslationY = cy - (cy - translationY) * newZoom / zoom - deltaY;
    return newZoom / zoom < 1 ? this.moveBackward() : this.moveForward();
  }

  zoomEnd() {
    return this._getUpdatedState({
      startZoomPos: null,
      startZoom: null
    });
  }

  moveLeft() {
    const bearing = this._viewportProps.bearing;
    const newBearing = bearing - ROTATION_STEP_DEGREES;
    return this._getUpdatedState({
      bearing: newBearing
    });
  }

  moveRight() {
    const bearing = this._viewportProps.bearing;
    const newBearing = bearing + ROTATION_STEP_DEGREES;
    return this._getUpdatedState({
      bearing: newBearing
    });
  }

  moveForward() {
    const position = this._viewportProps.position;
    const direction = this.getDirection();
    const delta = new Vector3(direction).normalize().scale(MOVEMENT_SPEED);
    return this._getUpdatedState({
      position: new Vector3(position).add(delta)
    });
  }

  moveBackward() {
    const position = this._viewportProps.position;
    const direction = this.getDirection();
    const delta = new Vector3(direction).normalize().scale(-MOVEMENT_SPEED);
    return this._getUpdatedState({
      position: new Vector3(position).add(delta)
    });
  }

  moveUp() {
    const position = this._viewportProps.position;
    const delta = [0, 0, 1];
    return this._getUpdatedState({
      position: new Vector3(position).add(delta)
    });
  }

  moveDown() {
    const position = this._viewportProps.position;
    const delta = position[2] >= 1 ? [0, 0, -1] : [0, 0, 0];
    return this._getUpdatedState({
      position: new Vector3(position).add(delta)
    });
  }

  zoomIn() {
    return this._getUpdatedState({
      zoom: this._viewportProps.zoom + 0.2
    });
  }

  zoomOut() {
    return this._getUpdatedState({
      zoom: this._viewportProps.zoom - 0.2
    });
  }

  _getUpdatedState(newProps) {
    return new FirstPersonState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
  }

}

export default class FirstPersonController extends Controller {
  constructor(props) {
    super(FirstPersonState, props);
  }

}
//# sourceMappingURL=first-person-controller.js.map