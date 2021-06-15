"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#version 300 es\n#define SHADER_NAME simple-mesh-layer-vs\nuniform float sizeScale;\nin vec3 positions;\nin vec3 normals;\nin vec2 texCoords;\nin vec3 instancePositions;\nin vec2 instancePositions64xy;\nin vec4 instanceColors;\nin vec3 instancePickingColors;\nin mat3 instanceModelMatrix;\nin vec3 instanceTranslation;\nout vec2 vTexCoord;\nout vec3 cameraPosition;\nout vec3 normals_commonspace;\nout vec4 position_commonspace;\nout vec4 vColor;\n\nvoid main(void) {\n  vec3 pos = (instanceModelMatrix * positions) * sizeScale + instanceTranslation;\n  pos = project_size(pos);\n\n  vTexCoord = texCoords;\n  cameraPosition = project_uCameraPosition;\n  normals_commonspace = project_normal(instanceModelMatrix * normals);\n  vColor = instanceColors;\n\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xy, pos, position_commonspace);\n\n  picking_setPickingColor(instancePickingColors);\n}\n";
exports.default = _default;
//# sourceMappingURL=simple-mesh-layer-vertex.glsl.js.map