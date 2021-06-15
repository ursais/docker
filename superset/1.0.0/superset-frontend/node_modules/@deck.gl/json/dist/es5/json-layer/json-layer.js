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

var _core = require("@deck.gl/core");

var _convertJson = require("../parsers/convert-json");

var defaultProps = {
  fetch: function fetch(dataString) {
    return JSON.parse(dataString);
  },
  configuration: []
};

var JSONLayer = function (_CompositeLayer) {
  (0, _inherits2.default)(JSONLayer, _CompositeLayer);

  function JSONLayer() {
    (0, _classCallCheck2.default)(this, JSONLayer);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(JSONLayer).apply(this, arguments));
  }

  (0, _createClass2.default)(JSONLayer, [{
    key: "initializeState",
    value: function initializeState() {
      this.state = {
        layers: []
      };
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;
      var layersChanged = changeFlags.dataChanged || props.configuration !== oldProps.configuration;

      if (layersChanged) {
        this.state.layers = (0, _convertJson.getJSONLayers)(props.data, props.configuration);
      }
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      return this.state.layers;
    }
  }]);
  return JSONLayer;
}(_core.CompositeLayer);

exports.default = JSONLayer;
JSONLayer.layerName = 'JSONLayer';
JSONLayer.defaultProps = defaultProps;
//# sourceMappingURL=json-layer.js.map