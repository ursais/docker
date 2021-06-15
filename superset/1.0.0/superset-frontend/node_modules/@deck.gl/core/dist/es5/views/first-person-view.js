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

var _firstPersonController = _interopRequireDefault(require("../controllers/first-person-controller"));

function getDirectionFromBearingAndPitch(_ref) {
  var bearing = _ref.bearing,
      pitch = _ref.pitch;
  var spherical = new _math._SphericalCoordinates({
    bearing: bearing,
    pitch: pitch
  });
  var direction = spherical.toVector3().normalize();
  return direction;
}

var FirstPersonView = function (_View) {
  (0, _inherits2.default)(FirstPersonView, _View);

  function FirstPersonView() {
    (0, _classCallCheck2.default)(this, FirstPersonView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FirstPersonView).apply(this, arguments));
  }

  (0, _createClass2.default)(FirstPersonView, [{
    key: "_getViewport",
    value: function _getViewport(props) {
      var _props$viewState = props.viewState,
          _props$viewState$mode = _props$viewState.modelMatrix,
          modelMatrix = _props$viewState$mode === void 0 ? null : _props$viewState$mode,
          bearing = _props$viewState.bearing,
          _props$viewState$up = _props$viewState.up,
          up = _props$viewState$up === void 0 ? [0, 0, 1] : _props$viewState$up;
      var dir = getDirectionFromBearingAndPitch({
        bearing: bearing,
        pitch: 89
      });
      var center = modelMatrix ? modelMatrix.transformDirection(dir) : dir;
      var viewMatrix = new _math.Matrix4().lookAt({
        eye: [0, 0, 0],
        center: center,
        up: up
      });
      return new _viewport.default(Object.assign({}, props, {
        zoom: null,
        viewMatrix: viewMatrix
      }));
    }
  }, {
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: _firstPersonController.default
      });
    }
  }]);
  return FirstPersonView;
}(_view.default);

exports.default = FirstPersonView;
FirstPersonView.displayName = 'FirstPersonView';
//# sourceMappingURL=first-person-view.js.map