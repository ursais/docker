export default `\
#define SHADER_NAME gpu-aggregation-to-grid-fs

precision highp float;

varying vec3 vWeights;

void main(void) {
  gl_FragColor = vec4(vWeights, 1.0);
}
`;
//# sourceMappingURL=aggregate-to-grid-fs.glsl.js.map