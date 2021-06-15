"use strict";

exports.__esModule = true;
exports.configure = configure;
exports.addTranslation = addTranslation;
exports.addTranslations = addTranslations;
exports.addLocaleData = addLocaleData;
exports.t = t;
exports.tn = tn;

var _Translator = _interopRequireDefault(require("./Translator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console: 0 */
let singleton;
let isConfigured = false;

function configure(config) {
  singleton = new _Translator.default(config);
  isConfigured = true;
  return singleton;
}

function getInstance() {
  if (!isConfigured) {
    console.warn('You should call configure(...) before calling other methods');
  }

  if (typeof singleton === 'undefined') {
    singleton = new _Translator.default();
  }

  return singleton;
}

function addTranslation(key, translations) {
  return getInstance().addTranslation(key, translations);
}

function addTranslations(translations) {
  return getInstance().addTranslations(translations);
}

function addLocaleData(data) {
  return getInstance().addLocaleData(data);
}

function t(input, ...args) {
  return getInstance().translate(input, ...args);
}

function tn(key, ...args) {
  return getInstance().translateWithNumber(key, ...args);
}