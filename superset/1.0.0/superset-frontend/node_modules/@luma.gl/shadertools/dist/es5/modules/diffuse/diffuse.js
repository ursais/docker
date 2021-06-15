"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var DEFAULT_MODULE_OPTIONS = {
  diffuseTexture: null,
  diffuseColor: [0.5, 0.5, 0.5, 1]
};

function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_MODULE_OPTIONS;
  var uniforms = {};

  if (opts.diffuseTexture !== undefined) {
    uniforms.diffuse_uHasTexture = Boolean(opts.diffuseTexture);
    uniforms.diffuse_uTexture = opts.diffuseTexture;
  }

  if (opts.diffuseColor !== undefined) {
    uniforms.diffuse_uColor = opts.diffuseColor;
  }

  return uniforms;
}

var vs = "out vec2 diffuse_vTexCoord;\nvoid diffuse_setTextureCoordinate(vec2 uv) {\n  diffuse_vTexCoord = uv;\n}\n";
var fs = "uniform vec4 diffuse_uColor;\nuniform bool diffuse_uHasTexture;\nuniform sampler2D diffuse_uTexture;\n\nin vec2 diffuse_vTexCoord;\n\n\n\nvec4 diffuse_getColor() {\n  vec2 texCoord = diffuse_vTexCoord;\n  return diffuse_uHasTexture ?\n    texture2D(diffuse_uTexture, vec2(texCoord.s, texCoord.t)) :\n    diffuse_uColor;\n}\n\nvec4 diffuse_filterColor(vec4 color) {\n  return diffuse_getColor();\n}\n";
var _default = {
  name: 'diffuse',
  getUniforms: getUniforms,
  vs: vs,
  fs: fs
};
exports["default"] = _default;
//# sourceMappingURL=diffuse.js.map