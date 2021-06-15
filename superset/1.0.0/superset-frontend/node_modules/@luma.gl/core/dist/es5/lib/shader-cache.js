"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _webgl = require("@luma.gl/webgl");

var _utils = require("../utils");

var ShaderCache = function () {
  function ShaderCache() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        gl = _ref.gl,
        _ref$_cachePrograms = _ref._cachePrograms,
        _cachePrograms = _ref$_cachePrograms === void 0 ? false : _ref$_cachePrograms;

    (0, _classCallCheck2["default"])(this, ShaderCache);
    (0, _utils.assert)(gl);
    this.gl = gl;
    this.vertexShaders = {};
    this.fragmentShaders = {};
    this.programs = {};
    this._cachePrograms = _cachePrograms;
  }

  (0, _createClass2["default"])(ShaderCache, [{
    key: "delete",
    value: function _delete() {
      return this;
    }
  }, {
    key: "getVertexShader",
    value: function getVertexShader(gl, source) {
      (0, _utils.assert)(typeof source === 'string');
      (0, _utils.assert)(this._compareContexts(gl, this.gl));
      var shader = this.vertexShaders[source];

      if (!shader) {
        shader = new _webgl.VertexShader(gl, source);
        this.vertexShaders[source] = shader;
      }

      return shader;
    }
  }, {
    key: "getFragmentShader",
    value: function getFragmentShader(gl, source) {
      (0, _utils.assert)(typeof source === 'string');
      (0, _utils.assert)(this._compareContexts(gl, this.gl));
      var shader = this.fragmentShaders[source];

      if (!shader) {
        shader = new _webgl.FragmentShader(gl, source);
        this.fragmentShaders[source] = shader;
      }

      return shader;
    }
  }, {
    key: "getProgram",
    value: function getProgram(gl, opts) {
      (0, _utils.assert)(this._compareContexts(gl, this.gl));
      (0, _utils.assert)(typeof opts.vs === 'string');
      (0, _utils.assert)(typeof opts.fs === 'string');
      (0, _utils.assert)(typeof opts.id === 'string');

      var cacheKey = this._getProgramKey(opts);

      var program = this.programs[cacheKey];

      if (program) {
        this._resetProgram(program);

        return program;
      }

      program = this._createNewProgram(gl, opts);

      if (this._cachePrograms && this._checkProgramProp(program)) {
        program._isCached = true;
        this.programs[cacheKey] = program;
      }

      return program;
    }
  }, {
    key: "_getProgramKey",
    value: function _getProgramKey(opts) {
      return "".concat(opts.id, "-").concat(opts.vs, "-").concat(opts.fs);
    }
  }, {
    key: "_checkProgramProp",
    value: function _checkProgramProp(program) {
      return !program.varyings;
    }
  }, {
    key: "_createNewProgram",
    value: function _createNewProgram(gl, opts) {
      var vs = opts.vs,
          fs = opts.fs;
      var vertexShader = this.getVertexShader(gl, vs);
      var fragmentShader = this.getFragmentShader(gl, fs);
      return new _webgl.Program(this.gl, Object.assign({}, opts, {
        vs: vertexShader,
        fs: fragmentShader
      }));
    }
  }, {
    key: "_resetProgram",
    value: function _resetProgram(program, opts) {
      program.reset();
    }
  }, {
    key: "_compareContexts",
    value: function _compareContexts(gl1, gl2) {
      return (gl1.gl || gl1) === (gl2.gl || gl2);
    }
  }]);
  return ShaderCache;
}();

exports["default"] = ShaderCache;
//# sourceMappingURL=shader-cache.js.map