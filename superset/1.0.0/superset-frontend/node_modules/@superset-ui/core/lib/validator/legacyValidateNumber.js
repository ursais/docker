"use strict";

exports.__esModule = true;
exports.default = numeric;

var _translation = require("../translation");

/**
 * formerly called numeric()
 * @param v
 */
function numeric(v) {
  if (v && Number.isNaN(Number(v))) {
    return (0, _translation.t)('is expected to be a number');
  }

  return false;
}