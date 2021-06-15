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

var _projectFunctions = require("../../shaderlib/project/project-functions");

var _lib = require("../../lib");

var PointLight = function (_BasePointLight) {
  (0, _inherits2.default)(PointLight, _BasePointLight);

  function PointLight(props) {
    var _this;

    (0, _classCallCheck2.default)(this, PointLight);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PointLight).call(this, props));
    _this.projectedLight = new _core.PointLight(props);
    return _this;
  }

  (0, _createClass2.default)(PointLight, [{
    key: "getProjectedLight",
    value: function getProjectedLight(_ref) {
      var layer = _ref.layer;
      var viewport = layer.context.viewport;
      var _layer$props = layer.props,
          coordinateSystem = _layer$props.coordinateSystem,
          coordinateOrigin = _layer$props.coordinateOrigin;
      var position = (0, _projectFunctions.projectPosition)(this.position, {
        viewport: viewport,
        coordinateSystem: coordinateSystem,
        coordinateOrigin: coordinateOrigin,
        fromCoordinateSystem: viewport.isGeospatial ? _lib.COORDINATE_SYSTEM.LNGLAT : _lib.COORDINATE_SYSTEM.IDENTITY,
        fromCoordinateOrigin: [0, 0, 0]
      });
      this.projectedLight.color = this.color;
      this.projectedLight.intensity = this.intensity;
      this.projectedLight.position = position;
      return this.projectedLight;
    }
  }]);
  return PointLight;
}(_core.PointLight);

exports.default = PointLight;
//# sourceMappingURL=point-light.js.map