import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { PointLight as BasePointLight } from '@luma.gl/core';
import { projectPosition } from '../../shaderlib/project/project-functions';
import { COORDINATE_SYSTEM } from '../../lib';

var PointLight = function (_BasePointLight) {
  _inherits(PointLight, _BasePointLight);

  function PointLight(props) {
    var _this;

    _classCallCheck(this, PointLight);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PointLight).call(this, props));
    _this.projectedLight = new BasePointLight(props);
    return _this;
  }

  _createClass(PointLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref) {
      var layer = _ref.layer;
      var viewport = layer.context.viewport;
      var _layer$props = layer.props,
          coordinateSystem = _layer$props.coordinateSystem,
          coordinateOrigin = _layer$props.coordinateOrigin;
      var position = projectPosition(this.position, {
        viewport: viewport,
        coordinateSystem: coordinateSystem,
        coordinateOrigin: coordinateOrigin,
        fromCoordinateSystem: viewport.isGeospatial ? COORDINATE_SYSTEM.LNGLAT : COORDINATE_SYSTEM.IDENTITY,
        fromCoordinateOrigin: [0, 0, 0]
      });
      this.projectedLight.color = this.color;
      this.projectedLight.intensity = this.intensity;
      this.projectedLight.position = position;
      return this.projectedLight;
    }
  }]);

  return PointLight;
}(BasePointLight);

export { PointLight as default };
//# sourceMappingURL=point-light.js.map