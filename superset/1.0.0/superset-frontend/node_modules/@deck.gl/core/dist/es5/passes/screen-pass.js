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

var _core = require("@luma.gl/core");

var _pass = _interopRequireDefault(require("./pass"));

var ScreenPass = function (_Pass) {
  (0, _inherits2.default)(ScreenPass, _Pass);

  function ScreenPass(gl) {
    var _this;

    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, ScreenPass);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScreenPass).call(this, gl, props));
    var module = props.module,
        fs = props.fs,
        id = props.id,
        moduleProps = props.moduleProps;
    _this.model = _this._getModel(gl, module, fs, id, moduleProps);
    return _this;
  }

  (0, _createClass2.default)(ScreenPass, [{
    key: "render",
    value: function render(params) {
      var _this2 = this;

      var gl = this.gl;
      (0, _core.withParameters)(gl, {
        framebuffer: params.outputBuffer,
        clearColor: [0, 0, 0, 0]
      }, function () {
        return _this2._renderPass(gl, params);
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      this.model.delete();
      this.model = null;
    }
  }, {
    key: "_getModel",
    value: function _getModel(gl, module, fs, id, userProps) {
      var model = new _core.ClipSpace(gl, {
        id: id,
        fs: fs,
        modules: [module]
      });
      var uniforms = Object.assign(module.getUniforms(), module.getUniforms(userProps));
      model.setUniforms(uniforms);
      return model;
    }
  }, {
    key: "_renderPass",
    value: function _renderPass(gl, _ref) {
      var inputBuffer = _ref.inputBuffer,
          outputBuffer = _ref.outputBuffer;
      (0, _core.clear)(gl, {
        color: true
      });
      this.model.draw({
        uniforms: {
          texture: inputBuffer,
          texSize: [inputBuffer.width, inputBuffer.height]
        },
        parameters: {
          depthWrite: false,
          depthTest: false
        }
      });
    }
  }]);
  return ScreenPass;
}(_pass.default);

exports.default = ScreenPass;
//# sourceMappingURL=screen-pass.js.map