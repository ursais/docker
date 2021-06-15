import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import TransitionInterpolator from './transition-interpolator';
import { lerp } from 'math.gl';
var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];

var LinearInterpolator = function (_TransitionInterpolat) {
  _inherits(LinearInterpolator, _TransitionInterpolat);

  function LinearInterpolator() {
    var transitionProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VIEWPORT_TRANSITION_PROPS;

    _classCallCheck(this, LinearInterpolator);

    return _possibleConstructorReturn(this, _getPrototypeOf(LinearInterpolator).call(this, transitionProps));
  }

  _createClass(LinearInterpolator, [{
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = {};

      for (var key in endProps) {
        viewport[key] = lerp(startProps[key], endProps[key], t);
      }

      return viewport;
    }
  }]);

  return LinearInterpolator;
}(TransitionInterpolator);

export { LinearInterpolator as default };
//# sourceMappingURL=linear-interpolator.js.map