import { clamp, Vector2 } from 'math.gl';
import Controller from './controller';
import ViewState from './view-state';
import LinearInterpolator from '../transitions/linear-interpolator';
import { TRANSITION_EVENTS } from './transition-manager';
const MOVEMENT_SPEED = 50;
const DEFAULT_STATE = {
  orbitAxis: 'Z',
  rotationX: 0,
  rotationOrbit: 0,
  fovy: 50,
  zoom: 0,
  target: [0, 0, 0],
  minZoom: -Infinity,
  maxZoom: Infinity
};
const LINEAR_TRANSITION_PROPS = {
  transitionDuration: 300,
  transitionEasing: t => t,
  transitionInterpolator: new LinearInterpolator(['target', 'zoom', 'rotationX', 'rotationOrbit']),
  transitionInterruption: TRANSITION_EVENTS.BREAK
};

const zoom2Scale = zoom => Math.pow(2, zoom);

export class OrbitState extends ViewState {
  constructor(_ref) {
    let ViewportType = _ref.ViewportType,
        width = _ref.width,
        height = _ref.height,
        _ref$orbitAxis = _ref.orbitAxis,
        orbitAxis = _ref$orbitAxis === void 0 ? DEFAULT_STATE.orbitAxis : _ref$orbitAxis,
        _ref$rotationX = _ref.rotationX,
        rotationX = _ref$rotationX === void 0 ? DEFAULT_STATE.rotationX : _ref$rotationX,
        _ref$rotationOrbit = _ref.rotationOrbit,
        rotationOrbit = _ref$rotationOrbit === void 0 ? DEFAULT_STATE.rotationOrbit : _ref$rotationOrbit,
        _ref$target = _ref.target,
        target = _ref$target === void 0 ? DEFAULT_STATE.target : _ref$target,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === void 0 ? DEFAULT_STATE.zoom : _ref$zoom,
        _ref$fovy = _ref.fovy,
        fovy = _ref$fovy === void 0 ? DEFAULT_STATE.fovy : _ref$fovy,
        _ref$minZoom = _ref.minZoom,
        minZoom = _ref$minZoom === void 0 ? DEFAULT_STATE.minZoom : _ref$minZoom,
        _ref$maxZoom = _ref.maxZoom,
        maxZoom = _ref$maxZoom === void 0 ? DEFAULT_STATE.maxZoom : _ref$maxZoom,
        startPanPosition = _ref.startPanPosition,
        startTarget = _ref.startTarget,
        startRotationX = _ref.startRotationX,
        startRotationOrbit = _ref.startRotationOrbit,
        startZoomPosition = _ref.startZoomPosition,
        startZoom = _ref.startZoom;
    super({
      width,
      height,
      orbitAxis,
      rotationX,
      rotationOrbit,
      target,
      fovy,
      zoom,
      minZoom,
      maxZoom
    });
    this._interactiveState = {
      startPanPosition,
      startTarget,
      startRotationX,
      startRotationOrbit,
      startZoomPosition,
      startZoom
    };
    this.ViewportType = ViewportType;
  }

  getViewportProps() {
    return this._viewportProps;
  }

  getInteractiveState() {
    return this._interactiveState;
  }

  panStart(_ref2) {
    let pos = _ref2.pos;
    const target = this._viewportProps.target;
    return this._getUpdatedState({
      startPanPosition: pos,
      startTarget: target
    });
  }

  pan(_ref3) {
    let pos = _ref3.pos,
        startPos = _ref3.startPos;
    const _this$_interactiveSta = this._interactiveState,
          startPanPosition = _this$_interactiveSta.startPanPosition,
          startTarget = _this$_interactiveSta.startTarget;
    const delta = new Vector2(pos).subtract(startPanPosition);
    return this._getUpdatedState({
      target: this._calculateNewTarget({
        startTarget,
        pixelOffset: delta
      })
    });
  }

  panEnd() {
    return this._getUpdatedState({
      startPanPosition: null,
      startTarget: null
    });
  }

  rotateStart(_ref4) {
    let pos = _ref4.pos;
    return this._getUpdatedState({
      startRotationX: this._viewportProps.rotationX,
      startRotationOrbit: this._viewportProps.rotationOrbit
    });
  }

  rotate(_ref5) {
    let deltaScaleX = _ref5.deltaScaleX,
        deltaScaleY = _ref5.deltaScaleY;
    const _this$_interactiveSta2 = this._interactiveState,
          startRotationX = _this$_interactiveSta2.startRotationX,
          startRotationOrbit = _this$_interactiveSta2.startRotationOrbit;

    if (!Number.isFinite(startRotationX) || !Number.isFinite(startRotationOrbit)) {
      return this;
    }

    const newRotationX = clamp(startRotationX + deltaScaleY * 180, -89.999, 89.999);
    const newRotationOrbit = (startRotationOrbit + deltaScaleX * 180) % 360;
    return this._getUpdatedState({
      rotationX: newRotationX,
      rotationOrbit: newRotationOrbit,
      isRotating: true
    });
  }

  rotateEnd() {
    return this._getUpdatedState({
      startRotationX: null,
      startRotationOrbit: null
    });
  }

