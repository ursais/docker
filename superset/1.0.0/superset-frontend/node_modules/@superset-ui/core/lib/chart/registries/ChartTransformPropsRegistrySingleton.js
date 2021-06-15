"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

class ChartTransformPropsRegistry extends _.Registry {
  constructor() {
    super({
      name: 'ChartTransformProps',
      overwritePolicy: _.OverwritePolicy.WARN
    });
  }

}

const getInstance = (0, _.makeSingleton)(ChartTransformPropsRegistry);
var _default = getInstance;
exports.default = _default;