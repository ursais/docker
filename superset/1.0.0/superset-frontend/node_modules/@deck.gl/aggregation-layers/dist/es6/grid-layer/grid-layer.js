import { CompositeLayer } from '@deck.gl/core';
import GPUGridAggregator from '../utils/gpu-grid-aggregation/gpu-grid-aggregator';
import GPUGridLayer from '../gpu-grid-layer/gpu-grid-layer';
import CPUGridLayer from '../cpu-grid-layer/cpu-grid-layer';
const defaultProps = Object.assign({}, GPUGridLayer.defaultProps, CPUGridLayer.defaultProps, {
  gpuAggregation: false
});
export default class GridLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      useGPUAggregation: true
    };
  }

  updateState(_ref) {
    let oldProps = _ref.oldProps,
        props = _ref.props,
        changeFlags = _ref.changeFlags;
    const newState = {};
    newState.useGPUAggregation = this.canUseGPUAggregation(props);
    this.setState(newState);
  }

  renderLayers() {
    const _this$props = this.props,
          data = _this$props.data,
          updateTriggers = _this$props.updateTriggers;
    const id = this.state.useGPUAggregation ? 'GPU' : 'CPU';
    const LayerType = this.state.useGPUAggregation ? this.getSubLayerClass('GPU', GPUGridLayer) : this.getSubLayerClass('CPU', CPUGridLayer);
    return new LayerType(this.props, this.getSubLayerProps({
      id,
      updateTriggers
    }), {
      data
    });
  }

  canUseGPUAggregation(props) {
    const gpuAggregation = props.gpuAggregation,
          lowerPercentile = props.lowerPercentile,
          upperPercentile = props.upperPercentile,
          getColorValue = props.getColorValue,
          getElevationValue = props.getElevationValue;

    if (!gpuAggregation) {
      return false;
    }

    if (!GPUGridAggregator.isSupported(this.context.gl)) {
      return false;
    }

    if (lowerPercentile !== 0 || upperPercentile !== 100) {
      return false;
    }

    if (getColorValue !== null || getElevationValue !== null) {
      return false;
    }

    return true;
  }

}
GridLayer.layerName = 'GridLayer';
GridLayer.defaultProps = defaultProps;
//# sourceMappingURL=grid-layer.js.map