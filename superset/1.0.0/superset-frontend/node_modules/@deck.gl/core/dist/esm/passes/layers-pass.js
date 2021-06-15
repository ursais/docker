import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import Pass from './pass';
import { clear, setParameters, withParameters } from '@luma.gl/core';

var LayersPass = function (_Pass) {
  _inherits(LayersPass, _Pass);

  function LayersPass() {
    _classCallCheck(this, LayersPass);

    return _possibleConstructorReturn(this, _getPrototypeOf(LayersPass).apply(this, arguments));
  }

  _createClass(LayersPass, [{
    key: "render",
    value: function render(params) {
      var _this = this;

      var gl = this.gl;
      return withParameters(gl, {
        framebuffer: params.outputBuffer
      }, function () {
        return _this.drawLayers(params);
      });
    }
  }, {
    key: "drawLayers",
    value: function drawLayers(_ref) {
      var _this2 = this;

      var layers = _ref.layers,
          viewports = _ref.viewports,
          views = _ref.views,
          onViewportActive = _ref.onViewportActive,
          _ref$deviceRect = _ref.deviceRect,
          deviceRect = _ref$deviceRect === void 0 ? null : _ref$deviceRect,
          _ref$parameters = _ref.parameters,
          parameters = _ref$parameters === void 0 ? {} : _ref$parameters,
          _ref$pass = _ref.pass,
          pass = _ref$pass === void 0 ? 'draw' : _ref$pass,
          _ref$redrawReason = _ref.redrawReason,
          redrawReason = _ref$redrawReason === void 0 ? '' : _ref$redrawReason,
          _ref$clearCanvas = _ref.clearCanvas,
          clearCanvas = _ref$clearCanvas === void 0 ? true : _ref$clearCanvas,
          effects = _ref.effects,
          effectProps = _ref.effectProps;
      var gl = this.gl;

      if (clearCanvas) {
        this.clearCanvas(gl);
      }

      var renderStats = [];
      viewports.forEach(function (viewportOrDescriptor, i) {
        var viewport = _this2.getViewportFromDescriptor(viewportOrDescriptor);

        var view = views && views[viewport.id];
        onViewportActive(viewport);

        var stats = _this2.drawLayersInViewport(gl, {
          layers: layers,
          viewport: viewport,
          view: view,
          deviceRect: deviceRect,
          parameters: parameters,
          pass: pass,
          redrawReason: redrawReason,
          effects: effects,
          effectProps: effectProps
        });

        renderStats.push(stats);
      });
      return renderStats;
    }
  }, {
    key: "drawLayersInViewport",
    value: function drawLayersInViewport(gl, _ref2) {
      var _this3 = this;

      var layers = _ref2.layers,
          viewport = _ref2.viewport,
          view = _ref2.view,
          _ref2$deviceRect = _ref2.deviceRect,
          deviceRect = _ref2$deviceRect === void 0 ? null : _ref2$deviceRect,
          _ref2$parameters = _ref2.parameters,
          parameters = _ref2$parameters === void 0 ? {} : _ref2$parameters,
          _ref2$pass = _ref2.pass,
          pass = _ref2$pass === void 0 ? 'draw' : _ref2$pass,
          _ref2$redrawReason = _ref2.redrawReason,
          redrawReason = _ref2$redrawReason === void 0 ? '' : _ref2$redrawReason,
          effects = _ref2.effects,
          effectProps = _ref2.effectProps;
      var glViewport = this.getGLViewport(gl, {
        viewport: viewport
      });

      if (view && view.props.clear) {
        var clearOpts = view.props.clear === true ? {
          color: true,
          depth: true
        } : view.props.clear;
        withParameters(gl, {
          scissorTest: true,
          scissor: glViewport
        }, function () {
          return clear(gl, clearOpts);
        });
      }

      var renderStatus = {
        totalCount: layers.length,
        visibleCount: 0,
        compositeCount: 0,
        pickableCount: 0
      };
      setParameters(gl, parameters || {});
      layers.forEach(function (layer, layerIndex) {
        var shouldDrawLayer = _this3.shouldDrawLayer(layer, viewport);

        if (shouldDrawLayer && layer.props.pickable) {
          renderStatus.pickableCount++;
        }

        if (layer.isComposite) {
          renderStatus.compositeCount++;
        }

        if (shouldDrawLayer) {
          renderStatus.visibleCount++;

          _this3.drawLayerInViewport({
            gl: gl,
            layer: layer,
            layerIndex: layerIndex,
            glViewport: glViewport,
            parameters: parameters,
            effects: effects,
            effectProps: effectProps
          });
        }
      });
      return renderStatus;
    }
  }, {
    key: "drawLayerInViewport",
    value: function drawLayerInViewport(_ref3) {
      var gl = _ref3.gl,
          layer = _ref3.layer,
          layerIndex = _ref3.layerIndex,
          glViewport = _ref3.glViewport,
          parameters = _ref3.parameters,
          effects = _ref3.effects,
          effectProps = _ref3.effectProps;
      var moduleParameters = this.getModuleParameters(layer, effects, effectProps);
      var uniforms = Object.assign({}, layer.context.uniforms, {
        layerIndex: layerIndex
      });
      var layerParameters = this.getLayerParameters(layer, layerIndex, glViewport, parameters);
      layer.drawLayer({
        moduleParameters: moduleParameters,
        uniforms: uniforms,
        parameters: layerParameters
      });
    }
  }, {
    key: "getViewportFromDescriptor",
    value: function getViewportFromDescriptor(viewportOrDescriptor) {
      return viewportOrDescriptor.viewport ? viewportOrDescriptor.viewport : viewportOrDescriptor;
    }
  }, {
    key: "shouldDrawLayer",
    value: function shouldDrawLayer(layer, viewport) {
      var layerFilter = this.props.layerFilter;
      var shouldDrawLayer = !layer.isComposite && layer.props.visible;

      if (shouldDrawLayer && layerFilter) {
        shouldDrawLayer = layerFilter({
          layer: layer,
          viewport: viewport,
          isPicking: false
        });
      }

      return shouldDrawLayer;
    }
  }, {
    key: "getModuleParameters",
    value: function getModuleParameters(layer) {
      var moduleParameters = Object.assign(Object.create(layer.props), {
        viewport: layer.context.viewport,
        pickingActive: 0,
        devicePixelRatio: this.props.pixelRatio
      });
      return moduleParameters;
    }
  }, {
    key: "getLayerParameters",
    value: function getLayerParameters(layer, layerIndex, glViewport, parameters) {
      var layerParameters = Object.assign({}, layer.props.parameters || {}, parameters);
      Object.assign(layerParameters, {
        viewport: glViewport
      });
      return layerParameters;
    }
  }, {
    key: "getGLViewport",
    value: function getGLViewport(gl, _ref4) {
      var viewport = _ref4.viewport;
      var height = gl.canvas ? gl.canvas.clientHeight || gl.canvas.height : 100;
      var dimensions = viewport;
      var pixelRatio = this.props.pixelRatio;
      return [dimensions.x * pixelRatio, (height - dimensions.y - dimensions.height) * pixelRatio, dimensions.width * pixelRatio, dimensions.height * pixelRatio];
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas(gl) {
      var width = gl.drawingBufferWidth;
      var height = gl.drawingBufferHeight;
      withParameters(gl, {
        viewport: [0, 0, width, height]
      }, function () {
        gl.clear(16384 | 256);
      });
    }
  }]);

  return LayersPass;
}(Pass);

export { LayersPass as default };
//# sourceMappingURL=layers-pass.js.map