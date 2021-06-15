import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import Viewport from '../viewports/viewport';
import { Vector3, Matrix4, _SphericalCoordinates as SphericalCoordinates } from 'math.gl';

function getDirectionFromBearingAndPitch(_ref) {
  var bearing = _ref.bearing,
      pitch = _ref.pitch;
  var spherical = new SphericalCoordinates({
    bearing: bearing,
    pitch: pitch
  });
  return spherical.toVector3().normalize();
}

var ThirdPersonView = function (_View) {
  _inherits(ThirdPersonView, _View);

  function ThirdPersonView() {
    _classCallCheck(this, ThirdPersonView);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThirdPersonView).apply(this, arguments));
  }

  _createClass(ThirdPersonView, [{
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
      var eye = direction.scale(-distance).multiply(new Vector3(1, 1, -1));
      var viewMatrix = new Matrix4().multiplyRight(new Matrix4().lookAt({
        eye: eye,
        center: position,
        up: up
      }));
      return new Viewport(Object.assign({}, props, {
        id: this.id,
        zoom: null,
        viewMatrix: viewMatrix
      }));
    }
  }]);

  return ThirdPersonView;
}(View);

export { ThirdPersonView as default };
ThirdPersonView.displayName = 'ThirdPersonView';
//# sourceMappingURL=third-person-view.js.map