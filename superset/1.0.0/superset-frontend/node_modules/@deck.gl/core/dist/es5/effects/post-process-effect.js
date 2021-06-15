"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _effect = _interopRequireDefault(require("../lib/effect"));

var _screenPass = _interopRequireDefault(require("../passes/screen-pass"));

var _shadertools = require("@luma.gl/shadertools");

var PostProcessEffect = function (_Effect) {
  (0, _inherits2.default)(PostProcessEffect, _Effect);

  function PostProcessEffect(module) {
    var _this;

    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, PostProcessEffect);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PostProcessEffect).call(this, props));
    _this.id = "".concat(module.name, "-pass");
    (0, _shadertools.normalizeShaderModule)(module);
    _this.module = module;
    return _this;
  }

  (0, _createClass2.default)(PostProcessEffect, [{
    key: "prepare",
    value: function prepare(gl) {
      if (!this.passes) {
        this.passes = createPasses(gl, this.module, this.id, this.props);
      }
    }
  }, {
    key: "render",
    value: function render(params) {
      var _params$target = params.target,
          target = _params$target === void 0 ? null : _params$target;
      var switchBuffer = false;

      for (var index = 0; index < this.passes.length; index++) {
        var inputBuffer = switchBuffer ? params.outputBuffer : params.inputBuffer;
        var outputBuffer = switchBuffer ? params.inputBuffer : params.outputBuffer;

        if (target && index === this.passes.length - 1) {
          outputBuffer = target;
        }

        this.passes[index].render({
          inputBuffer: inputBuffer,
          outputBuffer: outputBuffer
        });
        switchBuffer = !switchBuffer;
      }

      return {
        inputBuffer: switchBuffer ? params.outputBuffer : params.inputBuffer,
        outputBuffer: switchBuffer ? params.inputBuffer : params.outputBuffer
      };
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      if (this.passes) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.passes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var pass = _step.value;
            pass.delete();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.passes = null;
      }
    }
  }]);
  return PostProcessEffect;
}(_effect.default);

exports.default = PostProcessEffect;

function createPasses(gl, module, id, moduleProps) {
  if (module.filter || module.sampler) {
    var fs = getFragmentShaderForRenderPass(module);
    var pass = new _screenPass.default(gl, {
      id: id,
      module: module,
      fs: fs,
      moduleProps: moduleProps
    });
    return [pass];
  }

  var passes = module.passes || [];
  return passes.map(function (pass, index) {
    var fs = getFragmentShaderForRenderPass(module, pass);
    var idn = "".concat(id, "-").concat(index);
    return new _screenPass.default(gl, {
      id: idn,
      module: module,
      fs: fs,
      moduleProps: moduleProps
    });
  });
}

var FILTER_FS_TEMPLATE = function FILTER_FS_TEMPLATE(func) {
  return "uniform sampler2D texture;\nuniform vec2 texSize;\n\nvarying vec2 position;\nvarying vec2 coordinate;\nvarying vec2 uv;\n\nvoid main() {\n  vec2 texCoord = coordinate;\n\n  gl_FragColor = texture2D(texture, texCoord);\n  gl_FragColor = ".concat(func, "(gl_FragColor, texSize, texCoord);\n}\n");
};

var SAMPLER_FS_TEMPLATE = function SAMPLER_FS_TEMPLATE(func) {
  return "uniform sampler2D texture;\nuniform vec2 texSize;\n\nvarying vec2 position;\nvarying vec2 coordinate;\nvarying vec2 uv;\n\nvoid main() {\n  vec2 texCoord = coordinate;\n\n  gl_FragColor = ".concat(func, "(texture, texSize, texCoord);\n}\n");
};

function getFragmentShaderForRenderPass(module) {
  var pass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : module;

  if (pass.filter) {
    var func = typeof pass.filter === 'string' ? pass.filter : "".concat(module.name, "_filterColor");
    return FILTER_FS_TEMPLATE(func);
  }

  if (pass.sampler) {
    var _func = typeof pass.sampler === 'string' ? pass.sampler : "".concat(module.name, "_sampleColor");

    return SAMPLER_FS_TEMPLATE(_func);
  }

  return null;
}
//# sourceMappingURL=post-process-effect.js.map