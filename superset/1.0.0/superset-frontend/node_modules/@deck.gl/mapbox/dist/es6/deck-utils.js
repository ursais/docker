import { Deck, WebMercatorViewport } from '@deck.gl/core';
export function getDeckInstance(_ref) {
  let map = _ref.map,
      gl = _ref.gl,
      deck = _ref.deck;

  if (map.__deck) {
    return map.__deck;
  }

  const customRender = deck && deck.props._customRender;
  const deckProps = {
    useDevicePixels: true,
    _customRender: () => {
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
      gl,
      width: false,
      height: false,
      viewState: getViewState(map)
    });
    deck = new Deck(deckProps);
    map.on('move', () => onMapMove(deck, map));
    map.on('remove', () => {
      deck.finalize();
      map.__deck = null;
    });
  }

  map.__deck = deck;
  map.on('render', () => afterRender(deck, map));
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
  let currentViewport = deck.props.userData.currentViewport;

  if (!currentViewport) {
    currentViewport = getViewport(deck, map, true);
    deck.props.userData.currentViewport = currentViewport;
  }

  deck._drawLayers('mapbox-repaint', {
    viewports: [currentViewport],
    layers: getLayers(deck, deckLayer => shouldDrawLayer(layer.id, deckLayer)),
    clearCanvas: false
  });
}

function getViewState(map) {
  const _map$getCenter = map.getCenter(),
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
  let useMapboxProjection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
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
  const _deck$props$userData = deck.props.userData,
        mapboxLayers = _deck$props$userData.mapboxLayers,
        isExternal = _deck$props$userData.isExternal;

  if (isExternal) {
    const mapboxLayerIds = Array.from(mapboxLayers, layer => layer.id);
    const layers = getLayers(deck, deckLayer => {
      for (const id of mapboxLayerIds) {
        if (shouldDrawLayer(id, deckLayer)) {
          return false;
        }
      }

      return true;
    });

    if (layers.length > 0) {
      deck._drawLayers('mapbox-repaint', {
        viewports: [getViewport(deck, map, false)],
        layers,
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
  const layers = deck.layerManager.getLayers();
  return layers.filter(layerFilter);
}

function shouldDrawLayer(id, layer) {
  let layerInstance = layer;

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

  const layers = [];
  deck.props.userData.mapboxLayers.forEach(deckLayer => {
    const LayerType = deckLayer.props.type;
    const layer = new LayerType(deckLayer.props);
    layers.push(layer);
  });
  deck.setProps({
    layers
  });
}
//# sourceMappingURL=deck-utils.js.map