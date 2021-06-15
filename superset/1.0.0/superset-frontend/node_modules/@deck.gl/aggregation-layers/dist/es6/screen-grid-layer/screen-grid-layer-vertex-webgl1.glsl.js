export default `\
#define SHADER_NAME screen-grid-layer-vertex-shader-webgl1
#define RANGE_COUNT 6

attribute vec3 positions;
attribute vec3 instancePositions;
attribute vec4 instanceCounts;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform vec3 cellScale;
uniform vec4 minColor;
uniform vec4 maxColor;
uniform float maxWeight;
uniform vec4 colorRange[RANGE_COUNT];
uniform vec2 colorDomain;
uniform bool shouldUseMinMax;

varying vec4 vColor;
varying float vSampleCount;

vec4 quantizeScale(vec2 domain, vec4 range[RANGE_COUNT], float value) {
  vec4 outColor = vec4(0., 0., 0., 0.);
  if (value >= domain.x && value <= domain.y) {
    float domainRange = domain.y - domain.x;
    if (domainRange <= 0.) {
      outColor = colorRange[0];
    } else {
      float rangeCount = float(RANGE_COUNT);
      float rangeStep = domainRange / rangeCount;
      float idx = floor((value - domain.x) / rangeStep);
      idx = clamp(idx, 0., rangeCount - 1.);
      int intIdx = int(idx);
      outColor = colorRange[intIdx];
    }
  }
  outColor = outColor / 255.;
  return outColor;
}

void main(void) {
  vSampleCount = instanceCounts.a;

  float weight = instanceCounts.r;
  float step = weight / maxWeight;
  vec4 minMaxColor = mix(minColor, maxColor, step) / 255.;

  vec2 domain = colorDomain;
  float domainMaxValid = float(colorDomain.y != 0.);
  domain.y = mix(maxWeight, colorDomain.y, domainMaxValid);
  vec4 rangeColor = quantizeScale(domain, colorRange, weight);

  float rangeMinMax = float(shouldUseMinMax);
  vec4 color = mix(rangeColor, minMaxColor, rangeMinMax);
  vColor = vec4(color.rgb, color.a * opacity);

  // Set color to be rendered to picking fbo (also used to check for selection highlight).
  picking_setPickingColor(instancePickingColors);

  gl_Position = vec4(instancePositions + positions * cellScale, 1.);
}
`;
//# sourceMappingURL=screen-grid-layer-vertex-webgl1.glsl.js.map