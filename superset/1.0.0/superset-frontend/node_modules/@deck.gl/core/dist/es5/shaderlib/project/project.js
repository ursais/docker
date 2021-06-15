"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@luma.gl/core");

var _project = _interopRequireDefault(require("./project.glsl"));

var _viewportUniforms = require("./viewport-uniforms");

var INITIAL_MODULE_OPTIONS = {};

function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_MODULE_OPTIONS;

  if (opts.viewport) {
    return (0, _viewportUniforms.getUniformsFromViewport)(opts);
  }

  return {};
}

var _default = {
  name: 'project',
  dependencies: [_core.fp32],
  vs: _project.default,
  getUniforms: getUniforms,
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
exports.default = _default;
//# sourceMappingURL=project.js.map