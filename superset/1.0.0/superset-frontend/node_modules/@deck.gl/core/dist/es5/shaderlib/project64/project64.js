"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@luma.gl/core");

var _project = _interopRequireDefault(require("../project/project"));

var _memoize = _interopRequireDefault(require("../../utils/memoize"));

var _project2 = _interopRequireDefault(require("./project64.glsl"));

var fp64ify = _core.fp64.fp64ify,
    fp64ifyMatrix4 = _core.fp64.fp64ifyMatrix4;
var _default = {
  name: 'project64',
  dependencies: [_project.default, _core.fp64],
  vs: _project2.default,
  getUniforms: getUniforms,
  deprecations: [{
    type: 'function',
    old: 'project_to_clipspace_fp64',
    new: 'project_common_position_to_clipspace_fp64'
  }]
};
exports.default = _default;
var DEFAULT_MODULE_OPTIONS = {};
var getMemoizedUniforms = (0, _memoize.default)(calculateUniforms);

function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_MODULE_OPTIONS;
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var project_uViewProjectionMatrix = context.project_uViewProjectionMatrix,
      project_uScale = context.project_uScale;

  if (project_uViewProjectionMatrix && project_uScale) {
    return getMemoizedUniforms({
      project_uViewProjectionMatrix: project_uViewProjectionMatrix,
      project_uScale: project_uScale
    });
  }

  return {};
}

function calculateUniforms(_ref) {
  var project_uViewProjectionMatrix = _ref.project_uViewProjectionMatrix,
      project_uScale = _ref.project_uScale;
  var glViewProjectionMatrixFP64 = fp64ifyMatrix4(project_uViewProjectionMatrix);
  var scaleFP64 = fp64ify(project_uScale);
  return {
    project_uViewProjectionMatrixFP64: glViewProjectionMatrixFP64,
    project64_uViewProjectionMatrix: glViewProjectionMatrixFP64,
    project64_uScale: scaleFP64
  };
}
//# sourceMappingURL=project64.js.map