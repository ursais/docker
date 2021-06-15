"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _view = _interopRequireDefault(require("./view"));

var _viewport = _interopRequireDefault(require("../viewports/viewport"));

var _math = require("math.gl");

var _orbitController = _interopRequireDefault(require("../controllers/orbit-controller"));

var DEGREES_TO_RADIANS = Math.PI / 180;

function getViewMatrix(_ref) {
  var height = _ref.height,
      fovy = _ref.fovy,
      orbitAxis = _ref.orbitAxis,
      rotationX = _ref.rotationX,
      rotationOrbit = _ref.rotationOrbit,
      zoom = _ref.zoom;
  var distance = 0.5 / Math.tan(fovy * DEGREES_TO_RADIANS / 2);
  var viewMatrix = new _math.Matrix4().lookAt({
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
  (0, _inherits2.default)(OrbitViewport, _Viewport);

  function OrbitViewport(props) {
    (0, _classCallCheck2.default)(this, OrbitViewport);
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
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(OrbitViewport).call(this, {
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
}(_viewport.default);

var OrbitView = function (_View) {
  (0, _inherits2.default)(OrbitView, _View);

  function OrbitView(props) {
    (0, _classCallCheck2.default)(this, OrbitView);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(OrbitView).call(this, Object.assign({}, props, {
      type: OrbitViewport
    })));
  }

  (0, _createClass2.default)(OrbitView, [{
    key: "controller",
    get: function get() {
      return this._getControllerProps({
        type: _orbitController.default,
        ViewportType: OrbitViewport
      });
    }
  }]);
  return OrbitView;
}(_view.default);

exports.default = OrbitView;
OrbitView.displayName = 'OrbitView';
//# sourceMappingURL=orbit-view.js.map