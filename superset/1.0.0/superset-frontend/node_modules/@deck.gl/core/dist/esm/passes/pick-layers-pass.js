import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import LayersPass from './layers-pass';
import { withParameters } from '@luma.gl/core';

var PickLayersPass = function (_LayersPass) {
  _inherits(PickLayersPass, _LayersPass);

  function PickLayersPass() {
    _classCallCheck(this, PickLayersPass);

    return _possibleConstructorReturn(this, _getPrototypeOf(PickLayersPass).apply(this, arguments));
  }

  _createClass(PickLayersPass, [{
    key: "render",
    value: function render(props) {
      if (props.pickingFBO) {
        this.drawPickingBuffer(props);
      } else {
        _get(_getPrototypeOf(PickLayersPass.prototype), "render", this).call(this, props);
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
      return withParameters(gl, {
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
}(LayersPass);

export { PickLayersPass as default };
//# sourceMappingURL=pick-layers-pass.js.map