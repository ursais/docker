export default `\
#define SHADER_NAME multi-icon-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec2 instancePositions64xyLow;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;

// the following three attributes are for the multi-icon layer
attribute vec2 instancePixelOffset;

uniform float sizeScale;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform vec2 iconsTextureDim;
uniform float gamma;
uniform float opacity;
uniform bool billboard;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying float vGamma;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  vec2 iconSize = instanceIconFrames.zw;
 
  // project meters to pixels and clamp to limits 
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale),
    sizeMinPixels, sizeMaxPixels
  );

  // scale icon height to match instanceSize
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;

  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace
  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;

  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
  pixelOffset += instancePixelOffset;
  
  if (billboard)  {
    pixelOffset.y *= -1.0;
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, vec3(0.0)); 
    gl_Position.xy += project_pixel_size_to_clipspace(pixelOffset);

  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xyLow, offset_common); 
  }

  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;

  vTextureCoords.y = 1.0 - vTextureCoords.y;

  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;
  picking_setPickingColor(instancePickingColors);

  vGamma = gamma / (sizeScale * iconSize.y);
}
`;
//# sourceMappingURL=multi-icon-layer-vertex.glsl.js.map