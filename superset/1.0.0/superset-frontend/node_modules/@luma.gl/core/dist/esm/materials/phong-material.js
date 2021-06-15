import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Material from './material';
var defaultProps = {
  ambient: 0.35,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [30, 30, 30]
};

var PhongMaterial = function (_Material) {
  _inherits(PhongMaterial, _Material);

  function PhongMaterial(props) {
    var _this;

    _classCallCheck(this, PhongMaterial);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PhongMaterial).call(this, props));
    props = Object.assign({}, defaultProps, props);
    Object.assign(_assertThisInitialized(_this), props);
    return _this;
  }

  return PhongMaterial;
}(Material);

export { PhongMaterial as default };
//# sourceMappingURL=phong-material.js.map