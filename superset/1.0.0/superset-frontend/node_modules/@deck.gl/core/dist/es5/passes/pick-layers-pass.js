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

var _core = require("@luma.gl/core");

var PickLayersPass = function (_LayersPass) {
  (0, _inherits2.default)(PickLayersPass, _LayersPass);

  function PickLayersPass() {
    (0, _classCallCheck2.default)(this, PickLayersPass);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PickLayersPass).apply(this, arguments));
  }

  (0, _createClass2.default)(PickLayersPass, [{
    key: "render",
    value: function render(props) {
      if (props.pickingFBO) {
        this.drawPickingBuffer(props);
      } else {
        (0, _get2.default)((0, _getPrototypeOf2.default)(PickLayersPass.prototype), "render", this).call(this, props);
      }
    }
  }, {
    key: "drawPickingBuffer",
    value: function drawPickingBuffer(_ref) {
      var _this = this;

      var layers = _ref.layers,
          viewports = _ref.viewports,
          onViewportActive = _ref.onViewportActive,
          pickingFBO = _ref.pickingFBO,
          effectProps = _ref.effectProps,
          _ref$deviceRect = _ref.deviceRect,
          x = _ref$deviceRect.x,
          y = _ref$deviceRect.y,
          width = _ref$deviceRect.width,
          height = _ref$deviceRect.height,
          _ref$redrawReason = _ref.redrawReason,
          redrawReason = _ref$redrawReason === void 0 ? '' : _ref$redrawReason;
      var gl = this.gl;
      return (0, _core.withParameters)(gl, {
        framebuffer: pickingFBO,
        scissorTest: true,
        scissor: [x, y, width, height],
        clearColor: [0, 0, 0, 0]
      }, function () {
        _this.drawLayers({
          layers: layers,
          viewports: viewports,
          onViewportActive: onViewportActive,
          pass: 'picking',
          redrawReason: redrawReason,
          effectProps: effectProps,
          parameters: {
            blend: true,
            blendFunc: [1, 0, 32771, 0],
            blendEquation: 32774,
            blendColor: [0, 0, 0, 0],
            depthMask: true,
            depthTest: true,
            depthRange: [0, 1],
            colorMask: [true, true, true, true]
          }
        });
      });
    }
  }, {
    key: "shouldDrawLayer",
    value: function shouldDrawLayer(layer, viewport) {
      var layerFilter = this.props.layerFilter;
      var shouldDrawLayer = !layer.isComposite && layer.props.visible && layer.props.pickable;

      if (shouldDrawLayer && layerFilter) {
        shouldDrawLayer = layerFilter({
          layer: layer,
          viewport: viewport,
          isPicking: true
        });
      }

      return shouldDrawLayer;
    }
  }, {
    key: "getModuleParameters",
    value: function getModuleParameters(layer, effects, effectProps) {
      var moduleParameters = Object.assign(Object.create(layer.props), {
        viewport: layer.context.viewport,
        pickingActive: 1,
        devicePixelRatio: this.props.pixelRatio
      });
      Object.assign(moduleParameters, effectProps);
      return moduleParameters;
    }
  }, {
    key: "getLayerParameters",
    value: function getLayerParameters(layer, layerIndex, glViewport, parameters) {
      var layerParameters = Object.assign({}, layer.props.parameters || {}, parameters);
      Object.assign(layerParameters, {
        viewport: glViewport,
        blendColor: [0, 0, 0, (layerIndex + 1) / 255]
      });
      return layerParameters;
    }
  }]);
  return PickLayersPass;
}(_layersPass.default);

exports.default = PickLayersPass;
//# sourceMappingURL=pick-layers-pass.js.map