export default `\
#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

void main(void) {

  float distToCenter = length(unitPosition);

  if (distToCenter > 1.0) {
    discard;
  } 
  if (distToCenter > innerUnitRadius) {
    gl_FragColor = vLineColor;
  } else if (filled) {
    gl_FragColor = vFillColor;
  } else {
    discard;
  }

  // use highlight color if this fragment belongs to the selected object.
  gl_FragColor = picking_filterHighlightColor(gl_FragColor);

  // use picking color if rendering to picking FBO.
  gl_FragColor = picking_filterPickingColor(gl_FragColor);
}
`;
//# sourceMappingURL=scatterplot-layer-fragment.glsl.js.map