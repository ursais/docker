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

var _pointLight = _interopRequireDefault(require("./point-light"));

var _viewportUniforms = require("../../shaderlib/project/viewport-uniforms");

var CameraLight = function (_PointLight) {
  (0, _inherits2.default)(CameraLight, _PointLight);

  function CameraLight() {
    (0, _classCallCheck2.default)(this, CameraLight);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CameraLight).apply(this, arguments));
  }

  (0, _createClass2.default)(CameraLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref) {
      var layer = _ref.layer;
      var viewport = layer.context.viewport;
      var _layer$props = layer.props,
          coordinateSystem = _layer$props.coordinateSystem,
          coordinateOrigin = _layer$props.coordinateOrigin,
          modelMatrix = _layer$props.modelMatrix;

      var _getUniformsFromViewp = (0, _viewportUniforms.getUniformsFromViewport)({
        viewport: viewport,
        modelMatrix: modelMatrix,
        coordinateSystem: coordinateSystem,
        coordinateOrigin: coordinateOrigin
      }),
          project_uCameraPosition = _getUniformsFromViewp.project_uCameraPosition;

      this.projectedLight.color = this.color;
      this.projectedLight.intensity = this.intensity;
      this.projectedLight.position = project_uCameraPosition;
      return this.projectedLight;
    }
  }]);
  return CameraLight;
}(_pointLight.default);

exports.default = CameraLight;
//# sourceMappingURL=camera-light.js.map