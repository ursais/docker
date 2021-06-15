import { CubeGeometry } from '@luma.gl/core';
import ColumnLayer from './column-layer';
const defaultProps = {
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
export default class GridCellLayer extends ColumnLayer {
  getGeometry(diskResolution) {
    return new CubeGeometry();
  }

  draw(_ref) {
    let uniforms = _ref.uniforms;
    const _this$props = this.props,
          elevationScale = _this$props.elevationScale,
          extruded = _this$props.extruded,
          offset = _this$props.offset,
          coverage = _this$props.coverage,
          cellSize = _this$props.cellSize,
          angle = _this$props.angle;
    this.state.model.setUniforms(Object.assign({}, uniforms, {
      radius: cellSize / 2,
      angle,
      offset,
      extruded,
      coverage,
      elevationScale,
      edgeDistance: 1,
      isWireframe: false
    })).draw();
  }

}
GridCellLayer.layerName = 'GridCellLayer';
GridCellLayer.defaultProps = defaultProps;
//# sourceMappingURL=grid-cell-layer.js.map