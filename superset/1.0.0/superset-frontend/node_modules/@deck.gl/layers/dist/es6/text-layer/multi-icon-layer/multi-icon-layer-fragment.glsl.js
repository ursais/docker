export default `\
#define SHADER_NAME multi-icon-layer-fragment-shader

precision highp float;

uniform sampler2D iconsTexture;
uniform float buffer;
uniform bool sdf;

varying vec4 vColor;
varying vec2 vTextureCoords;
varying float vGamma;

const float MIN_ALPHA = 0.05;

void main(void) {
  vec4 texColor = texture2D(iconsTexture, vTextureCoords);
  
  float alpha = texColor.a;
  // if enable sdf (signed distance fields)
  if (sdf) {
    float distance = texture2D(iconsTexture, vTextureCoords).a;
    alpha = smoothstep(buffer - vGamma, buffer + vGamma, distance);
  }

  // Take the global opacity and the alpha from vColor into account for the alpha component
  float a = alpha * vColor.a;

  if (a < MIN_ALPHA) {
    discard;
  }

  gl_FragColor = vec4(vColor.rgb, a);

  // use highlight color if this fragment belongs to the selected object.
  gl_FragColor = picking_filterHighlightColor(gl_FragColor);

  // use picking color if rendering to picking FBO.
  gl_FragColor = picking_filterPickingColor(gl_FragColor);
}
`;
//# sourceMappingURL=multi-icon-layer-fragment.glsl.js.map