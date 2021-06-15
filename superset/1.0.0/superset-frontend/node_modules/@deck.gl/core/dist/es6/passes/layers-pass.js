import Pass from './pass';
import { clear, setParameters, withParameters } from '@luma.gl/core';
export default class LayersPass extends Pass {
  render(params) {
    const gl = this.gl;
    return withParameters(gl, {
      framebuffer: params.outputBuffer
    }, () => this.drawLayers(params));
  }

  drawLayers(_ref) {
    let layers = _ref.layers,
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
    const gl = this.gl;

    if (clearCanvas) {
      this.clearCanvas(gl);
    }

    const renderStats = [];
    viewports.forEach((viewportOrDescriptor, i) => {
      const viewport = this.getViewportFromDescriptor(viewportOrDescriptor);
      const view = views && views[viewport.id];
      onViewportActive(viewport);
      const stats = this.drawLayersInViewport(gl, {
        layers,
        viewport,
        view,
        deviceRect,
        parameters,
        pass,
        redrawReason,
        effects,
        effectProps
      });
      renderStats.push(stats);
    });
    return renderStats;
  }

  drawLayersInViewport(gl, _ref2) {
    let layers = _ref2.layers,
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
    const glViewport = this.getGLViewport(gl, {
      viewport
    });

    if (view && view.props.clear) {
      const clearOpts = view.props.clear === true ? {
        color: true,
        depth: true
      } : view.props.clear;
      withParameters(gl, {
        scissorTest: true,
        scissor: glViewport
      }, () => clear(gl, clearOpts));
    }

    const renderStatus = {
      totalCount: layers.length,
      visibleCount: 0,
      compositeCount: 0,
      pickableCount: 0
    };
    setParameters(gl, parameters || {});
    layers.forEach((layer, layerIndex) => {
      const shouldDrawLayer = this.shouldDrawLayer(layer, viewport);

      if (shouldDrawLayer && layer.props.pickable) {
        renderStatus.pickableCount++;
      }

      if (layer.isComposite) {
        renderStatus.compositeCount++;
      }

      if (shouldDrawLayer) {
        renderStatus.visibleCount++;
        this.drawLayerInViewport({
          gl,
          layer,
          layerIndex,
          glViewport,
          parameters,
          effects,
          effectProps
        });
      }
    });
    return renderStatus;
  }

  drawLayerInViewport(_ref3) {
    let gl = _ref3.gl,
        layer = _ref3.layer,
        layerIndex = _ref3.layerIndex,
        glViewport = _ref3.glViewport,
        parameters = _ref3.parameters,
        effects = _ref3.effects,
        effectProps = _ref3.effectProps;
    const moduleParameters = this.getModuleParameters(layer, effects, effectProps);
    const uniforms = Object.assign({}, layer.context.uniforms, {
      layerIndex
    });
    const layerParameters = this.getLayerParameters(layer, layerIndex, glViewport, parameters);
    layer.drawLayer({
      moduleParameters,
      uniforms,
      parameters: layerParameters
    });
  }

  getViewportFromDescriptor(viewportOrDescriptor) {
    return viewportOrDescriptor.viewport ? viewportOrDescriptor.viewport : viewportOrDescriptor;
  }

  shouldDrawLayer(layer, viewport) {
    const layerFilter = this.props.layerFilter;
    let shouldDrawLayer = !layer.isComposite && layer.props.visible;

    if (shouldDrawLayer && layerFilter) {
      shouldDrawLayer = layerFilter({
        layer,
        viewport,
        isPicking: false
      });
    }

    return shouldDrawLayer;
  }

  getModuleParameters(layer) {
    const moduleParameters = Object.assign(Object.create(layer.props), {
      viewport: layer.context.viewport,
      pickingActive: 0,
      devicePixelRatio: this.props.pixelRatio
    });
    return moduleParameters;
  }

  getLayerParameters(layer, layerIndex, glViewport, parameters) {
    const layerParameters = Object.assign({}, layer.props.parameters || {}, parameters);
    Object.assign(layerParameters, {
      viewport: glViewport
    });
    return layerParameters;
  }

  getGLViewport(gl, _ref4) {
    let viewport = _ref4.viewport;
    const height = gl.canvas ? gl.canvas.clientHeight || gl.canvas.height : 100;
    const dimensions = viewport;
    const pixelRatio = this.props.pixelRatio;
    return [dimensions.x * pixelRatio, (height - dimensions.y - dimensions.height) * pixelRatio, dimensions.width * pixelRatio, dimensions.height * pixelRatio];
  }

  clearCanvas(gl) {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    withParameters(gl, {
      viewport: [0, 0, width, height]
    }, () => {
      gl.clear(16384 | 256);
    });
  }

}
//# sourceMappingURL=layers-pass.js.map