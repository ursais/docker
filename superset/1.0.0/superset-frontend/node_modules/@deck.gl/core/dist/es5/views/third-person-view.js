"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _view = _interopRequireDefault(require("./view"));

var _viewport = _interopRequireDefault(require("../viewports/viewport"));

var _math = require("math.gl");

function getDirectionFromBearingAndPitch(_ref) {
  var bearing = _ref.bearing,
      pitch = _ref.pitch;
  var spherical = new _math._SphericalCoordinates({
    bearing: bearing,
    pitch: pitch
  });
  return spherical.toVector3().normalize();
}

var ThirdPersonView = function (_View) {
  (0, _inherits2.default)(ThirdPersonView, _View);

  function ThirdPersonView() {
    (0, _classCallCheck2.default)(this, ThirdPersonView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ThirdPersonView).apply(this, arguments));
  }

  (0, _createClass2.default)(ThirdPersonView, [{
    key: "_getViewport",
    value: function _getViewport(props) {
      var _props$viewState = props.viewState,
          bearing = _props$viewState.bearing,
          pitch = _props$viewState.pitch,
          position = _props$viewState.position,
          up = _props$viewState.up,
          zoom = _props$viewState.zoom;
      var direction = getDirectionFromBearingAndPitch({
        bearing: bearing,
        pitch: pitch
      });
      var distance = zoom * 50;
      var eye = direction.scale(-distance).multiply(new _math.Vector3(1, 1, -1));
      var viewMatrix = new _math.Matrix4().multiplyRight(new _math.Matrix4().lookAt({
        eye: eye,
        center: position,
        up: up
      }));
      return new _viewport.default(Object.assign({}, props, {
        id: this.id,
        zoom: null,
        viewMatrix: viewMatrix
      }));
    }
  }]);
  return ThirdPersonView;
}(_view.default);

exports.default = ThirdPersonView;
ThirdPersonView.displayName = 'ThirdPersonView';
//# sourceMappingURL=third-person-view.js.map