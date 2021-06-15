"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ = require("../..");

class ChartControlPanelRegistry extends _.Registry {
  constructor() {
    super({
      name: 'ChartControlPanel'
    });
  }

}

const getInstance = (0, _.makeSingleton)(ChartControlPanelRegistry);
var _default = getInstance;
exports.default = _default;