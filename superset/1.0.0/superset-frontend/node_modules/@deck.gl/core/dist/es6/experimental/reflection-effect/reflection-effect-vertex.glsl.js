export default `\
#define SHADER_NAME reflection-effect-vs

attribute vec3 vertices;

varying vec2 uv;

void main(void) {
  uv = vertices.xy;
  gl_Position = vec4(2. * vertices.xy - vec2(1., 1.), 1., 1.);
}
`;
//# sourceMappingURL=reflection-effect-vertex.glsl.js.map