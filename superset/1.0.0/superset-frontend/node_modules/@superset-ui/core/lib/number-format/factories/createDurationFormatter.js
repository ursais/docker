"use strict";

exports.__esModule = true;
exports.default = createDurationFormatter;

var _prettyMs = _interopRequireDefault(require("pretty-ms"));

var _NumberFormatter = _interopRequireDefault(require("../NumberFormatter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDurationFormatter(config = {}) {
  const {
    description,
    id,
    label,
    multiplier = 1,
    ...prettyMsOptions
  } = config;
  return new _NumberFormatter.default({
    description,
    formatFunc: value => (0, _prettyMs.default)(value * multiplier, prettyMsOptions),
    id: id != null ? id : 'duration_format',
    label: label != null ? label : `Duration formatter`
  });
}