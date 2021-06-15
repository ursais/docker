import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { VertexShader, FragmentShader, Program } from '@luma.gl/webgl';
import { assert } from '../utils';

var ShaderCache = function () {
  function ShaderCache() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        gl = _ref.gl,
        _ref$_cachePrograms = _ref._cachePrograms,
        _cachePrograms = _ref$_cachePrograms === void 0 ? false : _ref$_cachePrograms;

    _classCallCheck(this, ShaderCache);

    assert(gl);
    this.gl = gl;
    this.vertexShaders = {};
    this.fragmentShaders = {};
    this.programs = {};
    this._cachePrograms = _cachePrograms;
  }

  _createClass(ShaderCache, [{
    key: "delete",
    value: function _delete() {
      return this;
    }
  }, {
    key: "getVertexShader",
    value: function getVertexShader(gl, source) {
      assert(typeof source === 'string');
      assert(this._compareContexts(gl, this.gl));
      var shader = this.vertexShaders[source];

      if (!shader) {
        shader = new VertexShader(gl, source);
        this.vertexShaders[source] = shader;
      }

      return shader;
    }
  }, {
    key: "getFragmentShader",
    value: function getFragmentShader(gl, source) {
      assert(typeof source === 'string');
      assert(this._compareContexts(gl, this.gl));
      var shader = this.fragmentShaders[source];

      if (!shader) {
        shader = new FragmentShader(gl, source);
        this.fragmentShaders[source] = shader;
      }

      return shader;
    }
  }, {
    key: "getProgram",
    value: function getProgram(gl, opts) {
      assert(this._compareContexts(gl, this.gl));
      assert(typeof opts.vs === 'string');
      assert(typeof opts.fs === 'string');
      assert(typeof opts.id === 'string');

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
      return new Program(this.gl, Object.assign({}, opts, {
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

export { ShaderCache as default };
//# sourceMappingURL=shader-cache.js.map