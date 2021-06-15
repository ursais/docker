import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { clamp, Vector2 } from 'math.gl';
import Controller from './controller';
import ViewState from './view-state';
import LinearInterpolator from '../transitions/linear-interpolator';
import { TRANSITION_EVENTS } from './transition-manager';
var MOVEMENT_SPEED = 50;
var DEFAULT_STATE = {
  orbitAxis: 'Z',
  rotationX: 0,
  rotationOrbit: 0,
  fovy: 50,
  zoom: 0,
  target: [0, 0, 0],
  minZoom: -Infinity,
  maxZoom: Infinity
};
var LINEAR_TRANSITION_PROPS = {
  transitionDuration: 300,
  transitionEasing: function transitionEasing(t) {
    return t;
  },
  transitionInterpolator: new LinearInterpolator(['target', 'zoom', 'rotationX', 'rotationOrbit']),
  transitionInterruption: TRANSITION_EVENTS.BREAK
};

var zoom2Scale = function zoom2Scale(zoom) {
  return Math.pow(2, zoom);
};

export var OrbitState = function (_ViewState) {
  _inherits(OrbitState, _ViewState);

  function OrbitState(_ref) {
    var _this;

    var ViewportType = _ref.ViewportType,
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

    _classCallCheck(this, OrbitState);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OrbitState).call(this, {
      width: width,
      height: height,
      orbitAxis: orbitAxis,
      rotationX: rotationX,
      rotationOrbit: rotationOrbit,
      target: target,
      fovy: fovy,
      zoom: zoom,
      minZoom: minZoom,
      maxZoom: maxZoom
    }));
    _this._interactiveState = {
      startPanPosition: startPanPosition,
      startTarget: startTarget,
      startRotationX: startRotationX,
      startRotationOrbit: startRotationOrbit,
      startZoomPosition: startZoomPosition,
      startZoom: startZoom
    };
    _this.ViewportType = ViewportType;
    return _this;
  }

  _createClass(OrbitState, [{
    key: "getViewportProps",
    value: function getViewportProps() {
      return this._viewportProps;
    }
  }, {
    key: "getInteractiveState",
    value: function getInteractiveState() {
      return this._interactiveState;
    }
  }, {
    key: "panStart",
    value: function panStart(_ref2) {
      var pos = _ref2.pos;
      var target = this._viewportProps.target;
      return this._getUpdatedState({
        startPanPosition: pos,
        startTarget: target
      });
    }
  }, {
    key: "pan",
    value: function pan(_ref3) {
      var pos = _ref3.pos,
          startPos = _ref3.startPos;
      var _this$_interactiveSta = this._interactiveState,
          startPanPosition = _this$_interactiveSta.startPanPosition,
          startTarget = _this$_interactiveSta.startTarget;
      var delta = new Vector2(pos).subtract(startPanPosition);
      return this._getUpdatedState({
        target: this._calculateNewTarget({
          startTarget: startTarget,
          pixelOffset: delta
        })
      });
    }
  }, {
    key: "panEnd",
    value: function panEnd() {
      return this._getUpdatedState({
        startPanPosition: null,
        startTarget: null
      });
    }
  }, {
    key: "rotateStart",
    value: function rotateStart(_ref4) {
      var pos = _ref4.pos;
      return this._getUpdatedState({
        startRotationX: this._viewportProps.rotationX,
        startRotationOrbit: this._viewportProps.rotationOrbit
      });
    }
  }, {
    key: "rotate",
    value: function rotate(_ref5) {
      var deltaScaleX = _ref5.deltaScaleX,
          deltaScaleY = _ref5.deltaScaleY;
      var _this$_interactiveSta2 = this._interactiveState,
          startRotationX = _this$_interactiveSta2.startRotationX,
          startRotationOrbit = _this$_interactiveSta2.startRotationOrbit;

      if (!Number.isFinite(startRotationX) || !Number.isFinite(startRotationOrbit)) {
        return this;
      }

      var newRotationX = clamp(startRotationX + deltaScaleY * 180, -89.999, 89.999);
      var newRotationOrbit = (startRotationOrbit + deltaScaleX * 180) % 360;
      return this._getUpdatedState({
        rotationX: newRotationX,
        rotationOrbit: newRotationOrbit,
        isRotating: true
      });
    }
  }, {
    key: "rotateEnd",
    value: function rotateEnd() {
      return this._getUpdatedState({
        startRotationX: null,
        startRotationOrbit: null
      });
    }
  }, {
    key: "shortestPathFrom",
    value: function shortestPathFrom(viewState) {
      var props = Object.assign({}, this._viewportProps);
      return props;
    }
  }, {
    key: "zoomStart",
    value: function zoomStart(_ref6) {
      var pos = _ref6.pos;
      return this._getUpdatedState({
        startZoomPosition: pos,
        startTarget: this._viewportProps.target,
        startZoom: this._viewportProps.zoom
      });
    }
  }, {
    key: "zoom",
    value: function zoom(_ref7) {
      var pos = _ref7.pos,
          startPos = _ref7.startPos,
          scale = _ref7.scale;
      var _this$_viewportProps = this._viewportProps,
          zoom = _this$_viewportProps.zoom,
          width = _this$_viewportProps.width,
          height = _this$_viewportProps.height,
          target = _this$_viewportProps.target;
      var _this$_interactiveSta3 = this._interactiveState,
          startZoom = _this$_interactiveSta3.startZoom,
          startZoomPosition = _this$_interactiveSta3.startZoomPosition,
          startTarget = _this$_interactiveSta3.startTarget;

      if (!Number.isFinite(startZoom)) {
        startZoom = zoom;
        startTarget = target;
        startZoomPosition = startPos || pos;
      }

      var newZoom = this._calculateNewZoom({
        scale: scale,
        startZoom: startZoom
      });

      var startScale = zoom2Scale(startZoom);
      var newScale = zoom2Scale(newZoom);
      var dX = (width / 2 - startZoomPosition[0]) * (newScale / startScale - 1);
      var dY = (height / 2 - startZoomPosition[1]) * (newScale / startScale - 1);
      return this._getUpdatedState({
        zoom: newZoom,
        target: this._calculateNewTarget({
          startTarget: startTarget,
          zoom: newZoom,
          pixelOffset: [dX, dY]
        })
      });
    }
  }, {
    key: "zoomEnd",
    value: function zoomEnd() {
      return this._getUpdatedState({
        startZoomPosition: null,
        startTarget: null,
        startZoom: null
      });
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      return this._getUpdatedState({
        zoom: this._calculateNewZoom({
          scale: 2
        })
      });
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      return this._getUpdatedState({
        zoom: this._calculateNewZoom({
          scale: 0.5
        })
      });
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      var pixelOffset = [-MOVEMENT_SPEED, 0];
      return this._getUpdatedState({
        target: this._calculateNewTarget({
          pixelOffset: pixelOffset
        })
      });
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      var pixelOffset = [MOVEMENT_SPEED, 0];
      return this._getUpdatedState({
        target: this._calculateNewTarget({
          pixelOffset: pixelOffset
        })
      });
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      var pixelOffset = [0, -MOVEMENT_SPEED];
      return this._getUpdatedState({
        target: this._calculateNewTarget({
          pixelOffset: pixelOffset
        })
      });
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      var pixelOffset = [0, MOVEMENT_SPEED];
      return this._getUpdatedState({
        target: this._calculateNewTarget({
          pixelOffset: pixelOffset
        })
      });
    }
  }, {
    key: "rotateLeft",
    value: function rotateLeft() {
      return this._getUpdatedState({
        rotationOrbit: this._viewportProps.rotationOrbit - 15
      });
    }
  }, {
    key: "rotateRight",
    value: function rotateRight() {
      return this._getUpdatedState({
        rotationOrbit: this._viewportProps.rotationOrbit + 15
      });
    }
  }, {
    key: "rotateUp",
    value: function rotateUp() {
      return this._getUpdatedState({
        rotationX: this._viewportProps.rotationX - 10
      });
    }
  }, {
    key: "rotateDown",
    value: function rotateDown() {
      return this._getUpdatedState({
        rotationX: this._viewportProps.rotationX + 10
      });
    }
  }, {
    key: "_calculateNewZoom",
    value: function _calculateNewZoom(_ref8) {
      var scale = _ref8.scale,
          startZoom = _ref8.startZoom;
      var _this$_viewportProps2 = this._viewportProps,
          maxZoom = _this$_viewportProps2.maxZoom,
          minZoom = _this$_viewportProps2.minZoom;

      if (!Number.isFinite(startZoom)) {
        startZoom = this._viewportProps.zoom;
      }

      var zoom = startZoom + Math.log2(scale);
      return clamp(zoom, minZoom, maxZoom);
    }
  }, {
    key: "_calculateNewTarget",
    value: function _calculateNewTarget(_ref9) {
      var startTarget = _ref9.startTarget,
          zoom = _ref9.zoom,
          pixelOffset = _ref9.pixelOffset;
      var viewportProps = Object.assign({}, this._viewportProps);

      if (Number.isFinite(zoom)) {
        viewportProps.zoom = zoom;
      }

      if (startTarget) {
        viewportProps.target = startTarget;
      }

      var viewport = new this.ViewportType(viewportProps);
      var center = viewport.project(viewportProps.target);
      return viewport.unproject([center[0] - pixelOffset[0], center[1] - pixelOffset[1], center[2]]);
    }
  }, {
    key: "_getUpdatedState",
    value: function _getUpdatedState(newProps) {
      return new OrbitState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
    }
  }, {
    key: "_applyConstraints",
    value: function _applyConstraints(props) {
      var maxZoom = props.maxZoom,
          minZoom = props.minZoom,
          zoom = props.zoom;
      props.zoom = zoom > maxZoom ? maxZoom : zoom;
      props.zoom = zoom < minZoom ? minZoom : zoom;
      return props;
    }
  }]);

  return OrbitState;
}(ViewState);

var OrbitController = function (_Controller) {
  _inherits(OrbitController, _Controller);

  function OrbitController(props) {
    _classCallCheck(this, OrbitController);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrbitController).call(this, OrbitState, props));
  }

  _createClass(OrbitController, [{
    key: "_getTransitionProps",
    value: function _getTransitionProps() {
      return LINEAR_TRANSITION_PROPS;
    }
  }]);

  return OrbitController;
}(Controller);

export { OrbitController as default };
//# sourceMappingURL=orbit-controller.js.map