  shortestPathFrom(viewState) {
    const props = Object.assign({}, this._viewportProps);
    return props;
  }

  zoomStart(_ref6) {
    let pos = _ref6.pos;
    return this._getUpdatedState({
      startZoomPosition: pos,
      startTarget: this._viewportProps.target,
      startZoom: this._viewportProps.zoom
    });
  }

  zoom(_ref7) {
    let pos = _ref7.pos,
        startPos = _ref7.startPos,
        scale = _ref7.scale;
    const _this$_viewportProps = this._viewportProps,
          zoom = _this$_viewportProps.zoom,
          width = _this$_viewportProps.width,
          height = _this$_viewportProps.height,
          target = _this$_viewportProps.target;
    let _this$_interactiveSta3 = this._interactiveState,
        startZoom = _this$_interactiveSta3.startZoom,
        startZoomPosition = _this$_interactiveSta3.startZoomPosition,
        startTarget = _this$_interactiveSta3.startTarget;

    if (!Number.isFinite(startZoom)) {
      startZoom = zoom;
      startTarget = target;
      startZoomPosition = startPos || pos;
    }

    const newZoom = this._calculateNewZoom({
      scale,
      startZoom
    });

    const startScale = zoom2Scale(startZoom);
    const newScale = zoom2Scale(newZoom);
    const dX = (width / 2 - startZoomPosition[0]) * (newScale / startScale - 1);
    const dY = (height / 2 - startZoomPosition[1]) * (newScale / startScale - 1);
    return this._getUpdatedState({
      zoom: newZoom,
      target: this._calculateNewTarget({
        startTarget,
        zoom: newZoom,
        pixelOffset: [dX, dY]
      })
    });
  }

  zoomEnd() {
    return this._getUpdatedState({
      startZoomPosition: null,
      startTarget: null,
      startZoom: null
    });
  }

  zoomIn() {
    return this._getUpdatedState({
      zoom: this._calculateNewZoom({
        scale: 2
      })
    });
  }

  zoomOut() {
    return this._getUpdatedState({
      zoom: this._calculateNewZoom({
        scale: 0.5
      })
    });
  }

  moveLeft() {
    const pixelOffset = [-MOVEMENT_SPEED, 0];
    return this._getUpdatedState({
      target: this._calculateNewTarget({
        pixelOffset
      })
    });
  }

  moveRight() {
    const pixelOffset = [MOVEMENT_SPEED, 0];
    return this._getUpdatedState({
      target: this._calculateNewTarget({
        pixelOffset
      })
    });
  }

  moveUp() {
    const pixelOffset = [0, -MOVEMENT_SPEED];
    return this._getUpdatedState({
      target: this._calculateNewTarget({
        pixelOffset
      })
    });
  }

  moveDown() {
    const pixelOffset = [0, MOVEMENT_SPEED];
    return this._getUpdatedState({
      target: this._calculateNewTarget({
        pixelOffset
      })
    });
  }

  rotateLeft() {
    return this._getUpdatedState({
      rotationOrbit: this._viewportProps.rotationOrbit - 15
    });
  }

  rotateRight() {
    return this._getUpdatedState({
      rotationOrbit: this._viewportProps.rotationOrbit + 15
    });
  }

  rotateUp() {
    return this._getUpdatedState({
      rotationX: this._viewportProps.rotationX - 10
    });
  }

  rotateDown() {
    return this._getUpdatedState({
      rotationX: this._viewportProps.rotationX + 10
    });
  }

  _calculateNewZoom(_ref8) {
    let scale = _ref8.scale,
        startZoom = _ref8.startZoom;
    const _this$_viewportProps2 = this._viewportProps,
          maxZoom = _this$_viewportProps2.maxZoom,
          minZoom = _this$_viewportProps2.minZoom;

    if (!Number.isFinite(startZoom)) {
      startZoom = this._viewportProps.zoom;
    }

    const zoom = startZoom + Math.log2(scale);
    return clamp(zoom, minZoom, maxZoom);
  }

  _calculateNewTarget(_ref9) {
    let startTarget = _ref9.startTarget,
        zoom = _ref9.zoom,
        pixelOffset = _ref9.pixelOffset;
    const viewportProps = Object.assign({}, this._viewportProps);

    if (Number.isFinite(zoom)) {
      viewportProps.zoom = zoom;
    }

    if (startTarget) {
      viewportProps.target = startTarget;
    }

    const viewport = new this.ViewportType(viewportProps);
    const center = viewport.project(viewportProps.target);
    return viewport.unproject([center[0] - pixelOffset[0], center[1] - pixelOffset[1], center[2]]);
  }

  _getUpdatedState(newProps) {
    return new OrbitState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
  }

  _applyConstraints(props) {
    const maxZoom = props.maxZoom,
          minZoom = props.minZoom,
          zoom = props.zoom;
    props.zoom = zoom > maxZoom ? maxZoom : zoom;
    props.zoom = zoom < minZoom ? minZoom : zoom;
    return props;
  }

}
export default class OrbitController extends Controller {
  constructor(props) {
    super(OrbitState, props);
  }

  _getTransitionProps() {
    return LINEAR_TRANSITION_PROPS;
  }

}
//# sourceMappingURL=orbit-controller.js.map