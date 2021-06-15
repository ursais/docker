import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Effect from '../lib/effect';
import ScreenPass from '../passes/screen-pass';
import { normalizeShaderModule } from '@luma.gl/shadertools';

var PostProcessEffect = function (_Effect) {
  _inherits(PostProcessEffect, _Effect);

  function PostProcessEffect(module) {
    var _this;

    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PostProcessEffect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostProcessEffect).call(this, props));
    _this.id = "".concat(module.name, "-pass");
    normalizeShaderModule(module);
    _this.module = module;
    return _this;
  }

  _createClass(PostProcessEffect, [{
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
}(Effect);

export { PostProcessEffect as default };

function createPasses(gl, module, id, moduleProps) {
  if (module.filter || module.sampler) {
    var fs = getFragmentShaderForRenderPass(module);
    var pass = new ScreenPass(gl, {
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
    return new ScreenPass(gl, {
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