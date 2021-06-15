"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _pass = _interopRequireDefault(require("./pass"));

var RenderPass = function (_Pass) {
  (0, _inherits2["default"])(RenderPass, _Pass);

  function RenderPass(gl) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, RenderPass);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(RenderPass).call(this, gl, Object.assign({
      id: 'render-pass'
    }, props)));
  }

  (0, _createClass2["default"])(RenderPass, [{
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
}(_pass["default"]);

exports["default"] = RenderPass;
//# sourceMappingURL=render-pass.js.map