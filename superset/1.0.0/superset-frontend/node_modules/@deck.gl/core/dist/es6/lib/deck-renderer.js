import log from '../utils/log';
import DrawLayersPass from '../passes/draw-layers-pass';
import PickLayersPass from '../passes/pick-layers-pass';
import getPixelRatio from '../utils/get-pixel-ratio';
import PostProcessEffect from '../effects/post-process-effect';
import { Framebuffer } from '@luma.gl/core';
const LOG_PRIORITY_DRAW = 2;
export default class DeckRenderer {
  constructor(gl) {
    this.gl = gl;
    this.pixelRatio = null;
    this.layerFilter = null;
    this.drawPickingColors = false;
    this.drawLayersPass = new DrawLayersPass(gl);
    this.pickLayersPass = new PickLayersPass(gl);
    this.renderCount = 0;
    this._needsRedraw = 'Initial render';
    this.screenBuffer = null;
    this.offscreenBuffer = null;
    this.lastPostProcessEffect = null;
  }

  setProps(props) {
    if ('useDevicePixels' in props) {
      this.pixelRatio = getPixelRatio(props.useDevicePixels);
    }

    if ('layerFilter' in props) {
      if (this.layerFilter !== props.layerFilter) {
        this.layerFilter = props.layerFilter;
        this._needsRedraw = 'layerFilter changed';
      }
    }

    if ('drawPickingColors' in props) {
      if (this.drawPickingColors !== props.drawPickingColors) {
        this.drawPickingColors = props.drawPickingColors;
        this._needsRedraw = 'drawPickingColors changed';
      }
    }

    const pixelRatio = this.pixelRatio,
          layerFilter = this.layerFilter;
    this.drawLayersPass.setProps({
      pixelRatio,
      layerFilter
    });
    this.pickLayersPass.setProps({
      pixelRatio,
      layerFilter
    });
  }

  renderLayers(_ref) {
    let layers = _ref.layers,
        viewports = _ref.viewports,
        activateViewport = _ref.activateViewport,
        views = _ref.views,
        _ref$redrawReason = _ref.redrawReason,
        redrawReason = _ref$redrawReason === void 0 ? 'unknown reason' : _ref$redrawReason,
        _ref$clearCanvas = _ref.clearCanvas,
        clearCanvas = _ref$clearCanvas === void 0 ? true : _ref$clearCanvas,
        _ref$effects = _ref.effects,
        effects = _ref$effects === void 0 ? [] : _ref$effects,
        pass = _ref.pass,
        stats = _ref.stats;
    const layerPass = this.drawPickingColors ? this.pickLayersPass : this.drawLayersPass;
    const effectProps = this.prepareEffects({
      layers,
      viewports,
      onViewportActive: activateViewport,
      views,
      effects
    });
    const outputBuffer = this.lastPostProcessEffect ? this.screenBuffer : Framebuffer.getDefaultFramebuffer(this.gl);
    const renderStats = layerPass.render({
      layers,
      viewports,
      views,
      onViewportActive: activateViewport,
      redrawReason,
      clearCanvas,
      effects,
      effectProps,
      outputBuffer
    });
    this.postRender(effects);
    this.renderCount++;

    if (log.priority >= LOG_PRIORITY_DRAW) {
      renderStats.forEach(status => {
        this.logRenderStats({
          status,
          pass,
          redrawReason,
          stats,
          renderStats
        });
      });
    }
  }

  needsRedraw() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clearRedrawFlags: false
    };
    const redraw = this._needsRedraw;

    if (opts.clearRedrawFlags) {
      this._needsRedraw = false;
    }

    return redraw;
  }

  finalize() {
    if (this.screenBuffer) {
      this.screenBuffer.delete();
      this.screenBuffer = null;
    }

    if (this.offscreenBuffer) {
      this.offscreenBuffer.delete();
      this.offscreenBuffer = null;
    }
  }

  prepareEffects(params) {
    const effects = params.effects;
    const effectProps = {};
    this.lastPostProcessEffect = null;

    for (const effect of effects) {
      Object.assign(effectProps, effect.prepare(this.gl, params));

      if (effect instanceof PostProcessEffect) {
        this.lastPostProcessEffect = effect;
      }
    }

    if (this.lastPostProcessEffect) {
      this.prepareRenderBuffers();
    }

    return effectProps;
  }

  prepareRenderBuffers() {
    if (!this.screenBuffer) {
      this.screenBuffer = new Framebuffer(this.gl);
    }

    this.screenBuffer.resize();

    if (!this.offscreenBuffer) {
      this.offscreenBuffer = new Framebuffer(this.gl);
    }

    this.offscreenBuffer.resize();
  }

  postRender(effects) {
    let params = {
      inputBuffer: this.screenBuffer,
      outputBuffer: this.offscreenBuffer,
      target: null
    };

    for (const effect of effects) {
      if (effect instanceof PostProcessEffect) {
        if (effect === this.lastPostProcessEffect) {
          Object.assign(params, {
            target: Framebuffer.getDefaultFramebuffer(this.gl)
          });
          params = effect.render(params);
          break;
        }

        params = effect.render(params);
      }
    }
  }

  logRenderStats(_ref2) {
    let renderStats = _ref2.renderStats,
        pass = _ref2.pass,
        redrawReason = _ref2.redrawReason,
        stats = _ref2.stats;
    const totalCount = renderStats.totalCount,
          visibleCount = renderStats.visibleCount,
          compositeCount = renderStats.compositeCount,
          pickableCount = renderStats.pickableCount;
    const primitiveCount = totalCount - compositeCount;
    const hiddenCount = primitiveCount - visibleCount;
    let message = '';
    message += `RENDER #${this.renderCount} \
${visibleCount} (of ${totalCount} layers) to ${pass} because ${redrawReason} `;

    if (log.priority > LOG_PRIORITY_DRAW) {
      message += `\
(${hiddenCount} hidden, ${compositeCount} composite ${pickableCount} pickable)`;
    }

    log.log(LOG_PRIORITY_DRAW, message)();

    if (stats) {
      stats.get('Redraw Layers').add(visibleCount);
    }
  }

}
//# sourceMappingURL=deck-renderer.js.map