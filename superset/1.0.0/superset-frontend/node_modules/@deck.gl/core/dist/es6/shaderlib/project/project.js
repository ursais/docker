import { fp32 } from '@luma.gl/core';
import projectShader from './project.glsl';
import { getUniformsFromViewport } from './viewport-uniforms';
const INITIAL_MODULE_OPTIONS = {};

function getUniforms() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_MODULE_OPTIONS;

  if (opts.viewport) {
    return getUniformsFromViewport(opts);
  }

  return {};
}

export default {
  name: 'project',
  dependencies: [fp32],
  vs: projectShader,
  getUniforms,
  deprecations: [{
    type: 'function',
    old: 'project_scale',
    new: 'project_size'
  }, {
    type: 'function',
    old: 'project_to_clipspace',
    new: 'project_common_position_to_clipspace'
  }, {
    type: 'function',
    old: 'project_pixel_to_clipspace',
    new: 'project_pixel_size_to_clipspace'
  }]
};
//# sourceMappingURL=project.js.map