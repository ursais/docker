export default `\
#version 300 es
#define SHADER_NAME gpu-grid-cell-layer-fragment-shader

precision highp float;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
  fragColor = vColor;
  fragColor = picking_filterColor(fragColor);
}
`;
//# sourceMappingURL=gpu-grid-cell-layer-fragment.glsl.js.map