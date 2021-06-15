export default `\
#version 300 es
#define SHADER_NAME screen-grid-layer-fragment-shader

precision highp float;

in vec4 vColor;
in float vSampleCount;
out vec4 fragColor;

void main(void) {
  if (vSampleCount <= 0.0) {
    discard;
  }
  fragColor = vColor;

  fragColor = picking_filterColor(fragColor);
}
`;
//# sourceMappingURL=screen-grid-layer-fragment.glsl.js.map