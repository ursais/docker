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

var _transitionInterpolator = _interopRequireDefault(require("./transition-interpolator"));

var _math = require("math.gl");

var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];

var LinearInterpolator = function (_TransitionInterpolat) {
  (0, _inherits2.default)(LinearInterpolator, _TransitionInterpolat);

  function LinearInterpolator() {
    var transitionProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VIEWPORT_TRANSITION_PROPS;
    (0, _classCallCheck2.default)(this, LinearInterpolator);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LinearInterpolator).call(this, transitionProps));
  }

  (0, _createClass2.default)(LinearInterpolator, [{
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = {};

      for (var key in endProps) {
        viewport[key] = (0, _math.lerp)(startProps[key], endProps[key], t);
      }

      return viewport;
    }
  }]);
  return LinearInterpolator;
}(_transitionInterpolator.default);

exports.default = LinearInterpolator;
//# sourceMappingURL=linear-interpolator.js.map