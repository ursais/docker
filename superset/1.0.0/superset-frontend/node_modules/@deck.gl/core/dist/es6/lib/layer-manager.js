import assert from '../utils/assert';
import { _ShaderCache as ShaderCache } from '@luma.gl/core';
import seer from 'seer';
import Layer from './layer';
import { LIFECYCLE } from '../lifecycle/constants';
import log from '../utils/log';
import { flatten } from '../utils/flatten';
import { Stats } from 'probe.gl';
import Viewport from '../viewports/viewport';
import { setPropOverrides, layerEditListener, seerInitListener, initLayerInSeer, updateLayerInSeer } from './seer-integration';
const LOG_PRIORITY_LIFECYCLE = 2;
const LOG_PRIORITY_LIFECYCLE_MINOR = 4;
const INITIAL_CONTEXT = Object.seal({
  layerManager: null,
  deck: null,
  gl: null,
  time: -1,
  useDevicePixels: true,
  stats: null,
  shaderCache: null,
  pickingFBO: null,
  animationProps: null,
  userData: {}
});

const layerName = layer => layer instanceof Layer ? `${layer}` : !layer ? 'null' : 'invalid';

export default class LayerManager {
  constructor(gl) {
    let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        deck = _ref.deck,
        stats = _ref.stats,
        _ref$viewport = _ref.viewport,
        viewport = _ref$viewport === void 0 ? null : _ref$viewport;

    this.lastRenderedLayers = [];
    this.layers = [];
    this.context = Object.assign({}, INITIAL_CONTEXT, {
      layerManager: this,
      deck,
      gl,
      shaderCache: gl && new ShaderCache({
        gl,
        _cachePrograms: true
      }),
      stats: stats || new Stats({
        id: 'deck.gl'
      }),
      viewport: viewport || new Viewport({
        id: 'DEFAULT-INITIAL-VIEWPORT'
      })
    });
    this._needsRedraw = 'Initial render';
    this._needsUpdate = false;
    this._debug = false;
    this.activateViewport = this.activateViewport.bind(this);
    this._initSeer = this._initSeer.bind(this);
    this._editSeer = this._editSeer.bind(this);
    Object.seal(this);
    seerInitListener(this._initSeer);
    layerEditListener(this._editSeer);
  }

  finalize() {
    for (const layer of this.layers) {
      this._finalizeLayer(layer);
    }

    seer.removeListener(this._initSeer);
    seer.removeListener(this._editSeer);
  }

