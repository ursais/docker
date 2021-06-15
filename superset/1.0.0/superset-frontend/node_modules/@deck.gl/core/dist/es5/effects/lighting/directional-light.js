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

var _core = require("@luma.gl/core");

var DirectionalLight = function (_BaseDirectionalLight) {
  (0, _inherits2.default)(DirectionalLight, _BaseDirectionalLight);

  function DirectionalLight() {
    (0, _classCallCheck2.default)(this, DirectionalLight);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DirectionalLight).apply(this, arguments));
  }

  (0, _createClass2.default)(DirectionalLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight() {
      return this;
    }
  }]);
  return DirectionalLight;
}(_core.DirectionalLight);

exports.default = DirectionalLight;
//# sourceMappingURL=directional-light.js.map