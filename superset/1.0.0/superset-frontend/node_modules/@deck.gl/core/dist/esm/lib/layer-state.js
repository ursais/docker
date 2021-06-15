import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import ComponentState from '../lifecycle/component-state';

var LayerState = function (_ComponentState) {
  _inherits(LayerState, _ComponentState);

  function LayerState(_ref) {
    var _this;

    var attributeManager = _ref.attributeManager,
        layer = _ref.layer;

    _classCallCheck(this, LayerState);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LayerState).call(this, layer));
    _this.attributeManager = attributeManager;
    _this.model = null;
    _this.needsRedraw = true;
    _this.subLayers = null;
    return _this;
  }

  _createClass(LayerState, [{
    key: "layer",
    get: function get() {
      return this.component;
    },
    set: function set(layer) {
      this.component = layer;
    }
  }]);

  return LayerState;
}(ComponentState);

export { LayerState as default };
//# sourceMappingURL=layer-state.js.map