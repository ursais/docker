"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logLevel = exports.babel = void 0;

var _loadCustomBabelConfig = _interopRequireDefault(require("../utils/load-custom-babel-config"));

var _babel = require("./babel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babel = async function (_, options) {
  var configDir = options.configDir,
      presets = options.presets;
  return (0, _loadCustomBabelConfig.default)(configDir, function () {
    return presets.apply('babelDefault', (0, _babel.babelConfig)(), options);
  });
};

exports.babel = babel;

var logLevel = function (previous, options) {
  return previous || options.loglevel || 'info';
};

exports.logLevel = logLevel;