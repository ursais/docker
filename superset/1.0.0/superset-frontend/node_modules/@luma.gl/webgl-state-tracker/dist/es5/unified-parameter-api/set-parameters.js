"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setParameters = setParameters;

var _unifiedParameterApi = require("./unified-parameter-api");

var _webglSetterFunctionTable = _interopRequireDefault(require("./webgl-setter-function-table"));

function setParameters(gl, parameters) {
  (0, _unifiedParameterApi.setParameters)(gl, parameters);

  for (var key in parameters) {
    var setter = _webglSetterFunctionTable["default"][key];

    if (setter) {
      setter(gl, parameters[key], key);
    }
  }
}
//# sourceMappingURL=set-parameters.js.map