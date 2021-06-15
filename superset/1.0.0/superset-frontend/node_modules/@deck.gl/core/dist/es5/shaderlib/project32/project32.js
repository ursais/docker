"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _project = _interopRequireDefault(require("../project/project"));

var vs = "\nvec4 project_position_to_clipspace(\n  vec3 position, vec2 position64xyLow, vec3 offset, out vec4 commonPosition\n) {\n  vec3 projectedPosition = project_position(position, position64xyLow);\n  commonPosition = vec4(projectedPosition + offset, 1.0);\n  return project_common_position_to_clipspace(commonPosition);\n}\n\nvec4 project_position_to_clipspace(\n  vec3 position, vec2 position64xyLow, vec3 offset\n) {\n  vec4 commonPosition;\n  return project_position_to_clipspace(position, position64xyLow, offset, commonPosition);\n}\n";
var _default = {
  name: 'project32',
  dependencies: [_project.default],
  vs: vs
};
exports.default = _default;
//# sourceMappingURL=project32.js.map