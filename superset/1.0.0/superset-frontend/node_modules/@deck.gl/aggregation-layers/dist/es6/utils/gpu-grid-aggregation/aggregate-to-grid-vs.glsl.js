export default `\
#define SHADER_NAME gpu-aggregation-to-grid-vs

attribute vec2 positions;
attribute vec3 weights;
uniform vec2 windowSize;
uniform vec2 cellSize;
uniform vec2 gridSize;
uniform mat4 uProjectionMatrix;
uniform bool projectPoints;

varying vec3 vWeights;

vec2 project_to_pixel(vec4 pos) {
  vec4 result =  uProjectionMatrix * pos;
  return result.xy/result.w;
}

void main(void) {

  vWeights = weights;

  vec4 windowPos = vec4(positions, 0, 1.);
  if (projectPoints) {
    windowPos = project_position_to_clipspace(vec3(positions, 0), vec2(0, 0), vec3(0, 0, 0));
  }

  vec2 pos = project_to_pixel(windowPos);

  // Transform (0,0):windowSize -> (0, 0): gridSize
  pos = floor(pos / cellSize);

  // Transform (0,0):gridSize -> (-1, -1):(1,1)
  pos = (pos * (2., 2.) / (gridSize)) - (1., 1.);

  // Move to pixel center, pixel-size in screen sapce (2/gridSize) * 0.5 => 1/gridSize
  vec2 offset = 1.0 / gridSize;
  pos = pos + offset;

  gl_Position = vec4(pos, 0.0, 1.0);
}
`;
//# sourceMappingURL=aggregate-to-grid-vs.glsl.js.map