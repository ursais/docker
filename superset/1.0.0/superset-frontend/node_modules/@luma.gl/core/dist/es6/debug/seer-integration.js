import seer from 'seer';
import { window } from '../utils';
const models = {};
export const addModel = model => {
  if (models[model.id]) {
    return;
  }

  models[model.id] = model;
  seer.listItem('luma.gl', model.id);
};
export const logModel = (model, uniforms) => {
  if (!seer.isReady() || seer.throttle("luma.gl:".concat(model.id), 1e3)) {
    return;
  }

  const attributesObject = model.geometry ? Object.assign({}, model.geometry.attributes, model.attributes) : model.attributes;
  const uniformsObject = Object.assign({}, model.uniforms, uniforms);
  seer.multiUpdate('luma.gl', model.id, [{
    path: 'objects.uniforms',
    data: uniformsObject
  }, {
    path: 'objects.attributes',
    data: attributesObject
  }]);
};
export const removeModel = id => {
  delete models[id];
  seer.deleteItem('luma.gl', id);
};

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
export const setOverride = (id, valuePath, value) => {
  if (!window.__SEER_INITIALIZED__) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  const uniforms = overrides.get(id);
  uniforms.set(valuePath, value);
};
export const getOverrides = (id, uniforms) => {
  if (!window.__SEER_INITIALIZED__ || !id) {
    return;
  }

  const overs = overrides.get(id);

  if (!overs) {
    return;
  }

  overs.forEach((value, valuePath) => {
    recursiveSet(uniforms, valuePath, value);
  });
};
seer.listenFor('luma.gl', payload => {
  const model = models[payload.itemKey];

  if (!model || payload.type !== 'edit' || payload.valuePath[0] !== 'uniforms') {
    return;
  }

  const valuePath = payload.valuePath.slice(1);
  setOverride(payload.itemKey, valuePath, payload.value);
  const uniforms = model.getUniforms();
  recursiveSet(uniforms, valuePath, payload.value);
  model.setUniforms(uniforms);
});
//# sourceMappingURL=seer-integration.js.map