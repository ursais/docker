export function processPickInfo(_ref) {
  var pickInfo = _ref.pickInfo,
      lastPickedInfo = _ref.lastPickedInfo,
      mode = _ref.mode,
      layers = _ref.layers,
      viewports = _ref.viewports,
      x = _ref.x,
      y = _ref.y,
      deviceX = _ref.deviceX,
      deviceY = _ref.deviceY,
      pixelRatio = _ref.pixelRatio;
  var pickedColor = pickInfo.pickedColor,
      pickedLayer = pickInfo.pickedLayer,
      pickedObjectIndex = pickInfo.pickedObjectIndex;
  var affectedLayers = pickedLayer ? [pickedLayer] : [];

  if (mode === 'hover') {
    var lastPickedObjectIndex = lastPickedInfo.index;
    var lastPickedLayerId = lastPickedInfo.layerId;
    var pickedLayerId = pickedLayer && pickedLayer.props.id;

    if (pickedLayerId !== lastPickedLayerId || pickedObjectIndex !== lastPickedObjectIndex) {
      if (pickedLayerId !== lastPickedLayerId) {
        var lastPickedLayer = layers.find(function (layer) {
          return layer.props.id === lastPickedLayerId;
        });

        if (lastPickedLayer) {
          affectedLayers.unshift(lastPickedLayer);
        }
      }

      lastPickedInfo.layerId = pickedLayerId;
      lastPickedInfo.index = pickedObjectIndex;
      lastPickedInfo.info = null;
    }
  }

  var viewport = getViewportFromCoordinates({
    viewports: viewports
  });
  var coordinate = viewport && viewport.unproject([x, y]);
  var baseInfo = {
    color: null,
    layer: null,
    index: -1,
    picked: false,
    x: x,
    y: y,
    pixel: [x, y],
    coordinate: coordinate,
    lngLat: coordinate,
    devicePixel: [deviceX, deviceY],
    pixelRatio: pixelRatio
  };
  var infos = new Map();
  infos.set(null, baseInfo);
  affectedLayers.forEach(function (layer) {
    var info = Object.assign({}, baseInfo);

    if (layer === pickedLayer) {
      info.color = pickedColor;
      info.index = pickedObjectIndex;
      info.picked = true;
    }

    info = getLayerPickingInfo({
      layer: layer,
      info: info,
      mode: mode
    });

    if (layer === pickedLayer && mode === 'hover') {
      lastPickedInfo.info = info;
    }

    if (info) {
      infos.set(info.layer.id, info);
    }

    if (mode === 'hover') {
      var pickingSelectedColor = layer.props.autoHighlight && pickedLayer === layer ? pickedColor : null;
      layer.setModuleParameters({
        pickingSelectedColor: pickingSelectedColor
      });
      layer.setNeedsRedraw();
    }
  });
  return infos;
}
export function getLayerPickingInfo(_ref2) {
  var layer = _ref2.layer,
      info = _ref2.info,
      mode = _ref2.mode;

  while (layer && info) {
    var sourceLayer = info.layer || layer;
    info.layer = layer;
    info = layer.pickLayer({
      info: info,
      mode: mode,
      sourceLayer: sourceLayer
    });
    layer = layer.parent;
  }

  return info;
}

function getViewportFromCoordinates(_ref3) {
  var viewports = _ref3.viewports;
  var viewport = viewports[0];
  return viewport;
}
//# sourceMappingURL=pick-info.js.map