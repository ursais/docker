import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { DirectionalLight } from '@luma.gl/core';
import { getSunlightDirection } from './suncalc';

var SunLight = function (_DirectionalLight) {
  _inherits(SunLight, _DirectionalLight);

  function SunLight(_ref) {
    var _this;

    var timestamp = _ref.timestamp,
        others = _objectWithoutProperties(_ref, ["timestamp"]);

    _classCallCheck(this, SunLight);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SunLight).call(this, others));
    _this.timestamp = timestamp;
    return _this;
  }

  _createClass(SunLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref2) {
      var layer = _ref2.layer;
      var _layer$context$viewpo = layer.context.viewport,
          latitude = _layer$context$viewpo.latitude,
          longitude = _layer$context$viewpo.longitude;
      this.direction = getSunlightDirection(this.timestamp, latitude, longitude);
      return this;
    }
  }]);

  return SunLight;
}(DirectionalLight);

export { SunLight as default };
//# sourceMappingURL=sun-light.js.map