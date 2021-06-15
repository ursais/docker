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

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _layersPass = _interopRequireDefault(require("./layers-pass"));

var DrawLayersPass = function (_LayersPass) {
  (0, _inherits2.default)(DrawLayersPass, _LayersPass);

  function DrawLayersPass() {
    (0, _classCallCheck2.default)(this, DrawLayersPass);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DrawLayersPass).apply(this, arguments));
  }

  (0, _createClass2.default)(DrawLayersPass, [{
    key: "getModuleParameters",
    value: function getModuleParameters(layer, effects, effectProps) {
      var moduleParameters = (0, _get2.default)((0, _getPrototypeOf2.default)(DrawLayersPass.prototype), "getModuleParameters", this).call(this, layer);
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
}(_layersPass.default);

exports.default = DrawLayersPass;
//# sourceMappingURL=draw-layers-pass.js.map