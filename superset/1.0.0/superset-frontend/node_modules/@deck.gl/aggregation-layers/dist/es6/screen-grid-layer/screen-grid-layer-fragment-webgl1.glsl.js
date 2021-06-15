export default `\
#define SHADER_NAME screen-grid-layer-fragment-shader-webgl1

precision highp float;

varying vec4 vColor;
varying float vSampleCount;

void main(void) {
  if (vSampleCount <= 0.0) {
    discard;
  }
  gl_FragColor = vColor;

  gl_FragColor = picking_filterColor(gl_FragColor);
}
`;
//# sourceMappingURL=screen-grid-layer-fragment-webgl1.glsl.js.map