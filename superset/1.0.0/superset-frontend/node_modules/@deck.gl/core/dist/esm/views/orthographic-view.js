import _createClass from "@babel/runtime/helpers/esm/createClass";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4 } from 'math.gl';
import OrthographicController from '../controllers/orthographic-controller';
var viewMatrix = new Matrix4().lookAt({
  eye: [0, 0, 1]
});

function getProjectionMatrix(_ref) {
  var width = _ref.width,
      height = _ref.height,
      near = _ref.near,
      far = _ref.far;
  width = width || 1;
  height = height || 1;
  return new Matrix4().ortho({
    left: -width / 2,
    right: width / 2,
    bottom: height / 2,
    top: -height / 2,
    near: near,
    far: far
  });
}

var OrthographicViewport = function (_Viewport) {
  _inherits(OrthographicViewport, _Viewport);

  function OrthographicViewport(_ref2) {
    var _this;

    var id = _ref2.id,
        x = _ref2.x,
        y = _ref2.y,
        width = _ref2.width,
        height = _ref2.height,
        _ref2$near = _ref2.near,
        near = _ref2$near === void 0 ? 0.1 : _ref2$near,
        _ref2$far = _ref2.far,
        far = _ref2$far === void 0 ? 1000 : _ref2$far,
        _ref2$zoom = _ref2.zoom,
        zoom = _ref2$zoom === void 0 ? 0 : _ref2$zoom,
        _ref2$target = _ref2.target,
        target = _ref2$target === void 0 ? [0, 0, 0] : _ref2$target;

    _classCallCheck(this, OrthographicViewport);

    return _possibleConstructorReturn(_this, new Viewport({
      id: id,
      x: x,
      y: y,
      width: width,
      height: height,
      position: target,
      viewMatrix: viewMatrix,
      projectionMatrix: getProjectionMatrix({
        width: width,
        height: height,
        near: near,
        far: far
      }),
      zoom: zoom
    }));
  }

  return OrthographicViewport;
}(Viewport);

var OrthographicView = function (_View) {
  _inherits(OrthographicView, _View);

  function OrthographicView(props) {
    _classCallCheck(this, OrthographicView);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrthographicView).call(this, Object.assign({}, props, {
      type: OrthographicViewport
    })));
  }

  _createClass(OrthographicView, [{
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: OrthographicController,
        ViewportType: OrthographicViewport
      });
    }
  }]);

  return OrthographicView;
}(View);

export { OrthographicView as default };
OrthographicView.displayName = 'OrthographicView';
//# sourceMappingURL=orthographic-view.js.map