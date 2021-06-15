import _typeof from "@babel/runtime/helpers/esm/typeof";
export var isBrowser = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== 'object' || String(process) !== '[object process]' || process.browser;
var window_ = typeof window !== 'undefined' ? window : global;
var global_ = typeof global !== 'undefined' ? global : window;
var document_ = typeof document !== 'undefined' ? document : {};
export { window_ as window, global_ as global, document_ as document };
//# sourceMappingURL=globals.js.map