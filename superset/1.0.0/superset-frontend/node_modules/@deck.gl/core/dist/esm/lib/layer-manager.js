import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
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
var LOG_PRIORITY_LIFECYCLE = 2;
var LOG_PRIORITY_LIFECYCLE_MINOR = 4;
var INITIAL_CONTEXT = Object.seal({
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

var layerName = function layerName(layer) {
  return layer instanceof Layer ? "".concat(layer) : !layer ? 'null' : 'invalid';
};

var LayerManager = function () {
  function LayerManager(gl) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        deck = _ref.deck,
        stats = _ref.stats,
        _ref$viewport = _ref.viewport,
        viewport = _ref$viewport === void 0 ? null : _ref$viewport;

    _classCallCheck(this, LayerManager);

    this.lastRenderedLayers = [];
    this.layers = [];
    this.context = Object.assign({}, INITIAL_CONTEXT, {
      layerManager: this,
      deck: deck,
      gl: gl,
      shaderCache: gl && new ShaderCache({
        gl: gl,
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

  _createClass(LayerManager, [{
    key: "finalize",
    value: function finalize() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;

          this._finalizeLayer(layer);
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

      seer.removeListener(this._initSeer);
      seer.removeListener(this._editSeer);
    }
  }, {
    key: "needsRedraw",
    value: function needsRedraw() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clearRedrawFlags: false
      };
      return this._checkIfNeedsRedraw(opts);
    }
  }, {
    key: "needsUpdate",
    value: function needsUpdate() {
      return this._needsUpdate;
    }
  }, {
    key: "setNeedsRedraw",
    value: function setNeedsRedraw(reason) {
      this._needsRedraw = this._needsRedraw || reason;
    }
  }, {
    key: "setNeedsUpdate",
    value: function setNeedsUpdate(reason) {
      this._needsUpdate = this._needsUpdate || reason;
    }
  }, {
    key: "getLayers",
    value: function getLayers() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$layerIds = _ref2.layerIds,
          layerIds = _ref2$layerIds === void 0 ? null : _ref2$layerIds;

      return layerIds ? this.layers.filter(function (layer) {
        return layerIds.find(function (layerId) {
          return layer.id.indexOf(layerId) === 0;
        });
      }) : this.layers;
    }
  }, {
    key: "setProps",
    value: function setProps(props) {
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
  }, {
    key: "setLayers",
    value: function setLayers(newLayers) {
      if (newLayers === this.lastRenderedLayers) {
        log.log(3, 'Ignoring layer update due to layer array not changed')();
        return this;
      }

      this.lastRenderedLayers = newLayers;
      newLayers = flatten(newLayers, {
        filter: Boolean
      });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = newLayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var layer = _step2.value;
          layer.context = this.context;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _this$_updateLayers = this._updateLayers({
        oldLayers: this.layers,
        newLayers: newLayers
      }),
          error = _this$_updateLayers.error,
          generatedLayers = _this$_updateLayers.generatedLayers;

      this.layers = generatedLayers;

      if (error) {
        throw error;
      }

      return this;
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var animationProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if ('time' in animationProps) {
        this.context.time = animationProps.time;
      }

      var reason = this.needsUpdate();

      if (reason) {
        this.setNeedsRedraw("updating layers: ".concat(reason));
        this.setLayers(_toConsumableArray(this.lastRenderedLayers));
      }
    }
  }, {
    key: "_checkIfNeedsRedraw",
    value: function _checkIfNeedsRedraw(opts) {
      var redraw = this._needsRedraw;

      if (opts.clearRedrawFlags) {
        this._needsRedraw = false;
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var layer = _step3.value;
          var layerNeedsRedraw = layer.getNeedsRedraw(opts);
          redraw = redraw || layerNeedsRedraw;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return redraw;
    }
  }, {
    key: "activateViewport",
    value: function activateViewport(viewport) {
      var oldViewport = this.context.viewport;
      var viewportChanged = !oldViewport || !viewport.equals(oldViewport);

      if (viewportChanged) {
        log.log(4, 'Viewport changed', viewport)();
        this.context.viewport = viewport;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.layers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var layer = _step4.value;
            layer.setChangeFlags({
              viewportChanged: 'Viewport changed'
            });

            this._updateLayer(layer);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      assert(this.context.viewport, 'LayerManager: viewport not set');
      return this;
    }
  }, {
    key: "_updateLayers",
    value: function _updateLayers(_ref3) {
      var oldLayers = _ref3.oldLayers,
          newLayers = _ref3.newLayers;
      var oldLayerMap = {};
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = oldLayers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var oldLayer = _step5.value;

          if (oldLayerMap[oldLayer.id]) {
            log.warn("Multiple old layers with same id ".concat(layerName(oldLayer)))();
          } else {
            oldLayerMap[oldLayer.id] = oldLayer;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var generatedLayers = [];

      var error = this._updateSublayersRecursively({
        newLayers: newLayers,
        oldLayerMap: oldLayerMap,
        generatedLayers: generatedLayers
      });

      var error2 = this._finalizeOldLayers(oldLayerMap);

      this._needsUpdate = false;
      var firstError = error || error2;
      return {
        error: firstError,
        generatedLayers: generatedLayers
      };
    }
  }, {
    key: "_updateSublayersRecursively",
    value: function _updateSublayersRecursively(_ref4) {
      var newLayers = _ref4.newLayers,
          oldLayerMap = _ref4.oldLayerMap,
          generatedLayers = _ref4.generatedLayers;
      var error = null;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = newLayers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var newLayer = _step6.value;
          newLayer.context = this.context;
          var oldLayer = oldLayerMap[newLayer.id];

          if (oldLayer === null) {
            log.warn("Multiple new layers with same id ".concat(layerName(newLayer)))();
          }

          oldLayerMap[newLayer.id] = null;
          var sublayers = null;

          try {
            if (this._debug && oldLayer !== newLayer) {
              newLayer.validateProps();
            }

            if (!oldLayer) {
              var err = this._initializeLayer(newLayer);

              error = error || err;
              initLayerInSeer(newLayer);
            } else {
              this._transferLayerState(oldLayer, newLayer);

              var _err = this._updateLayer(newLayer);

              error = error || _err;
              updateLayerInSeer(newLayer);
            }

            generatedLayers.push(newLayer);
            sublayers = newLayer.isComposite && newLayer.getSubLayers();
          } catch (err) {
            log.warn("error during matching of ".concat(layerName(newLayer)), err)();
            error = error || err;
          }

          if (sublayers) {
            var _err2 = this._updateSublayersRecursively({
              newLayers: sublayers,
              oldLayerMap: oldLayerMap,
              generatedLayers: generatedLayers
            });

            error = error || _err2;
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return error;
    }
  }, {
    key: "_finalizeOldLayers",
    value: function _finalizeOldLayers(oldLayerMap) {
      var error = null;

      for (var layerId in oldLayerMap) {
        var layer = oldLayerMap[layerId];

        if (layer) {
          error = error || this._finalizeLayer(layer);
        }
      }

      return error;
    }
  }, {
    key: "_initializeLayer",
    value: function _initializeLayer(layer) {
      log.log(LOG_PRIORITY_LIFECYCLE, "initializing ".concat(layerName(layer)))();
      var error = null;

      try {
        layer._initialize();

        layer.lifecycle = LIFECYCLE.INITIALIZED;
      } catch (err) {
        log.warn("error while initializing ".concat(layerName(layer), "\n"), err)();
        error = error || err;
      }

      layer.internalState.layer = layer;
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = layer.getModels()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var model = _step7.value;
          model.userData.layer = layer;
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return error;
    }
  }, {
    key: "_transferLayerState",
    value: function _transferLayerState(oldLayer, newLayer) {
      newLayer._transferState(oldLayer);

      newLayer.lifecycle = LIFECYCLE.MATCHED;

      if (newLayer !== oldLayer) {
        log.log(LOG_PRIORITY_LIFECYCLE_MINOR, "matched ".concat(layerName(newLayer)), oldLayer, '->', newLayer)();
        oldLayer.lifecycle = LIFECYCLE.AWAITING_GC;
      } else {
        log.log(LOG_PRIORITY_LIFECYCLE_MINOR, "Matching layer is unchanged ".concat(newLayer.id))();
      }
    }
  }, {
    key: "_updateLayer",
    value: function _updateLayer(layer) {
      log.log(LOG_PRIORITY_LIFECYCLE_MINOR, "updating ".concat(layer, " because: ").concat(layer.printChangeFlags()))();
      var error = null;

      try {
        layer._update();
      } catch (err) {
        log.warn("error during update of ".concat(layerName(layer)), err)();
        error = err;
      }

      return error;
    }
  }, {
    key: "_finalizeLayer",
    value: function _finalizeLayer(layer) {
      assert(layer.lifecycle !== LIFECYCLE.AWAITING_FINALIZATION);
      layer.lifecycle = LIFECYCLE.AWAITING_FINALIZATION;
      var error = null;
      this.setNeedsRedraw("finalized ".concat(layerName(layer)));

      try {
        layer._finalize();
      } catch (err) {
        log.warn("error during finalization of ".concat(layerName(layer)), err)();
        error = err;
      }

      layer.lifecycle = LIFECYCLE.FINALIZED;
      log.log(LOG_PRIORITY_LIFECYCLE, "finalizing ".concat(layerName(layer)))();
      return error;
    }
  }, {
    key: "_initSeer",
    value: function _initSeer() {
      this.layers.forEach(function (layer) {
        initLayerInSeer(layer);
        updateLayerInSeer(layer);
      });
    }
  }, {
    key: "_editSeer",
    value: function _editSeer(payload) {
      if (payload.type !== 'edit' || payload.valuePath[0] !== 'props') {
        return;
      }

      setPropOverrides(payload.itemKey, payload.valuePath.slice(1), payload.value);
      this.updateLayers();
    }
  }]);

  return LayerManager;
}();

export { LayerManager as default };
//# sourceMappingURL=layer-manager.js.map