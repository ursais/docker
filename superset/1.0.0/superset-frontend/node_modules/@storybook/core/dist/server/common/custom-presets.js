"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadCustomPresets;

var _path = _interopRequireDefault(require("path"));

var _serverRequire = require("../utils/server-require");

var _validateConfigurationFiles = _interopRequireDefault(require("../utils/validate-configuration-files"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCustomPresets({
  configDir: configDir
}) {
  (0, _validateConfigurationFiles.default)(configDir);
  var presets = (0, _serverRequire.serverRequire)(_path.default.resolve(configDir, 'presets'));
  var main = (0, _serverRequire.serverRequire)(_path.default.resolve(configDir, 'main'));

  if (main) {
    return [(0, _serverRequire.serverResolve)(_path.default.resolve(configDir, 'main'))];
  }

  return presets || [];
}