import { CompositeLayer } from '@deck.gl/core';
import { getJSONLayers } from '../parsers/convert-json';
const defaultProps = {
  fetch: dataString => JSON.parse(dataString),
  configuration: []
};
export default class JSONLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      layers: []
    };
  }

  updateState(_ref) {
    let props = _ref.props,
        oldProps = _ref.oldProps,
        changeFlags = _ref.changeFlags;
    const layersChanged = changeFlags.dataChanged || props.configuration !== oldProps.configuration;

    if (layersChanged) {
      this.state.layers = getJSONLayers(props.data, props.configuration);
    }
  }

  renderLayers() {
    return this.state.layers;
  }

}
JSONLayer.layerName = 'JSONLayer';
JSONLayer.defaultProps = defaultProps;
//# sourceMappingURL=json-layer.js.map