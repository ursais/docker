"use strict";

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createType = createType;

var _utils = require("../../utils");

function createType(_ref) {
  var tsType = _ref.tsType,
      required = _ref.required;

  // A type could be null if a defaultProp has been provided without a type definition.
  if (tsType == null) {
    return null;
  }

  if (!required) {
    return (0, _utils.createSummaryValue)(tsType.name.replace(' | undefined', ''));
  }

  return (0, _utils.createSummaryValue)(tsType.name);
}