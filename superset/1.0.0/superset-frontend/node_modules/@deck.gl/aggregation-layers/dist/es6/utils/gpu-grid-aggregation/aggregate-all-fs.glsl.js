export default `\
#version 300 es
#define SHADER_NAME gpu-aggregation-all-fs

precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform bool combineMaxMin;
out vec4 fragColor;
void main(void) {
  vec4 textureColor = texture(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  if (textureColor.a == 0.) {
    discard;
  }
  fragColor.rgb = textureColor.rgb;
  // if combineMinMax is true, use Alpha channel for first weights min value.
  fragColor.a = combineMaxMin ? textureColor.r : textureColor.a;
}
`;
//# sourceMappingURL=aggregate-all-fs.glsl.js.map