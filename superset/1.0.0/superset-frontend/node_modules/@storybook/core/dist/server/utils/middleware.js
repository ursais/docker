"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMiddleware = getMiddleware;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMiddleware(configDir) {
  var middlewarePath = _path.default.resolve(configDir, 'middleware.js');

  if (_fs.default.existsSync(middlewarePath)) {
    var middlewareModule = require(middlewarePath); // eslint-disable-line


    if (middlewareModule.__esModule) {
      // eslint-disable-line
      middlewareModule = middlewareModule.default;
    }

    return middlewareModule;
  }

  return function () {};
}