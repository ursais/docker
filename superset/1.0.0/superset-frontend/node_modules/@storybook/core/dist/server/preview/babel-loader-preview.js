"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBabelLoader = void 0;

var _utils = require("../config/utils");

var _useBaseTsSupport = require("../config/useBaseTsSupport");

var createBabelLoader = function (options, framework) {
  return {
    test: (0, _useBaseTsSupport.useBaseTsSupport)(framework) ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
    use: [{
      loader: require.resolve('babel-loader'),
      options: options
    }],
    include: _utils.includePaths,
    exclude: /node_modules/
  };
};

exports.createBabelLoader = createBabelLoader;