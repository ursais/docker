import { setParameters as glSetParameters } from './unified-parameter-api';
import FUNCTION_STYLE_PARAMETER_SETTERS from './webgl-setter-function-table';
export function setParameters(gl, parameters) {
  glSetParameters(gl, parameters);

  for (const key in parameters) {
    const setter = FUNCTION_STYLE_PARAMETER_SETTERS[key];

    if (setter) {
      setter(gl, parameters[key], key);
    }
  }
}
//# sourceMappingURL=set-parameters.js.map