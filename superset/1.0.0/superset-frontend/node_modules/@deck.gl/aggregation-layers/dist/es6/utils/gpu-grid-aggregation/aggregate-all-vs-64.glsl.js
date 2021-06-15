export default `\
#version 300 es
#define SHADER_NAME gpu-aggregation-all-vs-64

in vec2 position;
uniform ivec2 gridSize;
out vec2 vTextureCoord;

void main(void) {
  // Map each position to single pixel
  vec2 pos = vec2(-1.0, -1.0);

  // Move to pixel center, pixel-size in screen sapce (2/gridSize) * 0.5 => 1/gridSize
  vec2 offset = 1.0 / vec2(gridSize);
  pos = pos + offset;

  gl_Position = vec4(pos, 0.0, 1.0);

  int yIndex = gl_InstanceID / gridSize[0];
  int xIndex = gl_InstanceID - (yIndex * gridSize[0]);

  vec2 yIndexFP64 = vec2(float(yIndex), 0.);
  vec2 xIndexFP64 = vec2(float(xIndex), 0.);
  vec2 gridSizeYFP64 = vec2(gridSize[1], 0.);
  vec2 gridSizeXFP64 = vec2(gridSize[0], 0.);

  vec2 texCoordXFP64 = div_fp64(yIndexFP64, gridSizeYFP64);
  vec2 texCoordYFP64 = div_fp64(xIndexFP64, gridSizeXFP64);

  vTextureCoord = vec2(texCoordYFP64.x, texCoordXFP64.x);
}
`;
//# sourceMappingURL=aggregate-all-vs-64.glsl.js.map