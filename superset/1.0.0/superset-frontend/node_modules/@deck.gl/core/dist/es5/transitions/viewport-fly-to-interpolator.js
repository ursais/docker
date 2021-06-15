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

var _viewportMercatorProject = require("viewport-mercator-project");

var LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];

var FlyToInterpolator = function (_TransitionInterpolat) {
  (0, _inherits2.default)(FlyToInterpolator, _TransitionInterpolat);

  function FlyToInterpolator() {
    (0, _classCallCheck2.default)(this, FlyToInterpolator);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FlyToInterpolator).call(this, {
      compare: ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      extract: ['width', 'height', 'longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      required: ['width', 'height', 'latitude', 'longitude', 'zoom']
    }));
  }

  (0, _createClass2.default)(FlyToInterpolator, [{
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = (0, _viewportMercatorProject.flyToViewport)(startProps, endProps, t);

      for (var _i = 0; _i < LINEARLY_INTERPOLATED_PROPS.length; _i++) {
        var key = LINEARLY_INTERPOLATED_PROPS[_i];
        viewport[key] = (0, _math.lerp)(startProps[key] || 0, endProps[key] || 0, t);
      }

      return viewport;
    }
  }]);
  return FlyToInterpolator;
}(_transitionInterpolator.default);

exports.default = FlyToInterpolator;
//# sourceMappingURL=viewport-fly-to-interpolator.js.map