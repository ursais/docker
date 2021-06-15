import seer from 'seer';
import { window } from '../utils';
var models = {};
export var addModel = function addModel(model) {
  if (models[model.id]) {
    return;
  }

  models[model.id] = model;
  seer.listItem('luma.gl', model.id);
};
export var logModel = function logModel(model, uniforms) {
  if (!seer.isReady() || seer.throttle("luma.gl:".concat(model.id), 1e3)) {
    return;
  }

  var attributesObject = model.geometry ? Object.assign({}, model.geometry.attributes, model.attributes) : model.attributes;
  var uniformsObject = Object.assign({}, model.uniforms, uniforms);
  seer.multiUpdate('luma.gl', model.id, [{
    path: 'objects.uniforms',
    data: uniformsObject
  }, {
    path: 'objects.attributes',
    data: attributesObject
  }]);
};
export var removeModel = function removeModel(id) {
  delete models[id];
  seer.deleteItem('luma.gl', id);
};

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
export var setOverride = function setOverride(id, valuePath, value) {
  if (!window.__SEER_INITIALIZED__) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  var uniforms = overrides.get(id);
  uniforms.set(valuePath, value);
};
export var getOverrides = function getOverrides(id, uniforms) {
  if (!window.__SEER_INITIALIZED__ || !id) {
    return;
  }

  var overs = overrides.get(id);

  if (!overs) {
    return;
  }

  overs.forEach(function (value, valuePath) {
    recursiveSet(uniforms, valuePath, value);
  });
};
seer.listenFor('luma.gl', function (payload) {
  var model = models[payload.itemKey];

  if (!model || payload.type !== 'edit' || payload.valuePath[0] !== 'uniforms') {
    return;
  }

  var valuePath = payload.valuePath.slice(1);
  setOverride(payload.itemKey, valuePath, payload.value);
  var uniforms = model.getUniforms();
  recursiveSet(uniforms, valuePath, payload.value);
  model.setUniforms(uniforms);
});
//# sourceMappingURL=seer-integration.js.map