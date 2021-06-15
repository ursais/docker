import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import TransitionInterpolator from './transition-interpolator';
import { lerp } from 'math.gl';
import { flyToViewport } from 'viewport-mercator-project';
var LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];

var FlyToInterpolator = function (_TransitionInterpolat) {
  _inherits(FlyToInterpolator, _TransitionInterpolat);

  function FlyToInterpolator() {
    _classCallCheck(this, FlyToInterpolator);

    return _possibleConstructorReturn(this, _getPrototypeOf(FlyToInterpolator).call(this, {
      compare: ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      extract: ['width', 'height', 'longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      required: ['width', 'height', 'latitude', 'longitude', 'zoom']
    }));
  }

  _createClass(FlyToInterpolator, [{
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = flyToViewport(startProps, endProps, t);

      for (var _i = 0; _i < LINEARLY_INTERPOLATED_PROPS.length; _i++) {
        var key = LINEARLY_INTERPOLATED_PROPS[_i];
        viewport[key] = lerp(startProps[key] || 0, endProps[key] || 0, t);
      }

      return viewport;
    }
  }]);

  return FlyToInterpolator;
}(TransitionInterpolator);

export { FlyToInterpolator as default };
//# sourceMappingURL=viewport-fly-to-interpolator.js.map