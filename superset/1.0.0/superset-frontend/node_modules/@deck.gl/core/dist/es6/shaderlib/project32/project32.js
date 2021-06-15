import project from '../project/project';
const vs = `
vec4 project_position_to_clipspace(
  vec3 position, vec2 position64xyLow, vec3 offset, out vec4 commonPosition
) {
  vec3 projectedPosition = project_position(position, position64xyLow);
  commonPosition = vec4(projectedPosition + offset, 1.0);
  return project_common_position_to_clipspace(commonPosition);
}

vec4 project_position_to_clipspace(
  vec3 position, vec2 position64xyLow, vec3 offset
) {
  vec4 commonPosition;
  return project_position_to_clipspace(position, position64xyLow, offset, commonPosition);
}
`;
export default {
  name: 'project32',
  dependencies: [project],
  vs
};
//# sourceMappingURL=project32.js.map