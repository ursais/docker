"use strict";

exports.__esModule = true;
exports.default = void 0;

class Preset {
  constructor(config = {}) {
    this.name = void 0;
    this.description = void 0;
    this.presets = void 0;
    this.plugins = void 0;
    const {
      name = '',
      description = '',
      presets = [],
      plugins = []
    } = config;
    this.name = name;
    this.description = description;
    this.presets = presets;
    this.plugins = plugins;
  }

  register() {
    this.presets.forEach(preset => {
      preset.register();
    });
    this.plugins.forEach(plugin => {
      plugin.register();
    });
    return this;
  }

}

exports.default = Preset;