"use strict";

exports.__esModule = true;
exports.default = void 0;

class Plugin {
  constructor() {
    this.config = void 0;
    this.config = {};
  }

  resetConfig() {
    // The child class can set default config
    // by overriding this function.
    this.config = {};
    return this;
  }

  configure(config, replace = false) {
    this.config = replace ? config : { ...this.config,
      ...config
    };
    return this;
  }

  register() {
    return this;
  }

  unregister() {
    return this;
  }

}

exports.default = Plugin;