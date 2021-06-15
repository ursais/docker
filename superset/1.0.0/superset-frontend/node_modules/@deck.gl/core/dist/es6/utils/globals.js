export const isBrowser = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const window_ = typeof window !== 'undefined' ? window : global;
const global_ = typeof global !== 'undefined' ? global : window;
const document_ = typeof document !== 'undefined' ? document : {};
export { window_ as window, global_ as global, document_ as document };
//# sourceMappingURL=globals.js.map