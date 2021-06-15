"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasDocgen = hasDocgen;
exports.isValidDocgenSection = isValidDocgenSection;
exports.getDocgenSection = getDocgenSection;
exports.getDocgenDescription = getDocgenDescription;

var _string = require("./string");

/* eslint-disable no-underscore-dangle */
function hasDocgen(component) {
  return !!component.__docgenInfo;
}

function isValidDocgenSection(docgenSection) {
  return docgenSection != null && Object.keys(docgenSection).length > 0;
}

function getDocgenSection(component, section) {
  return hasDocgen(component) ? component.__docgenInfo[section] : null;
}

function getDocgenDescription(component) {
  return hasDocgen(component) && (0, _string.str)(component.__docgenInfo.description);
}