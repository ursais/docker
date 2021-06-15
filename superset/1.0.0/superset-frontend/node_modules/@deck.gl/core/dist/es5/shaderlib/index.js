"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeShaderModules = initializeShaderModules;
Object.defineProperty(exports, "fp32", {
  enumerable: true,
  get: function get() {
    return _core.fp32;
  }
});
Object.defineProperty(exports, "fp64", {
  enumerable: true,
  get: function get() {
    return _core.fp64;
  }
});
Object.defineProperty(exports, "picking", {
  enumerable: true,
  get: function get() {
    return _core.picking;
  }
});
Object.defineProperty(exports, "gouraudlighting", {
  enumerable: true,
  get: function get() {
    return _core.gouraudlighting;
  }
});
Object.defineProperty(exports, "phonglighting", {
  enumerable: true,
  get: function get() {
    return _core.phonglighting;
  }
});
Object.defineProperty(exports, "project", {
  enumerable: true,
  get: function get() {
    return _project.default;
  }
});
Object.defineProperty(exports, "project64", {
  enumerable: true,
  get: function get() {
    return _project3.default;
  }
});

var _core = require("@luma.gl/core");

var _project = _interopRequireDefault(require("../shaderlib/project/project"));

var _project2 = _interopRequireDefault(require("../shaderlib/project32/project32"));

var _project3 = _interopRequireDefault(require("../shaderlib/project64/project64"));

function initializeShaderModules() {
  (0, _core.registerShaderModules)([_core.fp32, _core.fp64, _project.default, _project2.default, _project3.default, _core.gouraudlighting, _core.phonglighting, _core.picking]);
  (0, _core.setDefaultShaderModules)([_project.default]);
}
//# sourceMappingURL=index.js.map