export default `\
#define SHADER_NAME gpu-aggregation-to-grid-vs-64

attribute vec2 positions;
attribute vec2 positions64xyLow;
attribute vec3 weights;
uniform vec2 windowSize;
uniform vec2 cellSize;
uniform vec2 gridSize;
uniform vec2 uProjectionMatrixFP64[16];
uniform bool projectPoints;

varying vec3 vWeights;

void project_to_pixel(vec2 pos, vec2 pos64xyLow, out vec2 pixelXY64[2]) {

  vec2 result64[4];
  vec2 position64[4];
  position64[0] = vec2(pos.x, pos64xyLow.x);
  position64[1] = vec2(pos.y, pos64xyLow.y);
  position64[2] = vec2(0., 0.);
  position64[3] = vec2(1., 0.);
  mat4_vec4_mul_fp64(uProjectionMatrixFP64, position64,
  result64);

  pixelXY64[0] = div_fp64(result64[0], result64[3]);
  pixelXY64[1] = div_fp64(result64[1], result64[3]);
}

void main(void) {

  vWeights = weights;

  vec2 windowPos = positions;
  vec2 windowPos64xyLow = positions64xyLow;
  if (projectPoints) {
    vec2 projectedXY[2];
    project_position_fp64(windowPos, windowPos64xyLow, projectedXY);
    windowPos.x = projectedXY[0].x;
    windowPos.y = projectedXY[1].x;
    windowPos64xyLow.x = projectedXY[0].y;
    windowPos64xyLow.y = projectedXY[1].y;
  }

  vec2 pixelXY64[2];
  project_to_pixel(windowPos, windowPos64xyLow, pixelXY64);

  // Transform (0,0):windowSize -> (0, 0): gridSize
  vec2 gridXY64[2];
  gridXY64[0] = div_fp64(pixelXY64[0], vec2(cellSize.x, 0));
  gridXY64[1] = div_fp64(pixelXY64[1], vec2(cellSize.y, 0));
  float x = floor(gridXY64[0].x);
  float y = floor(gridXY64[1].x);
  vec2 pos = vec2(x, y);

  // Transform (0,0):gridSize -> (-1, -1):(1,1)
  pos = (pos * (2., 2.) / (gridSize)) - (1., 1.);

  // Move to pixel center, pixel-size in screen sapce (2/gridSize) * 0.5 => 1/gridSize
  vec2 offset = 1.0 / gridSize;
  pos = pos + offset;

  gl_Position = vec4(pos, 0.0, 1.0);
}
`;
//# sourceMappingURL=aggregate-to-grid-vs-64.glsl.js.map