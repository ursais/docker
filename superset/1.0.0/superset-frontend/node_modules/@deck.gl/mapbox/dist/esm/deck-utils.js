import { Deck, WebMercatorViewport } from '@deck.gl/core';
export function getDeckInstance(_ref) {
  var map = _ref.map,
      gl = _ref.gl,
      deck = _ref.deck;

  if (map.__deck) {
    return map.__deck;
  }

  var customRender = deck && deck.props._customRender;
  var deckProps = {
    useDevicePixels: true,
    _customRender: function _customRender() {
      map.triggerRepaint();

      if (customRender) {
        customRender();
      }
    },
    parameters: {
      depthMask: true,
      depthTest: true,
      blendFunc: [770, 771, 1, 771],
      blendEquation: 32774
    },
    userData: {
      isExternal: false,
      mapboxLayers: new Set()
    }
  };

  if (deck) {
    deck.setProps(deckProps);
    deck.props.userData.isExternal = true;
  } else {
    Object.assign(deckProps, {
      gl: gl,
      width: false,
      height: false,
      viewState: getViewState(map)
    });
    deck = new Deck(deckProps);
    map.on('move', function () {
      return onMapMove(deck, map);
    });
    map.on('remove', function () {
      deck.finalize();
      map.__deck = null;
    });
  }

  map.__deck = deck;
  map.on('render', function () {
    return afterRender(deck, map);
  });
  return deck;
}
export function addLayer(deck, layer) {
  deck.props.userData.mapboxLayers.add(layer);
  updateLayers(deck);
}
export function removeLayer(deck, layer) {
  deck.props.userData.mapboxLayers.delete(layer);
  updateLayers(deck);
}
export function updateLayer(deck, layer) {
  updateLayers(deck);
}
export function drawLayer(deck, map, layer) {
  var currentViewport = deck.props.userData.currentViewport;

  if (!currentViewport) {
    currentViewport = getViewport(deck, map, true);
    deck.props.userData.currentViewport = currentViewport;
  }

  deck._drawLayers('mapbox-repaint', {
    viewports: [currentViewport],
    layers: getLayers(deck, function (deckLayer) {
      return shouldDrawLayer(layer.id, deckLayer);
    }),
    clearCanvas: false
  });
}

function getViewState(map) {
  var _map$getCenter = map.getCenter(),
      lng = _map$getCenter.lng,
      lat = _map$getCenter.lat;

  return {
    longitude: lng,
    latitude: lat,
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch()
  };
}

function getViewport(deck, map) {
  var useMapboxProjection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return new WebMercatorViewport(Object.assign({
    x: 0,
    y: 0,
    width: deck.width,
    height: deck.height
  }, getViewState(map), useMapboxProjection ? {
    nearZMultiplier: deck.height ? 1 / deck.height : 1,
    farZMultiplier: 1
  } : {
    nearZMultiplier: 0.1,
    farZMultiplier: 10
  }));
}

function afterRender(deck, map) {
  var _deck$props$userData = deck.props.userData,
      mapboxLayers = _deck$props$userData.mapboxLayers,
      isExternal = _deck$props$userData.isExternal;

  if (isExternal) {
    var mapboxLayerIds = Array.from(mapboxLayers, function (layer) {
      return layer.id;
    });
    var layers = getLayers(deck, function (deckLayer) {
      for (var _i = 0; _i < mapboxLayerIds.length; _i++) {
        var id = mapboxLayerIds[_i];

        if (shouldDrawLayer(id, deckLayer)) {
          return false;
        }
      }

      return true;
    });

    if (layers.length > 0) {
      deck._drawLayers('mapbox-repaint', {
        viewports: [getViewport(deck, map, false)],
        layers: layers,
        clearCanvas: false
      });
    }
  }

  deck.props.userData.currentViewport = null;
}

function onMapMove(deck, map) {
  deck.setProps({
    viewState: getViewState(map)
  });
  deck.needsRedraw({
    clearRedrawFlags: true
  });
}

function getLayers(deck, layerFilter) {
  var layers = deck.layerManager.getLayers();
  return layers.filter(layerFilter);
}

function shouldDrawLayer(id, layer) {
  var layerInstance = layer;

  while (layerInstance) {
    if (layerInstance.id === id) {
      return true;
    }

    layerInstance = layerInstance.parent;
  }

  return false;
}

function updateLayers(deck) {
  if (deck.props.userData.isExternal) {
    return;
  }

  var layers = [];
  deck.props.userData.mapboxLayers.forEach(function (deckLayer) {
    var LayerType = deckLayer.props.type;
    var layer = new LayerType(deckLayer.props);
    layers.push(layer);
  });
  deck.setProps({
    layers: layers
  });
}
//# sourceMappingURL=deck-utils.js.map