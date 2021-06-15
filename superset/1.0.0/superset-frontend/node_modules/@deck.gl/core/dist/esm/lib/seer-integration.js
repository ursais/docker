import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import seer from 'seer';

var recursiveSet = function recursiveSet(obj, path, value) {
  if (!obj) {
    return;
  }

  if (path.length > 1) {
    recursiveSet(obj[path[0]], path.slice(1), value);
  } else {
    obj[path[0]] = value;
  }
};

var overrides = new Map();
export var setPropOverrides = function setPropOverrides(id, valuePath, value) {
  if (!seer.isReady()) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  var props = overrides.get(id);
  props.set(valuePath, value);
};
export var applyPropOverrides = function applyPropOverrides(props) {
  if (!seer.isReady() || !props.id) {
    return;
  }

  var overs = overrides.get(props.id);

  if (!overs) {
    return;
  }

  overs.forEach(function (value, valuePath) {
    recursiveSet(props, valuePath, value);

    if (valuePath[0] === 'data') {
      props.data = _toConsumableArray(props.data);
    }
  });
};
export var layerEditListener = function layerEditListener(cb) {
  if (!seer.isReady()) {
    return;
  }

  seer.listenFor('deck.gl', cb);
};
export var seerInitListener = function seerInitListener(cb) {
  if (!seer.isReady()) {
    return;
  }

  seer.listenFor('init', cb);
};
export var initLayerInSeer = function initLayerInSeer(layer) {
  if (!seer.isReady() || !layer) {
    return;
  }

  var badges = [layer.constructor.layerName];
  seer.listItem('deck.gl', layer.id, {
    badges: badges,
    links: layer.state && layer.state.model ? ["luma.gl:".concat(layer.state.model.id)] : undefined,
    parent: layer.parent ? layer.parent.id : undefined
  });
};
export var updateLayerInSeer = function updateLayerInSeer(layer) {
  if (!seer.isReady() || seer.throttle("deck.gl:".concat(layer.id), 1e3)) {
    return;
  }

  var data = logPayload(layer);
  seer.multiUpdate('deck.gl', layer.id, data);
};
export var removeLayerInSeer = function removeLayerInSeer(id) {
  if (!seer.isReady() || !id) {
    return;
  }

  seer.deleteItem('deck.gl', id);
};

function logPayload(layer) {
  var data = [{
    path: 'objects.props',
    data: layer.props
  }];
  var badges = [layer.constructor.layerName];

  if (layer.state) {
    if (layer.getAttributeManager()) {
      var attrs = layer.getAttributeManager().getAttributes();
      data.push({
        path: 'objects.attributes',
        data: attrs
      });
    }

    if (layer.state.model) {
      layer.state.model.setProps({
        timerQueryEnabled: true
      });
      var lastFrameTime = layer.state.model.stats.lastFrameTime;

      if (lastFrameTime) {
        badges.push("".concat((lastFrameTime * 1000).toFixed(0), "\u03BCs"));
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