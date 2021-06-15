/* eslint no-console: 0 */
import Translator from './Translator';
let singleton;
let isConfigured = false;

function configure(config) {
  singleton = new Translator(config);
  isConfigured = true;
  return singleton;
}

function getInstance() {
  if (!isConfigured) {
    console.warn('You should call configure(...) before calling other methods');
  }

  if (typeof singleton === 'undefined') {
    singleton = new Translator();
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

export { configure, addTranslation, addTranslations, addLocaleData, t, tn };