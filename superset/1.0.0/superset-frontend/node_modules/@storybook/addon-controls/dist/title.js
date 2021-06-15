"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.object.values");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTitle = getTitle;

var _api = require("@storybook/api");

function getTitle() {
  var rows = (0, _api.useArgTypes)();
  var controlsCount = Object.values(rows).filter(function (argType) {
    return argType === null || argType === void 0 ? void 0 : argType.control;
  }).length;
  var suffix = controlsCount === 0 ? '' : " (".concat(controlsCount, ")");
  return "Controls".concat(suffix);
}