"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _material = _interopRequireDefault(require("./material"));

var PBRMaterial = function (_Material) {
  (0, _inherits2["default"])(PBRMaterial, _Material);

  function PBRMaterial() {
    (0, _classCallCheck2["default"])(this, PBRMaterial);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PBRMaterial).apply(this, arguments));
  }

  return PBRMaterial;
}(_material["default"]);

exports["default"] = PBRMaterial;
//# sourceMappingURL=pbr-material.js.map