import { registerShaderModules, setDefaultShaderModules } from '@luma.gl/core';
import { fp32, fp64, picking, gouraudlighting, phonglighting } from '@luma.gl/core';
import project from '../shaderlib/project/project';
import project32 from '../shaderlib/project32/project32';
import project64 from '../shaderlib/project64/project64';
export function initializeShaderModules() {
  registerShaderModules([fp32, fp64, project, project32, project64, gouraudlighting, phonglighting, picking]);
  setDefaultShaderModules([project]);
}
export { fp32, fp64, picking, project, project64, gouraudlighting, phonglighting };
//# sourceMappingURL=index.js.map