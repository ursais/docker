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

var _directionalLight = _interopRequireDefault(require("./directional-light"));

var _effect = _interopRequireDefault(require("../../lib/effect"));

var DefaultAmbientLightProps = {
  color: [255, 255, 255],
  intensity: 1.0
};
var DefaultDirectionalLightProps = [{
  color: [255, 255, 255],
  intensity: 1.0,
  direction: [-1, -3, -1]
}, {
  color: [255, 255, 255],
  intensity: 0.9,
  direction: [1, 8, -2.5]
}];

var LightingEffect = function (_Effect) {
  (0, _inherits2.default)(LightingEffect, _Effect);

  function LightingEffect(props) {
    var _this;

    (0, _classCallCheck2.default)(this, LightingEffect);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LightingEffect).call(this, props));
    _this.ambientLight = null;
    _this.directionalLights = [];
    _this.pointLights = [];

    for (var key in props) {
      var lightSource = props[key];

      switch (lightSource.type) {
        case 'ambient':
          _this.ambientLight = lightSource;
          break;

        case 'directional':
          _this.directionalLights.push(lightSource);

          break;

        case 'point':
          _this.pointLights.push(lightSource);

          break;

        default:
      }
    }

    _this.applyDefaultLights();

    return _this;
  }

  (0, _createClass2.default)(LightingEffect, [{
    key: "getParameters",
    value: function getParameters(layer) {
      var ambientLight = this.ambientLight;
      var pointLights = this.getProjectedPointLights(layer);
      var directionalLights = this.getProjectedDirectionalLights(layer);
      return {
        lightSources: {
          ambientLight: ambientLight,
          directionalLights: directionalLights,
          pointLights: pointLights
        }
      };
    }
  }, {
    key: "applyDefaultLights",
    value: function applyDefaultLights() {
      var ambientLight = this.ambientLight,
          pointLights = this.pointLights,
          directionalLights = this.directionalLights;

      if (!ambientLight && pointLights.length === 0 && directionalLights.length === 0) {
        this.ambientLight = new _core.AmbientLight(DefaultAmbientLightProps);
        this.directionalLights.push(new _directionalLight.default(DefaultDirectionalLightProps[0]));
        this.directionalLights.push(new _directionalLight.default(DefaultDirectionalLightProps[1]));
      }
    }
  }, {
    key: "getProjectedPointLights",
    value: function getProjectedPointLights(layer) {
      var projectedPointLights = [];

      for (var i = 0; i < this.pointLights.length; i++) {
        var pointLight = this.pointLights[i];
        projectedPointLights.push(pointLight.getProjectedLight({
          layer: layer
        }));
      }

      return projectedPointLights;
    }
  }, {
    key: "getProjectedDirectionalLights",
    value: function getProjectedDirectionalLights(layer) {
      var projectedDirectionalLights = [];

      for (var i = 0; i < this.directionalLights.length; i++) {
        var directionalLight = this.directionalLights[i];
        projectedDirectionalLights.push(directionalLight.getProjectedLight({
          layer: layer
        }));
      }

      return projectedDirectionalLights;
    }
  }]);
  return LightingEffect;
}(_effect.default);

exports.default = LightingEffect;
//# sourceMappingURL=lighting-effect.js.map