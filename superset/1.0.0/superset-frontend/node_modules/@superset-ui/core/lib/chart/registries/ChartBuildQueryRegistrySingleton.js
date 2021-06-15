"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

class ChartBuildQueryRegistry extends _.Registry {
  constructor() {
    super({
      name: 'ChartBuildQuery',
      overwritePolicy: _.OverwritePolicy.WARN
    });
  }

}

const getInstance = (0, _.makeSingleton)(ChartBuildQueryRegistry);
var _default = getInstance;
exports.default = _default;