export default function transpileShader(source, targetGLSLVersion, isVertex) {
  switch (targetGLSLVersion) {
    case 300:
      return isVertex ? convertVertexShaderTo300(source) : convertFragmentShaderTo300(source);

    case 100:
      return isVertex ? convertVertexShaderTo100(source) : convertFragmentShaderTo100(source);

    default:
      throw new Error("unknown GLSL version ".concat(targetGLSLVersion));
  }
}

function convertVertexShaderTo300(source) {
  return source.replace(/attribute\s+/g, 'in ').replace(/varying\s+/g, 'out ').replace(/texture2D\(/g, 'texture(').replace(/textureCube\(+/g, 'texture(').replace(/texture2DLodEXT\(/g, 'textureLod(').replace(/textureCubeLodEXT\(/g, 'textureLod(');
}

function convertFragmentShaderTo300(source) {
  return source.replace(/varying\s+/g, 'in ').replace(/texture2D\(/g, 'texture(').replace(/textureCube\(/g, 'texture(').replace(/texture2DLodEXT\(/g, 'textureLod(').replace(/textureCubeLodEXT\(/g, 'textureLod(');
}

function convertVertexShaderTo100(source) {
  return source.replace(/^in\s+/gm, 'attribute ').replace(/^out\s+/gm, 'varying ').replace(/texture\(/g, 'texture2D(');
}

function convertFragmentShaderTo100(source) {
  return source.replace(/^in\s+/gm, 'varying ').replace(/texture\(/g, 'texture2D(');
}
//# sourceMappingURL=transpile-shader.js.map