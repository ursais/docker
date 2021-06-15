"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointLight = exports.DirectionalLight = exports.AmbientLight = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _math = require("math.gl");

var _utils = require("../utils");

var DEFAULT_LIGHT_COLOR = [255, 255, 255];
var DEFAULT_LIGHT_INTENSITY = 1.0;
var DEFAULT_ATTENUATION = [0, 0, 1];
var DEFAULT_LIGHT_DIRECTION = [0.0, 0.0, -1.0];
var DEFAULT_LIGHT_POSITION = [0.0, 0.0, 1.0];

var Light = function Light() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, Light);
  this.id = props.id || (0, _utils.uid)('light');
  var _props$color = props.color,
      color = _props$color === void 0 ? DEFAULT_LIGHT_COLOR : _props$color;
  this.color = color;
  var _props$intensity = props.intensity,
      intensity = _props$intensity === void 0 ? DEFAULT_LIGHT_INTENSITY : _props$intensity;
  this.intensity = intensity;
};

var AmbientLight = function (_Light) {
  (0, _inherits2["default"])(AmbientLight, _Light);

  function AmbientLight() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, AmbientLight);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AmbientLight).call(this, props));
    _this.type = 'ambient';
    return _this;
  }

  return AmbientLight;
}(Light);

exports.AmbientLight = AmbientLight;

var DirectionalLight = function (_Light2) {
  (0, _inherits2["default"])(DirectionalLight, _Light2);

  function DirectionalLight() {
    var _this2;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, DirectionalLight);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DirectionalLight).call(this, props));
    _this2.type = 'directional';
    var _props$direction = props.direction,
        direction = _props$direction === void 0 ? DEFAULT_LIGHT_DIRECTION : _props$direction;
    _this2.direction = new _math.Vector3(direction).normalize().toArray();
    return _this2;
  }

  return DirectionalLight;
}(Light);

exports.DirectionalLight = DirectionalLight;

var PointLight = function (_Light3) {
  (0, _inherits2["default"])(PointLight, _Light3);

  function PointLight() {
    var _this3;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, PointLight);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PointLight).call(this, props));
    _this3.type = 'point';
    var _props$position = props.position,
        position = _props$position === void 0 ? DEFAULT_LIGHT_POSITION : _props$position;
    _this3.position = position;
    _this3.attenuation = _this3._getAttenuation(props);
    return _this3;
  }

  (0, _createClass2["default"])(PointLight, [{
    key: "_getAttenuation",
    value: function _getAttenuation(props) {
      if ('attenuation' in props) {
        return props.attenuation;
      }

      if ('intensity' in props) {
        return [0, 0, props.intensity];
      }

      return DEFAULT_ATTENUATION;
    }
  }]);
  return PointLight;
}(Light);

exports.PointLight = PointLight;
//# sourceMappingURL=light-source.js.map