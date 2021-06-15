import { fp64ify, fp64LowPart, fp64ifyMatrix4 } from './fp64-utils';
import fp64arithmeticShader from './fp64-arithmetic.glsl';
import fp64functionShader from './fp64-functions.glsl';
const fp64shader = "".concat(fp64arithmeticShader, "\n").concat(fp64functionShader);
const CONST_UNIFORMS = {
  ONE: 1.0
};
export { fp64ify, fp64LowPart, fp64ifyMatrix4 };

function getUniforms() {
  return Object.assign({}, CONST_UNIFORMS);
}

export default {
  name: 'fp64',
  vs: fp64shader,
  fs: null,
  fp64ify,
  fp64LowPart,
  fp64ifyMatrix4,
  getUniforms
};
export const fp64arithmetic = {
  name: 'fp64-arithmetic',
  vs: "".concat(fp64arithmeticShader),
  fs: null
};
export const fp64fs = {
  name: 'fp64-fs',
  vs: null,
  fs: fp64shader
};
//# sourceMappingURL=fp64.js.map