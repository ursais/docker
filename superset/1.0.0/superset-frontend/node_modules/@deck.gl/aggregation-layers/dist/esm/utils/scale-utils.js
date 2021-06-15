import { log } from '@deck.gl/core';
export function linearScale(domain, range, value) {
  return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
}
export function quantizeScale(domain, range, value) {
  var domainRange = domain[1] - domain[0];

  if (domainRange <= 0) {
    log.warn('quantizeScale: invalid domain, returning range[0]')();
    return range[0];
  }

  var step = domainRange / range.length;
  var idx = Math.floor((value - domain[0]) / step);
  var clampIdx = Math.max(Math.min(idx, range.length - 1), 0);
  return range[clampIdx];
}
export function getQuantizeScale(domain, range) {
  return function (value) {
    return quantizeScale(domain, range, value);
  };
}
export function getLinearScale(domain, range) {
  return function (value) {
    return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
  };
}
//# sourceMappingURL=scale-utils.js.map