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

var _columnLayer = _interopRequireDefault(require("./column-layer"));

var defaultProps = {
  cellSize: {
    type: 'number',
    min: 0,
    value: 1000
  },
  offset: {
    type: 'array',
    min: 0,
    value: [1, 1]
  }
};

var GridCellLayer = function (_ColumnLayer) {
  (0, _inherits2.default)(GridCellLayer, _ColumnLayer);

  function GridCellLayer() {
    (0, _classCallCheck2.default)(this, GridCellLayer);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GridCellLayer).apply(this, arguments));
  }

  (0, _createClass2.default)(GridCellLayer, [{
    key: "getGeometry",
    value: function getGeometry(diskResolution) {
      return new _core.CubeGeometry();
    }
  }, {
    key: "draw",
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;
      var _this$props = this.props,
          elevationScale = _this$props.elevationScale,
          extruded = _this$props.extruded,
          offset = _this$props.offset,
          coverage = _this$props.coverage,
          cellSize = _this$props.cellSize,
          angle = _this$props.angle;
      this.state.model.setUniforms(Object.assign({}, uniforms, {
        radius: cellSize / 2,
        angle: angle,
        offset: offset,
        extruded: extruded,
        coverage: coverage,
        elevationScale: elevationScale,
        edgeDistance: 1,
        isWireframe: false
      })).draw();
    }
  }]);
  return GridCellLayer;
}(_columnLayer.default);

exports.default = GridCellLayer;
GridCellLayer.layerName = 'GridCellLayer';
GridCellLayer.defaultProps = defaultProps;
//# sourceMappingURL=grid-cell-layer.js.map