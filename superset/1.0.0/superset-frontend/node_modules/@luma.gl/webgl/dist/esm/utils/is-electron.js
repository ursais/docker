import _typeof from "@babel/runtime/helpers/esm/typeof";

function isElectron() {
  if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  }

  if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && Boolean(process.versions.electron)) {
    return true;
  }

  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

export default isElectron();
//# sourceMappingURL=is-electron.js.map