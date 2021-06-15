"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME point-cloud-layer-vertex-shader\n\nattribute vec3 positions;\nattribute vec3 instanceNormals;\nattribute vec4 instanceColors;\nattribute vec3 instancePositions;\nattribute vec2 instancePositions64xyLow;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusPixels;\n\nvarying vec4 vColor;\nvarying vec2 unitPosition;\n\nvoid main(void) {\n  unitPosition = positions.xy;\n  vec4 position_commonspace;\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, vec3(0.), position_commonspace);\n  gl_Position.xy += project_pixel_size_to_clipspace(positions.xy * radiusPixels);\n  vec3 lightColor = lighting_getLightColor(instanceColors.rgb, project_uCameraPosition, position_commonspace.xyz, project_normal(instanceNormals));\n  vColor = vec4(lightColor, instanceColors.a * opacity) / 255.0;\n  picking_setPickingColor(instancePickingColors);\n}\n";
exports.default = _default;
//# sourceMappingURL=point-cloud-layer-vertex.glsl.js.map