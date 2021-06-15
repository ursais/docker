"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _serverRequire = require("./server-require");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpackConfigs = ['webpack.config', 'webpackfile'];

var _default = function _default(configDir) {
  return (0, _serverRequire.serverRequire)(webpackConfigs.map(function (configName) {
    return _path.default.resolve(configDir, configName);
  }));
};

exports.default = _default;