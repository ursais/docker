import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Pass from './pass';

var RenderPass = function (_Pass) {
  _inherits(RenderPass, _Pass);

  function RenderPass(gl) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RenderPass);

    return _possibleConstructorReturn(this, _getPrototypeOf(RenderPass).call(this, gl, Object.assign({
      id: 'render-pass'
    }, props)));
  }

  _createClass(RenderPass, [{
    key: "_renderPass",
    value: function _renderPass(_ref) {
      var animationProps = _ref.animationProps;
      var _this$props = this.props,
          _this$props$models = _this$props.models,
          models = _this$props$models === void 0 ? [] : _this$props$models,
          drawParams = _this$props.drawParams;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var model = _step.value;
          model.draw(Object.assign({}, drawParams, {
            animationProps: animationProps
          }));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return RenderPass;
}(Pass);

export { RenderPass as default };
//# sourceMappingURL=render-pass.js.map