import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4, _SphericalCoordinates as SphericalCoordinates } from 'math.gl';
import FirstPersonController from '../controllers/first-person-controller';

function getDirectionFromBearingAndPitch(_ref) {
  var bearing = _ref.bearing,
      pitch = _ref.pitch;
  var spherical = new SphericalCoordinates({
    bearing: bearing,
    pitch: pitch
  });
  var direction = spherical.toVector3().normalize();
  return direction;
}

var FirstPersonView = function (_View) {
  _inherits(FirstPersonView, _View);

  function FirstPersonView() {
    _classCallCheck(this, FirstPersonView);

    return _possibleConstructorReturn(this, _getPrototypeOf(FirstPersonView).apply(this, arguments));
  }

  _createClass(FirstPersonView, [{
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
      var viewMatrix = new Matrix4().lookAt({
        eye: [0, 0, 0],
        center: center,
        up: up
      });
      return new Viewport(Object.assign({}, props, {
        zoom: null,
        viewMatrix: viewMatrix
      }));
    }
  }, {
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: FirstPersonController
      });
    }
  }]);

  return FirstPersonView;
}(View);

export { FirstPersonView as default };
FirstPersonView.displayName = 'FirstPersonView';
//# sourceMappingURL=first-person-view.js.map