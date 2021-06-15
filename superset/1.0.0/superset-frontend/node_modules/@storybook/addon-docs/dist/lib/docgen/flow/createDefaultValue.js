"use strict";

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultValue = createDefaultValue;

var _utils = require("../../utils");

var _defaultValue = require("../utils/defaultValue");

function createDefaultValue(defaultValue, type) {
  if (defaultValue != null) {
    var value = defaultValue.value;

    if (!(0, _defaultValue.isDefaultValueBlacklisted)(value)) {
      return !(0, _utils.isTooLongForDefaultValueSummary)(value) ? (0, _utils.createSummaryValue)(value) : (0, _utils.createSummaryValue)(type.name, value);
    }
  }

  return null;
}