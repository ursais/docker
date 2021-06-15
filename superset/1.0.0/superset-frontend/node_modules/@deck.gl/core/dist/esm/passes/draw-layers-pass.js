import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import LayersPass from './layers-pass';

var DrawLayersPass = function (_LayersPass) {
  _inherits(DrawLayersPass, _LayersPass);

  function DrawLayersPass() {
    _classCallCheck(this, DrawLayersPass);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawLayersPass).apply(this, arguments));
  }

  _createClass(DrawLayersPass, [{
    key: "getModuleParameters",
    value: function getModuleParameters(layer, effects, effectProps) {
      var moduleParameters = _get(_getPrototypeOf(DrawLayersPass.prototype), "getModuleParameters", this).call(this, layer);

      Object.assign(moduleParameters, this.getObjectHighlightParameters(layer), effectProps);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = effects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var effect = _step.value;
          Object.assign(moduleParameters, effect.getParameters(layer));
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

      return moduleParameters;
    }
  }, {
    key: "getObjectHighlightParameters",
    value: function getObjectHighlightParameters(layer) {
      var _layer$props = layer.props,
          highlightedObjectIndex = _layer$props.highlightedObjectIndex,
          highlightColor = _layer$props.highlightColor;
      var parameters = {
        pickingHighlightColor: [highlightColor[0], highlightColor[1], highlightColor[2], highlightColor[3] || 255]
      };

      if (Number.isInteger(highlightedObjectIndex)) {
        parameters.pickingSelectedColor = highlightedObjectIndex >= 0 ? layer.encodePickingColor(highlightedObjectIndex) : null;
      }

      return parameters;
    }
  }]);

  return DrawLayersPass;
}(LayersPass);

export { DrawLayersPass as default };
//# sourceMappingURL=draw-layers-pass.js.map