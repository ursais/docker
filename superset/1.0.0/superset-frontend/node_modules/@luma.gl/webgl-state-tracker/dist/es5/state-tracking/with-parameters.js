"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withParameters = withParameters;

var _trackContextState = require("./track-context-state");

var _setParameters = require("../unified-parameter-api/set-parameters");

var _utils = require("../utils");

function withParameters(gl, parameters, func) {
  if ((0, _utils.isObjectEmpty)(parameters)) {
    return func(gl);
  }

  var _parameters$nocatch = parameters.nocatch,
      nocatch = _parameters$nocatch === void 0 ? true : _parameters$nocatch;
  (0, _utils.assert)(!parameters.frameBuffer);
  (0, _trackContextState.pushContextState)(gl);
  (0, _setParameters.setParameters)(gl, parameters);
  var value;

  if (nocatch) {
    value = func(gl);
    (0, _trackContextState.popContextState)(gl);
  } else {
    try {
      value = func(gl);
    } finally {
      (0, _trackContextState.popContextState)(gl);
    }
  }

  return value;
}
//# sourceMappingURL=with-parameters.js.map