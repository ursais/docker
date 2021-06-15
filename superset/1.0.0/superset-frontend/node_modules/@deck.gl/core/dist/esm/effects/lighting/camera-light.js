import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import PointLight from './point-light';
import { getUniformsFromViewport } from '../../shaderlib/project/viewport-uniforms';

var CameraLight = function (_PointLight) {
  _inherits(CameraLight, _PointLight);

  function CameraLight() {
    _classCallCheck(this, CameraLight);

    return _possibleConstructorReturn(this, _getPrototypeOf(CameraLight).apply(this, arguments));
  }

  _createClass(CameraLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref) {
      var layer = _ref.layer;
      var viewport = layer.context.viewport;
      var _layer$props = layer.props,
          coordinateSystem = _layer$props.coordinateSystem,
          coordinateOrigin = _layer$props.coordinateOrigin,
          modelMatrix = _layer$props.modelMatrix;

      var _getUniformsFromViewp = getUniformsFromViewport({
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
}(PointLight);

export { CameraLight as default };
//# sourceMappingURL=camera-light.js.map