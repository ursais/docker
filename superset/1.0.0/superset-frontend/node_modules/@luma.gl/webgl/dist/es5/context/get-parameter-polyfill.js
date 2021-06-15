"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParameter = getParameter;

var _webglUtils = require("../webgl-utils");

var WEBGL_debug_renderer_info = 'WEBGL_debug_renderer_info';
var EXT_disjoint_timer_query = 'EXT_disjoint_timer_query';
var EXT_disjoint_timer_query_webgl2 = 'EXT_disjoint_timer_query_webgl2';
var EXT_texture_filter_anisotropic = 'EXT_texture_filter_anisotropic';

function getParameter(gl, originalFunc, pname) {
  var GL_UNMASKED_VENDOR_WEBGL = 0x9245;
  var GL_UNMASKED_RENDERER_WEBGL = 0x9246;
  var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff;
  var GL_FRAGMENT_SHADER_DERIVATIVE_HINT = 0x8b8b;
  var GL_DONT_CARE = 0x1100;
  var GL_GPU_DISJOINT_EXT = 0x8fbb;
  var extensions = gl.luma.extensions;
  var info = gl.getExtension(WEBGL_debug_renderer_info);

  switch (pname) {
    case GL_UNMASKED_VENDOR_WEBGL:
      return originalFunc(info && info.UNMASKED_VENDOR_WEBGL || 7936);

    case GL_UNMASKED_RENDERER_WEBGL:
      return originalFunc(info && info.UNMASKED_RENDERER_WEBGL || 7937);

    case GL_FRAGMENT_SHADER_DERIVATIVE_HINT:
      return !(0, _webglUtils.isWebGL2)(gl) ? GL_DONT_CARE : undefined;

    case GL_GPU_DISJOINT_EXT:
      var hasTimerQueries = !extensions[EXT_disjoint_timer_query] && !extensions[EXT_disjoint_timer_query_webgl2];
      return hasTimerQueries ? 0 : undefined;

    case GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT:
      var ext = gl.luma.extensions[EXT_texture_filter_anisotropic];
      pname = ext && ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT;
      return !pname ? 1.0 : undefined;

    default:
      return undefined;
  }
}
//# sourceMappingURL=get-parameter-polyfill.js.map