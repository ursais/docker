"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#version 300 es\n#define SHADER_NAME screen-grid-layer-fragment-shader\n\nprecision highp float;\n\nin vec4 vColor;\nin float vSampleCount;\nout vec4 fragColor;\n\nvoid main(void) {\n  if (vSampleCount <= 0.0) {\n    discard;\n  }\n  fragColor = vColor;\n\n  fragColor = picking_filterColor(fragColor);\n}\n";
exports.default = _default;
//# sourceMappingURL=screen-grid-layer-fragment.glsl.js.map