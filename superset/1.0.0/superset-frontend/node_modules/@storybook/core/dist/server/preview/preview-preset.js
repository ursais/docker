"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  webpack: true,
  entries: true
};
exports.entries = exports.webpack = void 0;

var _iframeWebpack = _interopRequireDefault(require("./iframe-webpack.config"));

var _entries = require("./entries");

var _commonPreset = require("../common/common-preset");

Object.keys(_commonPreset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _commonPreset[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _commonPreset[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = async function (_, options) {
  return (0, _iframeWebpack.default)(options);
};

exports.webpack = webpack;

var entries = async function (_, options) {
  var result = [];
  result = result.concat(await (0, _entries.createPreviewEntry)(options));

  if (options.configType === 'DEVELOPMENT') {
    // Suppress informational messages when --quiet is specified. webpack-hot-middleware's quiet
    // parameter would also suppress warnings.
    result = result.concat(`${require.resolve('webpack-hot-middleware/client')}?reload=true&quiet=false&noInfo=${options.quiet}`);
  }

  return result;
};

exports.entries = entries;