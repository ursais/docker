export function processPickInfo(_ref) {
  let pickInfo = _ref.pickInfo,
      lastPickedInfo = _ref.lastPickedInfo,
      mode = _ref.mode,
      layers = _ref.layers,
      viewports = _ref.viewports,
      x = _ref.x,
      y = _ref.y,
      deviceX = _ref.deviceX,
      deviceY = _ref.deviceY,
      pixelRatio = _ref.pixelRatio;
  const pickedColor = pickInfo.pickedColor,
        pickedLayer = pickInfo.pickedLayer,
        pickedObjectIndex = pickInfo.pickedObjectIndex;
  const affectedLayers = pickedLayer ? [pickedLayer] : [];

  if (mode === 'hover') {
    const lastPickedObjectIndex = lastPickedInfo.index;
    const lastPickedLayerId = lastPickedInfo.layerId;
    const pickedLayerId = pickedLayer && pickedLayer.props.id;

    if (pickedLayerId !== lastPickedLayerId || pickedObjectIndex !== lastPickedObjectIndex) {
      if (pickedLayerId !== lastPickedLayerId) {
        const lastPickedLayer = layers.find(layer => layer.props.id === lastPickedLayerId);

        if (lastPickedLayer) {
          affectedLayers.unshift(lastPickedLayer);
        }
      }

      lastPickedInfo.layerId = pickedLayerId;
      lastPickedInfo.index = pickedObjectIndex;
      lastPickedInfo.info = null;
    }
  }

  const viewport = getViewportFromCoordinates({
    viewports
  });
  const coordinate = viewport && viewport.unproject([x, y]);
  const baseInfo = {
    color: null,
    layer: null,
    index: -1,
    picked: false,
    x,
    y,
    pixel: [x, y],
    coordinate,
    lngLat: coordinate,
    devicePixel: [deviceX, deviceY],
    pixelRatio
  };
  const infos = new Map();
  infos.set(null, baseInfo);
  affectedLayers.forEach(layer => {
    let info = Object.assign({}, baseInfo);

    if (layer === pickedLayer) {
      info.color = pickedColor;
      info.index = pickedObjectIndex;
      info.picked = true;
    }

    info = getLayerPickingInfo({
      layer,
      info,
      mode
    });

    if (layer === pickedLayer && mode === 'hover') {
      lastPickedInfo.info = info;
    }

    if (info) {
      infos.set(info.layer.id, info);
    }

    if (mode === 'hover') {
      const pickingSelectedColor = layer.props.autoHighlight && pickedLayer === layer ? pickedColor : null;
      layer.setModuleParameters({
        pickingSelectedColor
      });
      layer.setNeedsRedraw();
    }
  });
  return infos;
}
export function getLayerPickingInfo(_ref2) {
  let layer = _ref2.layer,
      info = _ref2.info,
      mode = _ref2.mode;

  while (layer && info) {
    const sourceLayer = info.layer || layer;
    info.layer = layer;
    info = layer.pickLayer({
      info,
      mode,
      sourceLayer
    });
    layer = layer.parent;
  }

  return info;
}

function getViewportFromCoordinates(_ref3) {
  let viewports = _ref3.viewports;
  const viewport = viewports[0];
  return viewport;
}
//# sourceMappingURL=pick-info.js.map