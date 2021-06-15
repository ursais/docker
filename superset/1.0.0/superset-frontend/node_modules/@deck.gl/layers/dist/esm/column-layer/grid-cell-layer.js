import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { CubeGeometry } from '@luma.gl/core';
import ColumnLayer from './column-layer';
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
  _inherits(GridCellLayer, _ColumnLayer);

  function GridCellLayer() {
    _classCallCheck(this, GridCellLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(GridCellLayer).apply(this, arguments));
  }

  _createClass(GridCellLayer, [{
    key: "getGeometry",
    value: function getGeometry(diskResolution) {
      return new CubeGeometry();
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
}(ColumnLayer);

export { GridCellLayer as default };
GridCellLayer.layerName = 'GridCellLayer';
GridCellLayer.defaultProps = defaultProps;
//# sourceMappingURL=grid-cell-layer.js.map