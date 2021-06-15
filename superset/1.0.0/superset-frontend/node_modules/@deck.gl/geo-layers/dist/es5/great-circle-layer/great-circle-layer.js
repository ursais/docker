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

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layers = require("@deck.gl/layers");

var _greatCircleVertex = _interopRequireDefault(require("./great-circle-vertex.glsl"));

var GreatCircleLayer = function (_ArcLayer) {
  (0, _inherits2.default)(GreatCircleLayer, _ArcLayer);

  function GreatCircleLayer() {
    (0, _classCallCheck2.default)(this, GreatCircleLayer);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GreatCircleLayer).apply(this, arguments));
  }

  (0, _createClass2.default)(GreatCircleLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = Object.assign({}, (0, _get2.default)((0, _getPrototypeOf2.default)(GreatCircleLayer.prototype), "getShaders", this).call(this), {
        vs: _greatCircleVertex.default,
        modules: ['picking', 'project32']
      });
      return shaders;
    }
  }]);
  return GreatCircleLayer;
}(_layers.ArcLayer);

exports.default = GreatCircleLayer;
GreatCircleLayer.layerName = 'GreatCircleLayer';
//# sourceMappingURL=great-circle-layer.js.map