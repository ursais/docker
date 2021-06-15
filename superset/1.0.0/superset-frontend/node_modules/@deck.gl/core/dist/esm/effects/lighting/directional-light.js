import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { DirectionalLight as BaseDirectionalLight } from '@luma.gl/core';

var DirectionalLight = function (_BaseDirectionalLight) {
  _inherits(DirectionalLight, _BaseDirectionalLight);

  function DirectionalLight() {
    _classCallCheck(this, DirectionalLight);

    return _possibleConstructorReturn(this, _getPrototypeOf(DirectionalLight).apply(this, arguments));
  }

  _createClass(DirectionalLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight() {
      return this;
    }
  }]);

  return DirectionalLight;
}(BaseDirectionalLight);

export { DirectionalLight as default };
//# sourceMappingURL=directional-light.js.map