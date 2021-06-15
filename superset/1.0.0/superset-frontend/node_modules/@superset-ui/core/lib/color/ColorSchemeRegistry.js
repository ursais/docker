"use strict";

exports.__esModule = true;
exports.default = void 0;

var _models = require("../models");

class ColorSchemeRegistry extends _models.RegistryWithDefaultKey {
  constructor() {
    super({
      name: 'ColorScheme',
      overwritePolicy: _models.OverwritePolicy.WARN,
      setFirstItemAsDefault: true
    });
  }

  get(key) {
    return super.get(key);
  }

}

exports.default = ColorSchemeRegistry;