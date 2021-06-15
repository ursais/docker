import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import { Vector3 } from 'math.gl';
import { uid } from '../utils';
var DEFAULT_LIGHT_COLOR = [255, 255, 255];
var DEFAULT_LIGHT_INTENSITY = 1.0;
var DEFAULT_ATTENUATION = [0, 0, 1];
var DEFAULT_LIGHT_DIRECTION = [0.0, 0.0, -1.0];
var DEFAULT_LIGHT_POSITION = [0.0, 0.0, 1.0];

var Light = function Light() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Light);

  this.id = props.id || uid('light');
  var _props$color = props.color,
      color = _props$color === void 0 ? DEFAULT_LIGHT_COLOR : _props$color;
  this.color = color;
  var _props$intensity = props.intensity,
      intensity = _props$intensity === void 0 ? DEFAULT_LIGHT_INTENSITY : _props$intensity;
  this.intensity = intensity;
};

export var AmbientLight = function (_Light) {
  _inherits(AmbientLight, _Light);

  function AmbientLight() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AmbientLight);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AmbientLight).call(this, props));
    _this.type = 'ambient';
    return _this;
  }

  return AmbientLight;
}(Light);
export var DirectionalLight = function (_Light2) {
  _inherits(DirectionalLight, _Light2);

  function DirectionalLight() {
    var _this2;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DirectionalLight);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DirectionalLight).call(this, props));
    _this2.type = 'directional';
    var _props$direction = props.direction,
        direction = _props$direction === void 0 ? DEFAULT_LIGHT_DIRECTION : _props$direction;
    _this2.direction = new Vector3(direction).normalize().toArray();
    return _this2;
  }

  return DirectionalLight;
}(Light);
export var PointLight = function (_Light3) {
  _inherits(PointLight, _Light3);

  function PointLight() {
    var _this3;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PointLight);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(PointLight).call(this, props));
    _this3.type = 'point';
    var _props$position = props.position,
        position = _props$position === void 0 ? DEFAULT_LIGHT_POSITION : _props$position;
    _this3.position = position;
    _this3.attenuation = _this3._getAttenuation(props);
    return _this3;
  }

  _createClass(PointLight, [{
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
//# sourceMappingURL=light-source.js.map