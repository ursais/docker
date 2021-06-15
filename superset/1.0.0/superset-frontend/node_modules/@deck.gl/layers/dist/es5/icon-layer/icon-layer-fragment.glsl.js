"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME icon-layer-fragment-shader\n\nprecision highp float;\n\nuniform float opacity;\nuniform sampler2D iconsTexture;\n\nvarying float vColorMode;\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\n\nconst float MIN_ALPHA = 0.05;\n\nvoid main(void) {\n  vec4 texColor = texture2D(iconsTexture, vTextureCoords);\n  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);\n  float a = texColor.a * opacity * vColor.a;\n\n  if (a < MIN_ALPHA) {\n    discard;\n  }\n\n  gl_FragColor = vec4(color, a);\n  gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n  gl_FragColor = picking_filterPickingColor(gl_FragColor);\n}\n";
exports.default = _default;
//# sourceMappingURL=icon-layer-fragment.glsl.js.map