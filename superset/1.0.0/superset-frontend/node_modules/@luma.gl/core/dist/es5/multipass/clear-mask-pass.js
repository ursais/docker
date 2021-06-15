"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _pass = _interopRequireDefault(require("./pass.js"));

var ClearMaskPass = function (_Pass) {
  (0, _inherits2["default"])(ClearMaskPass, _Pass);

  function ClearMaskPass(gl, props) {
    (0, _classCallCheck2["default"])(this, ClearMaskPass);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClearMaskPass).call(this, gl, Object.assign({
      id: 'clear-mask-pass'
    }, props)));
  }

  (0, _createClass2["default"])(ClearMaskPass, [{
    key: "render",
    value: function render(gl) {
      gl.disable(2960);
    }
  }]);
  return ClearMaskPass;
}(_pass["default"]);

exports["default"] = ClearMaskPass;
//# sourceMappingURL=clear-mask-pass.js.map