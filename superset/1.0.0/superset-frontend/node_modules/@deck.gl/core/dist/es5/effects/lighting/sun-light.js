"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@luma.gl/core");

var _suncalc = require("./suncalc");

var SunLight = function (_DirectionalLight) {
  (0, _inherits2.default)(SunLight, _DirectionalLight);

  function SunLight(_ref) {
    var _this;

    var timestamp = _ref.timestamp,
        others = (0, _objectWithoutProperties2.default)(_ref, ["timestamp"]);
    (0, _classCallCheck2.default)(this, SunLight);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SunLight).call(this, others));
    _this.timestamp = timestamp;
    return _this;
  }

  (0, _createClass2.default)(SunLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref2) {
      var layer = _ref2.layer;
      var _layer$context$viewpo = layer.context.viewport,
          latitude = _layer$context$viewpo.latitude,
          longitude = _layer$context$viewpo.longitude;
      this.direction = (0, _suncalc.getSunlightDirection)(this.timestamp, latitude, longitude);
      return this;
    }
  }]);
  return SunLight;
}(_core.DirectionalLight);

exports.default = SunLight;
//# sourceMappingURL=sun-light.js.map