import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import View from './view';
import Viewport from '../viewports/viewport';
import { Matrix4 } from 'math.gl';
import OrbitController from '../controllers/orbit-controller';
var DEGREES_TO_RADIANS = Math.PI / 180;

function getViewMatrix(_ref) {
  var height = _ref.height,
      fovy = _ref.fovy,
      orbitAxis = _ref.orbitAxis,
      rotationX = _ref.rotationX,
      rotationOrbit = _ref.rotationOrbit,
      zoom = _ref.zoom;
  var distance = 0.5 / Math.tan(fovy * DEGREES_TO_RADIANS / 2);
  var viewMatrix = new Matrix4().lookAt({
    eye: [0, 0, distance]
  });
  viewMatrix.rotateX(rotationX * DEGREES_TO_RADIANS);

  if (orbitAxis === 'Z') {
    viewMatrix.rotateZ(rotationOrbit * DEGREES_TO_RADIANS);
  } else {
    viewMatrix.rotateY(rotationOrbit * DEGREES_TO_RADIANS);
  }

  var projectionScale = 1 / (height || 1);
  viewMatrix.scale([projectionScale, projectionScale, projectionScale]);
  return viewMatrix;
}

var OrbitViewport = function (_Viewport) {
  _inherits(OrbitViewport, _Viewport);

  function OrbitViewport(props) {
    _classCallCheck(this, OrbitViewport);

    var id = props.id,
        x = props.x,
        y = props.y,
        width = props.width,
        height = props.height,
        _props$fovy = props.fovy,
        fovy = _props$fovy === void 0 ? 50 : _props$fovy,
        near = props.near,
        far = props.far,
        _props$orbitAxis = props.orbitAxis,
        orbitAxis = _props$orbitAxis === void 0 ? 'Z' : _props$orbitAxis,
        _props$target = props.target,
        target = _props$target === void 0 ? [0, 0, 0] : _props$target,
        _props$rotationX = props.rotationX,
        rotationX = _props$rotationX === void 0 ? 0 : _props$rotationX,
        _props$rotationOrbit = props.rotationOrbit,
        rotationOrbit = _props$rotationOrbit === void 0 ? 0 : _props$rotationOrbit,
        _props$zoom = props.zoom,
        zoom = _props$zoom === void 0 ? 0 : _props$zoom;
    return _possibleConstructorReturn(this, _getPrototypeOf(OrbitViewport).call(this, {
      id: id,
      viewMatrix: getViewMatrix({
        height: height,
        fovy: fovy,
        orbitAxis: orbitAxis,
        rotationX: rotationX,
        rotationOrbit: rotationOrbit,
        zoom: zoom
      }),
      fovy: fovy,
      near: near,
      far: far,
      x: x,
      y: y,
      position: target,
      width: width,
      height: height,
      zoom: zoom
    }));
  }

  return OrbitViewport;
}(Viewport);

var OrbitView = function (_View) {
  _inherits(OrbitView, _View);

  function OrbitView(props) {
    _classCallCheck(this, OrbitView);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrbitView).call(this, Object.assign({}, props, {
      type: OrbitViewport
    })));
  }

  _createClass(OrbitView, [{
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: OrbitController,
        ViewportType: OrbitViewport
      });
    }
  }]);

  return OrbitView;
}(View);

export { OrbitView as default };
OrbitView.displayName = 'OrbitView';
//# sourceMappingURL=orbit-view.js.map