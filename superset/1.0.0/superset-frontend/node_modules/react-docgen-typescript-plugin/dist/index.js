"use strict";
/* eslint-disable  */
Object.defineProperty(exports, "__esModule", { value: true });
class EmptyPlugin {
    constructor(_) { }
    apply() { }
}
let plugin;
try {
    require.resolve("typescript");
    plugin = require('./plugin').default;
}
catch (error) {
    plugin = EmptyPlugin;
}
exports.default = plugin;
//# sourceMappingURL=index.js.map