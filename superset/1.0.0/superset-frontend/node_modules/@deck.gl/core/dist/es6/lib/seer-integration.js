import seer from 'seer';

const recursiveSet = (obj, path, value) => {
  if (!obj) {
    return;
  }

  if (path.length > 1) {
    recursiveSet(obj[path[0]], path.slice(1), value);
  } else {
    obj[path[0]] = value;
  }
};

const overrides = new Map();
export const setPropOverrides = (id, valuePath, value) => {
  if (!seer.isReady()) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  const props = overrides.get(id);
  props.set(valuePath, value);
};
export const applyPropOverrides = props => {
  if (!seer.isReady() || !props.id) {
    return;
  }

  const overs = overrides.get(props.id);

  if (!overs) {
    return;
  }

  overs.forEach((value, valuePath) => {
    recursiveSet(props, valuePath, value);

    if (valuePath[0] === 'data') {
      props.data = [...props.data];
    }
  });
};
export const layerEditListener = cb => {
  if (!seer.isReady()) {
    return;
  }

  seer.listenFor('deck.gl', cb);
};
export const seerInitListener = cb => {
  if (!seer.isReady()) {
    return;
  }

  seer.listenFor('init', cb);
};
export const initLayerInSeer = layer => {
  if (!seer.isReady() || !layer) {
    return;
  }

  const badges = [layer.constructor.layerName];
  seer.listItem('deck.gl', layer.id, {
    badges,
    links: layer.state && layer.state.model ? [`luma.gl:${layer.state.model.id}`] : undefined,
    parent: layer.parent ? layer.parent.id : undefined
  });
};
export const updateLayerInSeer = layer => {
  if (!seer.isReady() || seer.throttle(`deck.gl:${layer.id}`, 1e3)) {
    return;
  }

  const data = logPayload(layer);
  seer.multiUpdate('deck.gl', layer.id, data);
};
export const removeLayerInSeer = id => {
  if (!seer.isReady() || !id) {
    return;
  }

  seer.deleteItem('deck.gl', id);
};

function logPayload(layer) {
  const data = [{
    path: 'objects.props',
    data: layer.props
  }];
  const badges = [layer.constructor.layerName];

  if (layer.state) {
    if (layer.getAttributeManager()) {
      const attrs = layer.getAttributeManager().getAttributes();
      data.push({
        path: 'objects.attributes',
        data: attrs
      });
    }

    if (layer.state.model) {
      layer.state.model.setProps({
        timerQueryEnabled: true
      });
      const lastFrameTime = layer.state.model.stats.lastFrameTime;

      if (lastFrameTime) {
        badges.push(`${(lastFrameTime * 1000).toFixed(0)}μs`);
      }
    }
  }

  data.push({
    path: 'badges',
    data: badges
  });
  return data;
}
//# sourceMappingURL=seer-integration.js.map