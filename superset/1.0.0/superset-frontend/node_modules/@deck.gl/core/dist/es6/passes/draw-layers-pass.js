import LayersPass from './layers-pass';
export default class DrawLayersPass extends LayersPass {
  getModuleParameters(layer, effects, effectProps) {
    const moduleParameters = super.getModuleParameters(layer);
    Object.assign(moduleParameters, this.getObjectHighlightParameters(layer), effectProps);

    for (const effect of effects) {
      Object.assign(moduleParameters, effect.getParameters(layer));
    }

    return moduleParameters;
  }

  getObjectHighlightParameters(layer) {
    const _layer$props = layer.props,
          highlightedObjectIndex = _layer$props.highlightedObjectIndex,
          highlightColor = _layer$props.highlightColor;
    const parameters = {
      pickingHighlightColor: [highlightColor[0], highlightColor[1], highlightColor[2], highlightColor[3] || 255]
    };

    if (Number.isInteger(highlightedObjectIndex)) {
      parameters.pickingSelectedColor = highlightedObjectIndex >= 0 ? layer.encodePickingColor(highlightedObjectIndex) : null;
    }

    return parameters;
  }

}
//# sourceMappingURL=draw-layers-pass.js.map