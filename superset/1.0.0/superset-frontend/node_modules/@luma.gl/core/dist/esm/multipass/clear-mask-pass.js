import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Pass from './pass.js';

var ClearMaskPass = function (_Pass) {
  _inherits(ClearMaskPass, _Pass);

  function ClearMaskPass(gl, props) {
    _classCallCheck(this, ClearMaskPass);

    return _possibleConstructorReturn(this, _getPrototypeOf(ClearMaskPass).call(this, gl, Object.assign({
      id: 'clear-mask-pass'
    }, props)));
  }

  _createClass(ClearMaskPass, [{
    key: "render",
    value: function render(gl) {
      gl.disable(2960);
    }
  }]);

  return ClearMaskPass;
}(Pass);

export { ClearMaskPass as default };
//# sourceMappingURL=clear-mask-pass.js.map