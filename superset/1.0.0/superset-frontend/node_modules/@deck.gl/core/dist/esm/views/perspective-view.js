import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import Viewport from '../viewports/viewport';
import * as mat4 from 'gl-matrix/mat4';
var DEGREES_TO_RADIANS = Math.PI / 180;

var PerspectiveView = function (_View) {
  _inherits(PerspectiveView, _View);

  function PerspectiveView() {
    _classCallCheck(this, PerspectiveView);

    return _possibleConstructorReturn(this, _getPrototypeOf(PerspectiveView).apply(this, arguments));
  }

  _createClass(PerspectiveView, [{
    key: "_getViewport",
    value: function _getViewport(props) {
      var x = props.x,
          y = props.y,
          width = props.width,
          height = props.height,
          viewState = props.viewState;
      var eye = viewState.eye,
          _viewState$lookAt = viewState.lookAt,
          lookAt = _viewState$lookAt === void 0 ? [0, 0, 0] : _viewState$lookAt,
          _viewState$up = viewState.up,
          up = _viewState$up === void 0 ? [0, 1, 0] : _viewState$up;
      var fovy = props.fovy || viewState.fovy || 75;
      var near = props.near || viewState.near || 1;
      var far = props.far || viewState.far || 100;
      var aspect = Number.isFinite(viewState.aspect) ? viewState.aspect : width / height;
      var fovyRadians = fovy * DEGREES_TO_RADIANS;
      return new Viewport({
        id: this.id,
        x: x,
        y: y,
        width: width,
        height: height,
        viewMatrix: mat4.lookAt([], eye, lookAt, up),
        projectionMatrix: mat4.perspective([], fovyRadians, aspect, near, far)
      });
    }
  }]);

  return PerspectiveView;
}(View);

export { PerspectiveView as default };
PerspectiveView.displayName = 'PerspectiveView';
//# sourceMappingURL=perspective-view.js.map