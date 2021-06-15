import { fp64 } from '@luma.gl/core';
const fp64ify = fp64.fp64ify,
      fp64ifyMatrix4 = fp64.fp64ifyMatrix4;
import project from '../project/project';
import memoize from '../../utils/memoize';
import project64Shader from './project64.glsl';
export default {
  name: 'project64',
  dependencies: [project, fp64],
  vs: project64Shader,
  getUniforms,
  deprecations: [{
    type: 'function',
    old: 'project_to_clipspace_fp64',
    new: 'project_common_position_to_clipspace_fp64'
  }]
};
const DEFAULT_MODULE_OPTIONS = {};
const getMemoizedUniforms = memoize(calculateUniforms);

function getUniforms() {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_MODULE_OPTIONS;
  let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const project_uViewProjectionMatrix = context.project_uViewProjectionMatrix,
        project_uScale = context.project_uScale;

  if (project_uViewProjectionMatrix && project_uScale) {
    return getMemoizedUniforms({
      project_uViewProjectionMatrix,
      project_uScale
    });
  }

  return {};
}

function calculateUniforms(_ref) {
  let project_uViewProjectionMatrix = _ref.project_uViewProjectionMatrix,
      project_uScale = _ref.project_uScale;
  const glViewProjectionMatrixFP64 = fp64ifyMatrix4(project_uViewProjectionMatrix);
  const scaleFP64 = fp64ify(project_uScale);
  return {
    project_uViewProjectionMatrixFP64: glViewProjectionMatrixFP64,
    project64_uViewProjectionMatrix: glViewProjectionMatrixFP64,
    project64_uScale: scaleFP64
  };
}
//# sourceMappingURL=project64.js.map