"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

class ChartMetadataRegistry extends _.Registry {
  constructor() {
    super({
      name: 'ChartMetadata',
      overwritePolicy: _.OverwritePolicy.WARN
    });
  }

}

const getInstance = (0, _.makeSingleton)(ChartMetadataRegistry);
var _default = getInstance;
exports.default = _default;