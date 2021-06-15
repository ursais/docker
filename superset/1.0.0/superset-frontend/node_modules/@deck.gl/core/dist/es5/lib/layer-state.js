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

var _componentState = _interopRequireDefault(require("../lifecycle/component-state"));

var LayerState = function (_ComponentState) {
  (0, _inherits2.default)(LayerState, _ComponentState);

  function LayerState(_ref) {
    var _this;

    var attributeManager = _ref.attributeManager,
        layer = _ref.layer;
    (0, _classCallCheck2.default)(this, LayerState);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LayerState).call(this, layer));
    _this.attributeManager = attributeManager;
    _this.model = null;
    _this.needsRedraw = true;
    _this.subLayers = null;
    return _this;
  }

  (0, _createClass2.default)(LayerState, [{
    key: "layer",
    get: function get() {
      return this.component;
    },
    set: function set(layer) {
      this.component = layer;
    }
  }]);
  return LayerState;
}(_componentState.default);

exports.default = LayerState;
//# sourceMappingURL=layer-state.js.map