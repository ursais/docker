"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

class ChartComponentRegistry extends _.Registry {
  constructor() {
    super({
      name: 'ChartComponent',
      overwritePolicy: _.OverwritePolicy.WARN
    });
  }

}

const getInstance = (0, _.makeSingleton)(ChartComponentRegistry);
var _default = getInstance;
exports.default = _default;