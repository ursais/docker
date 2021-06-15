"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _material = _interopRequireDefault(require("./material"));

var defaultProps = {
  ambient: 0.35,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [30, 30, 30]
};

var PhongMaterial = function (_Material) {
  (0, _inherits2["default"])(PhongMaterial, _Material);

  function PhongMaterial(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, PhongMaterial);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PhongMaterial).call(this, props));
    props = Object.assign({}, defaultProps, props);
    Object.assign((0, _assertThisInitialized2["default"])(_this), props);
    return _this;
  }

  return PhongMaterial;
}(_material["default"]);

exports["default"] = PhongMaterial;
//# sourceMappingURL=phong-material.js.map