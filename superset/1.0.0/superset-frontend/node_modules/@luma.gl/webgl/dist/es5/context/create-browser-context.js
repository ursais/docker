"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBrowserContext = createBrowserContext;

function createBrowserContext(canvas, options) {
  var _options$onError = options.onError,
      onError = _options$onError === void 0 ? function (message) {
    return null;
  } : _options$onError;

  var onCreateError = function onCreateError(error) {
    return onError("WebGL context: ".concat(error.statusMessage || 'error'));
  };

  canvas.addEventListener('webglcontextcreationerror', onCreateError, false);
  var _options$webgl = options.webgl1,
      webgl1 = _options$webgl === void 0 ? true : _options$webgl,
      _options$webgl2 = options.webgl2,
      webgl2 = _options$webgl2 === void 0 ? true : _options$webgl2;
  var gl = null;

  if (webgl2) {
    gl = gl || canvas.getContext('webgl2', options);
    gl = gl || canvas.getContext('experimental-webgl2', options);
  }

  if (webgl1) {
    gl = gl || canvas.getContext('webgl', options);
    gl = gl || canvas.getContext('experimental-webgl', options);
  }

  canvas.removeEventListener('webglcontextcreationerror', onCreateError, false);

  if (!gl) {
    return onError("Failed to create ".concat(webgl2 && !webgl1 ? 'WebGL2' : 'WebGL', " context"));
  }

  return gl;
}
//# sourceMappingURL=create-browser-context.js.map