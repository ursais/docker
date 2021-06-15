"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME path-layer-fragment-shader\n\nprecision highp float;\n\nuniform float jointType;\nuniform float miterLimit;\nuniform float alignMode;\n\nvarying vec4 vColor;\nvarying vec2 vCornerOffset;\nvarying float vMiterLength;\nvarying vec2 vDashArray;\nvarying vec2 vPathPosition;\nvarying float vPathLength;\nfloat mod2(float a, float b) {\n  return a - floor(a / b) * b;\n}\n\nfloat round(float x) {\n  return floor(x + 0.5);\n}\nbool dash_isFragInGap() {\n  float solidLength = vDashArray.x;\n  float gapLength = vDashArray.y;\n\n  float unitLength = solidLength + gapLength;\n\n  if (unitLength == 0.0) {\n    return false;\n  }\n\n  unitLength = mix(\n    unitLength,\n    vPathLength / round(vPathLength / unitLength),\n    alignMode\n  );\n\n  float offset = alignMode * solidLength / 2.0;\n\n  return gapLength > 0.0 &&\n    vPathPosition.y >= 0.0 &&\n    vPathPosition.y <= vPathLength &&\n    mod2(vPathPosition.y + offset, unitLength) > solidLength;\n}\n\nvoid main(void) {\n  if (jointType > 0.0 && vMiterLength > 0.0 && length(vCornerOffset) > 1.0) {\n    discard;\n  }\n  if (jointType == 0.0 && vMiterLength > miterLimit) {\n    discard;\n  }\n  if (vColor.a == 0.0 || dash_isFragInGap()) {\n    discard;\n  }\n  gl_FragColor = vColor;\n  gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n  gl_FragColor = picking_filterPickingColor(gl_FragColor);\n}\n";
exports.default = _default;
//# sourceMappingURL=path-layer-fragment.glsl.js.map