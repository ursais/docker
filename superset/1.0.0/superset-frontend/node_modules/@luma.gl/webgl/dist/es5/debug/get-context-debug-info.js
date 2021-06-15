"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContextDebugInfo = getContextDebugInfo;

function getContextDebugInfo(gl) {
  var vendorMasked = gl.getParameter(7936);
  var rendererMasked = gl.getParameter(7937);
  var ext = gl.getExtension('WEBGL_debug_renderer_info');
  var vendorUnmasked = ext && gl.getParameter(ext.UNMASKED_VENDOR_WEBGL || 7936);
  var rendererUnmasked = ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL || 7937);
  return {
    vendor: vendorUnmasked || vendorMasked,
    renderer: rendererUnmasked || rendererMasked,
    vendorMasked: vendorMasked,
    rendererMasked: rendererMasked,
    version: gl.getParameter(7938),
    shadingLanguageVersion: gl.getParameter(35724)
  };
}
//# sourceMappingURL=get-context-debug-info.js.map