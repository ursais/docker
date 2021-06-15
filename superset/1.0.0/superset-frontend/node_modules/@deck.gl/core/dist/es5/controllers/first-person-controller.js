"use strict";

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

var _controller = _interopRequireDefault(require("./controller"));

var _viewState = _interopRequireDefault(require("./view-state"));

var _math = require("math.gl");

var MOVEMENT_SPEED = 1;
var ROTATION_STEP_DEGREES = 2;

function ensureFinite(value, fallbackValue) {
  return Number.isFinite(value) ? value : fallbackValue;
}

var FirstPersonState = function (_ViewState) {
  (0, _inherits2.default)(FirstPersonState, _ViewState);

  function FirstPersonState(_ref) {
    var _this;

    var width = _ref.width,
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
    (0, _classCallCheck2.default)(this, FirstPersonState);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FirstPersonState).call(this, {
      width: width,
      height: height,
      position: position,
      bearing: bearing,
      pitch: pitch,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom
    }));
    _this._interactiveState = {
      startPanEventPosition: startPanEventPosition,
      startPanPosition: startPanPosition,
      startRotateCenter: startRotateCenter,
      startRotateViewport: startRotateViewport,
      startZoomPos: startZoomPos,
      startZoom: startZoom
    };
    return _this;
  }

  (0, _createClass2.default)(FirstPersonState, [{
    key: "getInteractiveState",
    value: function getInteractiveState() {
      return this._interactiveState;
    }
  }, {
    key: "panStart",
    value: function panStart(_ref2) {
      var pos = _ref2.pos;
      var _this$_viewportProps = this._viewportProps,
          translationX = _this$_viewportProps.translationX,
          translationY = _this$_viewportProps.translationY;
      return this._getUpdatedState({
        startPanPosition: [translationX, translationY],
        startPanEventPosition: pos
      });
    }
  }, {
    key: "pan",
    value: function pan(_ref3) {
      var pos = _ref3.pos,
          startPos = _ref3.startPos;
      var startPanEventPosition = this._interactiveState.startPanEventPosition || startPos;

      if (!startPanEventPosition) {
        return this;
      }

      var _ref4 = this._interactiveState.startPanPosition || [],
          _ref5 = (0, _slicedToArray2.default)(_ref4, 2),
          translationX = _ref5[0],
          translationY = _ref5[1];

      translationX = ensureFinite(translationX, this._viewportProps.translationX);
      translationY = ensureFinite(translationY, this._viewportProps.translationY);
      var deltaX = pos[0] - startPanEventPosition[0];
      var deltaY = pos[1] - startPanEventPosition[1];
      return this._getUpdatedState({
        translationX: translationX + deltaX,
        translationY: translationY - deltaY
      });
    }
  }, {
    key: "panEnd",
    value: function panEnd() {
      return this._getUpdatedState({
        startPanPosition: null,
        startPanPos: null
      });
    }
  }, {
    key: "rotateStart",
    value: function rotateStart(_ref6) {
      var pos = _ref6.pos;
      return this._getUpdatedState({
        startRotateCenter: this._viewportProps.position,
        startRotateViewport: this._viewportProps
      });
    }
  }, {
    key: "rotate",
    value: function rotate(_ref7) {
      var deltaScaleX = _ref7.deltaScaleX,
          deltaScaleY = _ref7.deltaScaleY;

      if (!this._interactiveState.startRotateCenter) {
        return this;
      }

      var _this$_viewportProps2 = this._viewportProps,
          bearing = _this$_viewportProps2.bearing,
          pitch = _this$_viewportProps2.pitch;
      return this._getUpdatedState({
        bearing: bearing + deltaScaleX * 10,
        pitch: pitch - deltaScaleY * 10
      });
    }
  }, {
    key: "rotateEnd",
    value: function rotateEnd() {
      return this._getUpdatedState({
        startRotateCenter: null,
        startRotateViewport: null
      });
    }
  }, {
    key: "zoomStart",
    value: function zoomStart(_ref8) {
      var pos = _ref8.pos;
      return this._getUpdatedState({
        startZoomPos: pos,
        startZoom: this._viewportProps.zoom
      });
    }
  }, {
    key: "zoom",
    value: function zoom(_ref9) {
      var pos = _ref9.pos,
          startPos = _ref9.startPos,
          scale = _ref9.scale;
      var _this$_viewportProps3 = this._viewportProps,
          zoom = _this$_viewportProps3.zoom,
          minZoom = _this$_viewportProps3.minZoom,
          maxZoom = _this$_viewportProps3.maxZoom,
          width = _this$_viewportProps3.width,
          height = _this$_viewportProps3.height,
          translationX = _this$_viewportProps3.translationX,
          translationY = _this$_viewportProps3.translationY;
      var startZoomPos = this._interactiveState.startZoomPos || startPos || pos;
      var newZoom = (0, _math.clamp)(zoom * scale, minZoom, maxZoom);
      var deltaX = pos[0] - startZoomPos[0];
      var deltaY = pos[1] - startZoomPos[1];
      var cx = startZoomPos[0] - width / 2;
      var cy = height / 2 - startZoomPos[1];
      var newTranslationX = cx - (cx - translationX) * newZoom / zoom + deltaX;
      var newTranslationY = cy - (cy - translationY) * newZoom / zoom - deltaY;
      return newZoom / zoom < 1 ? this.moveBackward() : this.moveForward();
    }
  }, {
    key: "zoomEnd",
    value: function zoomEnd() {
      return this._getUpdatedState({
        startZoomPos: null,
        startZoom: null
      });
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      var bearing = this._viewportProps.bearing;
      var newBearing = bearing - ROTATION_STEP_DEGREES;
      return this._getUpdatedState({
        bearing: newBearing
      });
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      var bearing = this._viewportProps.bearing;
      var newBearing = bearing + ROTATION_STEP_DEGREES;
      return this._getUpdatedState({
        bearing: newBearing
      });
    }
  }, {
    key: "moveForward",
    value: function moveForward() {
      var position = this._viewportProps.position;
      var direction = this.getDirection();
      var delta = new _math.Vector3(direction).normalize().scale(MOVEMENT_SPEED);
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: "moveBackward",
    value: function moveBackward() {
      var position = this._viewportProps.position;
      var direction = this.getDirection();
      var delta = new _math.Vector3(direction).normalize().scale(-MOVEMENT_SPEED);
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      var position = this._viewportProps.position;
      var delta = [0, 0, 1];
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      var position = this._viewportProps.position;
      var delta = position[2] >= 1 ? [0, 0, -1] : [0, 0, 0];
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      return this._getUpdatedState({
        zoom: this._viewportProps.zoom + 0.2
      });
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      return this._getUpdatedState({
        zoom: this._viewportProps.zoom - 0.2
      });
    }
  }, {
    key: "_getUpdatedState",
    value: function _getUpdatedState(newProps) {
      return new FirstPersonState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
    }
  }]);
  return FirstPersonState;
}(_viewState.default);

var FirstPersonController = function (_Controller) {
  (0, _inherits2.default)(FirstPersonController, _Controller);

  function FirstPersonController(props) {
    (0, _classCallCheck2.default)(this, FirstPersonController);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FirstPersonController).call(this, FirstPersonState, props));
  }

  return FirstPersonController;
}(_controller.default);

exports.default = FirstPersonController;
//# sourceMappingURL=first-person-controller.js.map