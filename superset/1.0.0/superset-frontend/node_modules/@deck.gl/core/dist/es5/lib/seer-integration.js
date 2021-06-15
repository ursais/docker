"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLayerInSeer = exports.updateLayerInSeer = exports.initLayerInSeer = exports.seerInitListener = exports.layerEditListener = exports.applyPropOverrides = exports.setPropOverrides = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _seer = _interopRequireDefault(require("seer"));

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

var setPropOverrides = function setPropOverrides(id, valuePath, value) {
  if (!_seer.default.isReady()) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  var props = overrides.get(id);
  props.set(valuePath, value);
};

exports.setPropOverrides = setPropOverrides;

var applyPropOverrides = function applyPropOverrides(props) {
  if (!_seer.default.isReady() || !props.id) {
    return;
  }

  var overs = overrides.get(props.id);

  if (!overs) {
    return;
  }

  overs.forEach(function (value, valuePath) {
    recursiveSet(props, valuePath, value);

    if (valuePath[0] === 'data') {
      props.data = (0, _toConsumableArray2.default)(props.data);
    }
  });
};

exports.applyPropOverrides = applyPropOverrides;

var layerEditListener = function layerEditListener(cb) {
  if (!_seer.default.isReady()) {
    return;
  }

  _seer.default.listenFor('deck.gl', cb);
};

exports.layerEditListener = layerEditListener;

var seerInitListener = function seerInitListener(cb) {
  if (!_seer.default.isReady()) {
    return;
  }

  _seer.default.listenFor('init', cb);
};

exports.seerInitListener = seerInitListener;

var initLayerInSeer = function initLayerInSeer(layer) {
  if (!_seer.default.isReady() || !layer) {
    return;
  }

  var badges = [layer.constructor.layerName];

  _seer.default.listItem('deck.gl', layer.id, {
    badges: badges,
    links: layer.state && layer.state.model ? ["luma.gl:".concat(layer.state.model.id)] : undefined,
    parent: layer.parent ? layer.parent.id : undefined
  });
};

exports.initLayerInSeer = initLayerInSeer;

var updateLayerInSeer = function updateLayerInSeer(layer) {
  if (!_seer.default.isReady() || _seer.default.throttle("deck.gl:".concat(layer.id), 1e3)) {
    return;
  }

  var data = logPayload(layer);

  _seer.default.multiUpdate('deck.gl', layer.id, data);
};

exports.updateLayerInSeer = updateLayerInSeer;

var removeLayerInSeer = function removeLayerInSeer(id) {
  if (!_seer.default.isReady() || !id) {
    return;
  }

  _seer.default.deleteItem('deck.gl', id);
};

exports.removeLayerInSeer = removeLayerInSeer;

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