import isElectron from './is-electron';
const isNode = typeof process === 'object' && String(process) === '[object process]' && !process.browser;
const isBrowser = !isNode || isElectron;
export const isBrowserMainThread = isBrowser && typeof document !== 'undefined';
export default isBrowser;
//# sourceMappingURL=is-browser.js.map