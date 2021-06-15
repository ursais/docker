"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverrides = exports.setOverride = exports.removeModel = exports.logModel = exports.addModel = void 0;

var _seer = _interopRequireDefault(require("seer"));

var _utils = require("../utils");

var models = {};

var addModel = function addModel(model) {
  if (models[model.id]) {
    return;
  }

  models[model.id] = model;

  _seer["default"].listItem('luma.gl', model.id);
};

exports.addModel = addModel;

var logModel = function logModel(model, uniforms) {
  if (!_seer["default"].isReady() || _seer["default"].throttle("luma.gl:".concat(model.id), 1e3)) {
    return;
  }

  var attributesObject = model.geometry ? Object.assign({}, model.geometry.attributes, model.attributes) : model.attributes;
  var uniformsObject = Object.assign({}, model.uniforms, uniforms);

  _seer["default"].multiUpdate('luma.gl', model.id, [{
    path: 'objects.uniforms',
    data: uniformsObject
  }, {
    path: 'objects.attributes',
    data: attributesObject
  }]);
};

exports.logModel = logModel;

var removeModel = function removeModel(id) {
  delete models[id];

  _seer["default"].deleteItem('luma.gl', id);
};

exports.removeModel = removeModel;

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

var setOverride = function setOverride(id, valuePath, value) {
  if (!_utils.window.__SEER_INITIALIZED__) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  var uniforms = overrides.get(id);
  uniforms.set(valuePath, value);
};

exports.setOverride = setOverride;

var getOverrides = function getOverrides(id, uniforms) {
  if (!_utils.window.__SEER_INITIALIZED__ || !id) {
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

exports.getOverrides = getOverrides;

_seer["default"].listenFor('luma.gl', function (payload) {
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