  needsRedraw() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clearRedrawFlags: false
    };
    return this._checkIfNeedsRedraw(opts);
  }

  needsUpdate() {
    return this._needsUpdate;
  }

  setNeedsRedraw(reason) {
    this._needsRedraw = this._needsRedraw || reason;
  }

  setNeedsUpdate(reason) {
    this._needsUpdate = this._needsUpdate || reason;
  }

  getLayers() {
    let _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$layerIds = _ref2.layerIds,
        layerIds = _ref2$layerIds === void 0 ? null : _ref2$layerIds;

    return layerIds ? this.layers.filter(layer => layerIds.find(layerId => layer.id.indexOf(layerId) === 0)) : this.layers;
  }

  setProps(props) {
    if ('debug' in props) {
      this._debug = props.debug;
    }

    if ('userData' in props) {
      this.context.userData = props.userData;
    }

    if ('useDevicePixels' in props) {
      this.context.useDevicePixels = props.useDevicePixels;
    }

    if ('layers' in props) {
      this.setLayers(props.layers);
    }
  }

  setLayers(newLayers) {
    if (newLayers === this.lastRenderedLayers) {
      log.log(3, 'Ignoring layer update due to layer array not changed')();
      return this;
    }

    this.lastRenderedLayers = newLayers;
    newLayers = flatten(newLayers, {
      filter: Boolean
    });

    for (const layer of newLayers) {
      layer.context = this.context;
    }

    const _this$_updateLayers = this._updateLayers({
      oldLayers: this.layers,
      newLayers
    }),
          error = _this$_updateLayers.error,
          generatedLayers = _this$_updateLayers.generatedLayers;

    this.layers = generatedLayers;

    if (error) {
      throw error;
    }

    return this;
  }

  updateLayers() {
    let animationProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if ('time' in animationProps) {
      this.context.time = animationProps.time;
    }

    const reason = this.needsUpdate();

    if (reason) {
      this.setNeedsRedraw(`updating layers: ${reason}`);
      this.setLayers([...this.lastRenderedLayers]);
    }
  }

  _checkIfNeedsRedraw(opts) {
    let redraw = this._needsRedraw;

    if (opts.clearRedrawFlags) {
      this._needsRedraw = false;
    }

    for (const layer of this.layers) {
      const layerNeedsRedraw = layer.getNeedsRedraw(opts);
      redraw = redraw || layerNeedsRedraw;
    }

    return redraw;
  }

  activateViewport(viewport) {
    const oldViewport = this.context.viewport;
    const viewportChanged = !oldViewport || !viewport.equals(oldViewport);

    if (viewportChanged) {
      log.log(4, 'Viewport changed', viewport)();
      this.context.viewport = viewport;

      for (const layer of this.layers) {
        layer.setChangeFlags({
          viewportChanged: 'Viewport changed'
        });

        this._updateLayer(layer);
      }
    }

    assert(this.context.viewport, 'LayerManager: viewport not set');
    return this;
  }

  _updateLayers(_ref3) {
    let oldLayers = _ref3.oldLayers,
        newLayers = _ref3.newLayers;
    const oldLayerMap = {};

    for (const oldLayer of oldLayers) {
      if (oldLayerMap[oldLayer.id]) {
        log.warn(`Multiple old layers with same id ${layerName(oldLayer)}`)();
      } else {
        oldLayerMap[oldLayer.id] = oldLayer;
      }
    }

    const generatedLayers = [];

    const error = this._updateSublayersRecursively({
      newLayers,
      oldLayerMap,
      generatedLayers
    });

    const error2 = this._finalizeOldLayers(oldLayerMap);

    this._needsUpdate = false;
    const firstError = error || error2;
    return {
      error: firstError,
      generatedLayers
    };
  }

  _updateSublayersRecursively(_ref4) {
    let newLayers = _ref4.newLayers,
        oldLayerMap = _ref4.oldLayerMap,
        generatedLayers = _ref4.generatedLayers;
    let error = null;

    for (const newLayer of newLayers) {
      newLayer.context = this.context;
      const oldLayer = oldLayerMap[newLayer.id];

      if (oldLayer === null) {
        log.warn(`Multiple new layers with same id ${layerName(newLayer)}`)();
      }

      oldLayerMap[newLayer.id] = null;
      let sublayers = null;

      try {
        if (this._debug && oldLayer !== newLayer) {
          newLayer.validateProps();
        }

        if (!oldLayer) {
          const err = this._initializeLayer(newLayer);

          error = error || err;
          initLayerInSeer(newLayer);
        } else {
          this._transferLayerState(oldLayer, newLayer);

          const err = this._updateLayer(newLayer);

          error = error || err;
          updateLayerInSeer(newLayer);
        }

        generatedLayers.push(newLayer);
        sublayers = newLayer.isComposite && newLayer.getSubLayers();
      } catch (err) {
        log.warn(`error during matching of ${layerName(newLayer)}`, err)();
        error = error || err;
      }

      if (sublayers) {
        const err = this._updateSublayersRecursively({
          newLayers: sublayers,
          oldLayerMap,
          generatedLayers
        });

        error = error || err;
      }
    }

    return error;
  }

  _finalizeOldLayers(oldLayerMap) {
    let error = null;

    for (const layerId in oldLayerMap) {
      const layer = oldLayerMap[layerId];

      if (layer) {
        error = error || this._finalizeLayer(layer);
      }
    }

    return error;
  }

  _initializeLayer(layer) {
    log.log(LOG_PRIORITY_LIFECYCLE, `initializing ${layerName(layer)}`)();
    let error = null;

    try {
      layer._initialize();

      layer.lifecycle = LIFECYCLE.INITIALIZED;
    } catch (err) {
      log.warn(`error while initializing ${layerName(layer)}\n`, err)();
      error = error || err;
    }

    layer.internalState.layer = layer;

    for (const model of layer.getModels()) {
      model.userData.layer = layer;
    }

    return error;
  }

  _transferLayerState(oldLayer, newLayer) {
    newLayer._transferState(oldLayer);

    newLayer.lifecycle = LIFECYCLE.MATCHED;

    if (newLayer !== oldLayer) {
      log.log(LOG_PRIORITY_LIFECYCLE_MINOR, `matched ${layerName(newLayer)}`, oldLayer, '->', newLayer)();
      oldLayer.lifecycle = LIFECYCLE.AWAITING_GC;
    } else {
      log.log(LOG_PRIORITY_LIFECYCLE_MINOR, `Matching layer is unchanged ${newLayer.id}`)();
    }
  }

  _updateLayer(layer) {
    log.log(LOG_PRIORITY_LIFECYCLE_MINOR, `updating ${layer} because: ${layer.printChangeFlags()}`)();
    let error = null;

    try {
      layer._update();
    } catch (err) {
      log.warn(`error during update of ${layerName(layer)}`, err)();
      error = err;
    }

    return error;
  }

  _finalizeLayer(layer) {
    assert(layer.lifecycle !== LIFECYCLE.AWAITING_FINALIZATION);
    layer.lifecycle = LIFECYCLE.AWAITING_FINALIZATION;
    let error = null;
    this.setNeedsRedraw(`finalized ${layerName(layer)}`);

    try {
      layer._finalize();
    } catch (err) {
      log.warn(`error during finalization of ${layerName(layer)}`, err)();
      error = err;
    }

    layer.lifecycle = LIFECYCLE.FINALIZED;
    log.log(LOG_PRIORITY_LIFECYCLE, `finalizing ${layerName(layer)}`)();
    return error;
  }

  _initSeer() {
    this.layers.forEach(layer => {
      initLayerInSeer(layer);
      updateLayerInSeer(layer);
    });
  }

  _editSeer(payload) {
    if (payload.type !== 'edit' || payload.valuePath[0] !== 'props') {
      return;
    }

    setPropOverrides(payload.itemKey, payload.valuePath.slice(1), payload.value);
    this.updateLayers();
  }

}
//# sourceMappingURL=layer-manager.js.map