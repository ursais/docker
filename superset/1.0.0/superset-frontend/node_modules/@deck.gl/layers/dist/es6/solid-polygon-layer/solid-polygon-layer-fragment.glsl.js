export default `\
#define SHADER_NAME solid-polygon-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying float isValid;

void main(void) {
  if (isValid < 0.5) {
    discard;
  }

  gl_FragColor = vColor;

  // use highlight color if this fragment belongs to the selected object.
  gl_FragColor = picking_filterHighlightColor(gl_FragColor);

  // use picking color if rendering to picking FBO.
  gl_FragColor = picking_filterPickingColor(gl_FragColor);
}
`;
//# sourceMappingURL=solid-polygon-layer-fragment.glsl.js.map