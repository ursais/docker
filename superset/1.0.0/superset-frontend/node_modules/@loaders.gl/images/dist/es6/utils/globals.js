const isBrowser = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global
};
const global_ = globals.global || globals.self || globals.window;
export { isBrowser, global_ as global };
//# sourceMappingURL=globals.js.map