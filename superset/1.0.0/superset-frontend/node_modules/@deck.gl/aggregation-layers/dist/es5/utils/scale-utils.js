"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearScale = linearScale;
exports.quantizeScale = quantizeScale;
exports.getQuantizeScale = getQuantizeScale;
exports.getLinearScale = getLinearScale;

var _core = require("@deck.gl/core");

function linearScale(domain, range, value) {
  return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
}

function quantizeScale(domain, range, value) {
  var domainRange = domain[1] - domain[0];

  if (domainRange <= 0) {
    _core.log.warn('quantizeScale: invalid domain, returning range[0]')();

    return range[0];
  }

  var step = domainRange / range.length;
  var idx = Math.floor((value - domain[0]) / step);
  var clampIdx = Math.max(Math.min(idx, range.length - 1), 0);
  return range[clampIdx];
}

function getQuantizeScale(domain, range) {
  return function (value) {
    return quantizeScale(domain, range, value);
  };
}

function getLinearScale(domain, range) {
  return function (value) {
    return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
  };
}
//# sourceMappingURL=scale-utils.js.map