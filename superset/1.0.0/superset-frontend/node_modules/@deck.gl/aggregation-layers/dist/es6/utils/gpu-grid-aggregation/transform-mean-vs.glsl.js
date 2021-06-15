export default `\
#define SHADER_NAME gpu-aggregation-transform-mean-vs
attribute vec4 aggregationValues;
varying vec4 meanValues;

void main()
{
  // TODO: Use 64-bit division ?? not needed given this is aggregation ??
  bool isCellValid = bool(aggregationValues.w > 0.);
  // aggregationValues:  XYZ contain aggregated values, W contains count
  meanValues.xyz = isCellValid ? aggregationValues.xyz/aggregationValues.w : vec3(0, 0, 0);
  meanValues.w = aggregationValues.w;
}
`;
//# sourceMappingURL=transform-mean-vs.glsl.js.map