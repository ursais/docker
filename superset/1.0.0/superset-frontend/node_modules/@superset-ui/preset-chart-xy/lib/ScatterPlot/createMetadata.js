"use strict";

exports.__esModule = true;
exports.default = createMetadata;

var _core = require("@superset-ui/core");

var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMetadata(useLegacyApi = false) {
  return new _core.ChartMetadata({
    description: '',
    name: (0, _core.t)('Scatter Plot'),
    thumbnail: _thumbnail.default,
    useLegacyApi
  });
}