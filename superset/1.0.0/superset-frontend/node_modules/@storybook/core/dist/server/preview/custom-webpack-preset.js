"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpack = webpack;

var _nodeLogger = require("@storybook/node-logger");

var _loadCustomWebpackConfig = _interopRequireDefault(require("../utils/load-custom-webpack-config"));

var _baseWebpack = require("./base-webpack.config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createFinalDefaultConfig(presets, config, options) {
  var defaultConfig = await (0, _baseWebpack.createDefaultWebpackConfig)(config, options);
  return presets.apply('webpackFinal', defaultConfig, options);
}

async function webpack(config, options) {
  var configDir = options.configDir,
      configType = options.configType,
      presets = options.presets,
      webpackConfig = options.webpackConfig;
  var finalDefaultConfig = await createFinalDefaultConfig(presets, config, options); // through standalone webpackConfig option

  if (webpackConfig) {
    return webpackConfig(finalDefaultConfig);
  } // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.


  var customConfig = (0, _loadCustomWebpackConfig.default)(configDir);

  if (typeof customConfig === 'function') {
    _nodeLogger.logger.info('=> Loading custom Webpack config (full-control mode).');

    return customConfig({
      config: finalDefaultConfig,
      mode: configType
    });
  }

  _nodeLogger.logger.info('=> Using default Webpack setup');

  return finalDefaultConfig;
}