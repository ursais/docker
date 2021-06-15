import _typeof from "@babel/runtime/helpers/esm/typeof";
import isElectron from './is-electron';
var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && String(process) === '[object process]' && !process.browser;
var isBrowser = !isNode || isElectron;
export var isBrowserMainThread = isBrowser && typeof document !== 'undefined';
export default isBrowser;
//# sourceMappingURL=is-browser.js.map