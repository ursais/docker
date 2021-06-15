import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Controller from './controller';
import { OrbitState } from './orbit-controller';
import LinearInterpolator from '../transitions/linear-interpolator';
import { TRANSITION_EVENTS } from './transition-manager';
var LINEAR_TRANSITION_PROPS = {
  transitionDuration: 300,
  transitionEasing: function transitionEasing(t) {
    return t;
  },
  transitionInterpolator: new LinearInterpolator(['target', 'zoom']),
  transitionInterruption: TRANSITION_EVENTS.BREAK
};

var OrthographicController = function (_Controller) {
  _inherits(OrthographicController, _Controller);

  function OrthographicController(props) {
    var _this;

    _classCallCheck(this, OrthographicController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OrthographicController).call(this, OrbitState, props));
    _this.invertPan = true;
    return _this;
  }

  _createClass(OrthographicController, [{
    key: "_onPanRotate",
    value: function _onPanRotate(event) {
      return false;
    }
  }, {
    key: "_getTransitionProps",
    value: function _getTransitionProps() {
      return LINEAR_TRANSITION_PROPS;
    }
  }]);

  return OrthographicController;
}(Controller);

export { OrthographicController as default };
//# sourceMappingURL=orthographic-controller.js.map