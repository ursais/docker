import { pushContextState, popContextState } from './track-context-state';
import { setParameters } from '../unified-parameter-api/set-parameters';
import { assert, isObjectEmpty } from '../utils';
export function withParameters(gl, parameters, func) {
  if (isObjectEmpty(parameters)) {
    return func(gl);
  }

  var _parameters$nocatch = parameters.nocatch,
      nocatch = _parameters$nocatch === void 0 ? true : _parameters$nocatch;
  assert(!parameters.frameBuffer);
  pushContextState(gl);
  setParameters(gl, parameters);
  var value;

  if (nocatch) {
    value = func(gl);
    popContextState(gl);
  } else {
    try {
      value = func(gl);
    } finally {
      popContextState(gl);
    }
  }

  return value;
}
//# sourceMappingURL=with-parameters.js.map