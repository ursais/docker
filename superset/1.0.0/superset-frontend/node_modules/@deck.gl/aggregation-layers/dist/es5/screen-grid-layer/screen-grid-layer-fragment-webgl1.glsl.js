"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME screen-grid-layer-fragment-shader-webgl1\n\nprecision highp float;\n\nvarying vec4 vColor;\nvarying float vSampleCount;\n\nvoid main(void) {\n  if (vSampleCount <= 0.0) {\n    discard;\n  }\n  gl_FragColor = vColor;\n\n  gl_FragColor = picking_filterColor(gl_FragColor);\n}\n";
exports.default = _default;
//# sourceMappingURL=screen-grid-layer-fragment-webgl1.glsl.js.map