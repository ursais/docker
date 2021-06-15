import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { COORDINATE_SYSTEM } from './constants';
import AttributeManager from './attribute-manager';
import { removeLayerInSeer } from './seer-integration';
import { diffProps, validateProps } from '../lifecycle/props';
import { count } from '../utils/count';
import log from '../utils/log';
import { withParameters } from '@luma.gl/core';
import assert from '../utils/assert';
import { projectPosition, getWorldPosition } from '../shaderlib/project/project-functions';
import Component from '../lifecycle/component';
import LayerState from './layer-state';
import { worldToPixels } from 'viewport-mercator-project';
const LOG_PRIORITY_UPDATE = 1;
const EMPTY_ARRAY = Object.freeze([]);
let pickingColorCache = new Uint8ClampedArray(0);
const defaultProps = {
  data: {
    type: 'data',
    value: EMPTY_ARRAY,
    async: true
  },
  dataComparator: null,
  dataTransform: {
    type: 'function',
    value: data => data,
    compare: false
  },
  fetch: {
    type: 'function',
    value: url => fetch(url).then(response => response.json()),
    compare: false
  },
  updateTriggers: {},
  numInstances: undefined,
  visible: true,
  pickable: false,
  opacity: {
    type: 'number',
    min: 0,
    max: 1,
    value: 0.8
  },
  onHover: {
    type: 'function',
    value: null,
    compare: false,
    optional: true
  },
  onClick: {
    type: 'function',
    value: null,
    compare: false,
    optional: true
  },
  onDragStart: {
    type: 'function',
    value: null,
    compare: false,
    optional: true
  },
  onDrag: {
    type: 'function',
    value: null,
    compare: false,
    optional: true
  },
  onDragEnd: {
    type: 'function',
    value: null,
    compare: false,
    optional: true
  },
  coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  coordinateOrigin: {
    type: 'array',
    value: [0, 0, 0],
    compare: true
  },
  modelMatrix: {
    type: 'array',
    value: null,
    compare: true,
    optional: true
  },
  wrapLongitude: false,
  parameters: {},
  uniforms: {},
  framebuffer: null,
  animation: null,
  getPolygonOffset: {
    type: 'function',
    value: (_ref) => {
      let layerIndex = _ref.layerIndex;
      return [0, -layerIndex * 100];
    },
    compare: false
  },
  highlightedObjectIndex: null,
  autoHighlight: false,
  highlightColor: {
    type: 'color',
    value: [0, 0, 128, 128]
  }
};
export default class Layer extends Component {
  toString() {
    const className = this.constructor.layerName || this.constructor.name;
    return `${className}({id: '${this.props.id}'})`;
  }

  setState(updateObject) {
    this.setChangeFlags({
      stateChanged: true
    });
    Object.assign(this.state, updateObject);
    this.setNeedsRedraw();
  }

  setNeedsRedraw() {
    let redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (this.internalState) {
      this.internalState.needsRedraw = redraw;
    }
  }

  setLayerNeedsUpdate() {
    this.context.layerManager.setNeedsUpdate(String(this));
  }

  getNeedsRedraw() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clearRedrawFlags: false
    };
    return this._getNeedsRedraw(opts);
  }

  needsUpdate() {
    return this.shouldUpdateState(this._getUpdateParams());
  }

  isPickable() {
    return this.props.pickable && this.props.visible;
  }

  getModels() {
    return this.state && (this.state.models || (this.state.model ? [this.state.model] : []));
  }

  getSingleModel() {
    return this.state && this.state.model;
  }

  getAttributeManager() {
    return this.internalState && this.internalState.attributeManager;
  }

  getCurrentLayer() {
    return this.internalState && this.internalState.layer;
  }

  getFirstObject() {
    const data = this.props.data;

    for (const object of data) {
      return object;
    }

    return null;
  }

  project(xyz) {
    const viewport = this.context.viewport;
    const worldPosition = getWorldPosition(xyz, {
      viewport,
      modelMatrix: this.props.modelMatrix,
      coordinateOrigin: this.props.coordinateOrigin,
      coordinateSystem: this.props.coordinateSystem
    });

    const _worldToPixels = worldToPixels(worldPosition, viewport.pixelProjectionMatrix),
          _worldToPixels2 = _slicedToArray(_worldToPixels, 3),
          x = _worldToPixels2[0],
          y = _worldToPixels2[1],
          z = _worldToPixels2[2];

    return xyz.length === 2 ? [x, y] : [x, y, z];
  }

  unproject(xy) {
    const viewport = this.context.viewport;
    assert(Array.isArray(xy));
    return viewport.unproject(xy);
  }

  projectPosition(xyz) {
    assert(Array.isArray(xyz));
    return projectPosition(xyz, {
      viewport: this.context.viewport,
      modelMatrix: this.props.modelMatrix,
      coordinateOrigin: this.props.coordinateOrigin,
      coordinateSystem: this.props.coordinateSystem
    });
  }

  projectFlat(lngLat) {
    log.deprecated('layer.projectFlat', 'layer.projectPosition')();
    const viewport = this.context.viewport;
    assert(Array.isArray(lngLat));
    return viewport.projectFlat(lngLat);
  }

  unprojectFlat(xy) {
    log.deprecated('layer.unprojectFlat')();
    const viewport = this.context.viewport;
    assert(Array.isArray(xy));
    return viewport.unprojectFlat(xy);
  }

  use64bitProjection() {
    if (this.props.fp64) {
      if (this.props.coordinateSystem === COORDINATE_SYSTEM.LNGLAT_DEPRECATED) {
        return true;
      }

      log.once(0, `Legacy 64-bit mode only works with coordinateSystem set to
        COORDINATE_SYSTEM.LNGLAT_DEPRECATED. Rendering in 32-bit mode instead`)();
    }

    return false;
  }

  use64bitPositions() {
    return this.props.fp64 || this.props.coordinateSystem === COORDINATE_SYSTEM.LNGLAT || this.props.coordinateSystem === COORDINATE_SYSTEM.IDENTITY;
  }

  screenToDevicePixels(screenPixels) {
    log.deprecated('screenToDevicePixels', 'DeckGL prop useDevicePixels for conversion')();
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    return screenPixels * devicePixelRatio;
  }

  onHover(info, pickingEvent) {
    if (this.props.onHover) {
      return this.props.onHover(info, pickingEvent);
    }

    return false;
  }

  onClick(info, pickingEvent) {
    if (this.props.onClick) {
      return this.props.onClick(info, pickingEvent);
    }

    return false;
  }

  nullPickingColor() {
    return [0, 0, 0];
  }

  encodePickingColor(i) {
    let target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    assert(i < 16777215, 'index out of picking color range');
    target[0] = i + 1 & 255;
    target[1] = i + 1 >> 8 & 255;
    target[2] = i + 1 >> 8 >> 8 & 255;
    return target;
  }

  decodePickingColor(color) {
    assert(color instanceof Uint8Array);

    const _color = _slicedToArray(color, 3),
          i1 = _color[0],
          i2 = _color[1],
          i3 = _color[2];

    const index = i1 + i2 * 256 + i3 * 65536 - 1;
    return index;
  }

  initializeState() {
    throw new Error(`Layer ${this} has not defined initializeState`);
  }

  shouldUpdateState(_ref2) {
    let oldProps = _ref2.oldProps,
        props = _ref2.props,
        context = _ref2.context,
        changeFlags = _ref2.changeFlags;
    return changeFlags.propsOrDataChanged;
  }

  updateState(_ref3) {
    let oldProps = _ref3.oldProps,
        props = _ref3.props,
        context = _ref3.context,
        changeFlags = _ref3.changeFlags;
    const attributeManager = this.getAttributeManager();

    if (changeFlags.dataChanged && attributeManager) {
      attributeManager.invalidateAll();
    }
  }

  finalizeState() {
    for (const model of this.getModels()) {
      model.delete();
    }

    const attributeManager = this.getAttributeManager();

    if (attributeManager) {
      attributeManager.finalize();
    }
  }

  draw(opts) {
    for (const model of this.getModels()) {
      model.draw(opts);
    }
  }

  getPickingInfo(_ref4) {
    let info = _ref4.info,
        mode = _ref4.mode;
    const index = info.index;

    if (index >= 0) {
      if (Array.isArray(this.props.data)) {
        info.object = this.props.data[index];
      }
    }

    return info;
  }

  invalidateAttribute() {
    let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
    let diffReason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const attributeManager = this.getAttributeManager();

    if (!attributeManager) {
      return;
    }

    if (name === 'all') {
      log.log(LOG_PRIORITY_UPDATE, `updateTriggers invalidating all attributes: ${diffReason}`)();
      attributeManager.invalidateAll();
    } else {
      log.log(LOG_PRIORITY_UPDATE, `updateTriggers invalidating attribute ${name}: ${diffReason}`)();
      attributeManager.invalidate(name);
    }
  }

  updateAttributes(props) {
    const attributeManager = this.getAttributeManager();

    if (!attributeManager) {
      return;
    }

    const numInstances = this.getNumInstances(props);
    const bufferLayout = this.getBufferLayout(props);
    attributeManager.update({
      data: props.data,
      numInstances,
      bufferLayout,
      props,
      transitions: props.transitions,
      buffers: props,
      context: this,
      ignoreUnknownAttributes: true
    });
    const models = this.getModels();

    if (models.length > 0) {
      const changedAttributes = attributeManager.getChangedAttributes({
        clearChangedFlags: true
      });

      for (let i = 0, len = models.length; i < len; ++i) {
        this._setModelAttributes(models[i], changedAttributes);
      }
    }
  }

  updateTransition() {
    const attributeManager = this.getAttributeManager();

    if (attributeManager) {
      attributeManager.updateTransition(this.context.time);
    }
  }

  calculateInstancePickingColors(attribute, _ref5) {
    let numInstances = _ref5.numInstances;
    const value = attribute.value,
          size = attribute.size;

    if (value[0] === 1) {
      return;
    }

    const cacheSize = pickingColorCache.length / size;

    if (cacheSize < numInstances) {
      const newPickingColorCache = new Uint8ClampedArray(numInstances * size);
      newPickingColorCache.set(pickingColorCache);
      const pickingColor = [];

      for (let i = cacheSize; i < numInstances; i++) {
        this.encodePickingColor(i, pickingColor);
        newPickingColorCache[i * size + 0] = pickingColor[0];
        newPickingColorCache[i * size + 1] = pickingColor[1];
        newPickingColorCache[i * size + 2] = pickingColor[2];
      }

      pickingColorCache = newPickingColorCache;
    }

    value.set(numInstances < cacheSize ? pickingColorCache.subarray(0, numInstances * size) : pickingColorCache);
  }

  _setModelAttributes(model, changedAttributes) {
    const shaderAttributes = {};
    const excludeAttributes = model.userData.excludeAttributes || {};

    for (const attributeName in changedAttributes) {
      if (!excludeAttributes[attributeName]) {
        Object.assign(shaderAttributes, changedAttributes[attributeName].getShaderAttributes());
      }
    }

    model.setAttributes(shaderAttributes);
  }

  _clearInstancePickingColor(color) {
    const instancePickingColors = this.getAttributeManager().attributes.instancePickingColors;
    const value = instancePickingColors.value,
          size = instancePickingColors.size;
    const i = this.decodePickingColor(color);
    value[i * size + 0] = 0;
    value[i * size + 1] = 0;
    value[i * size + 2] = 0;
    instancePickingColors.update({
      value
    });
  }

  _clearPickingColor(color) {
    const pickingColors = this.getAttributeManager().attributes.pickingColors;
    const value = pickingColors.value;

    for (let i = 0; i < value.length; i += 3) {
      if (value[i + 0] === color[0] && value[i + 1] === color[1] && value[i + 2] === color[2]) {
        value[i + 0] = 0;
        value[i + 1] = 0;
        value[i + 2] = 0;
      }
    }

    pickingColors.update({
      value
    });
  }

  clearPickingColor(color) {
    if (this.getAttributeManager().attributes.pickingColors) {
      this._clearPickingColor(color);
    } else {
      this._clearInstancePickingColor(color);
    }
  }

  copyPickingColors() {
    const _this$getAttributeMan = this.getAttributeManager().attributes,
          pickingColors = _this$getAttributeMan.pickingColors,
          instancePickingColors = _this$getAttributeMan.instancePickingColors;
    const colors = pickingColors || instancePickingColors;
    return new Uint8ClampedArray(colors.value);
  }

  restorePickingColors(value) {
    const _this$getAttributeMan2 = this.getAttributeManager().attributes,
          pickingColors = _this$getAttributeMan2.pickingColors,
          instancePickingColors = _this$getAttributeMan2.instancePickingColors;
    const colors = pickingColors || instancePickingColors;
    colors.update({
      value
    });
  }

  getNumInstances(props) {
    props = props || this.props;

    if (props.numInstances !== undefined) {
      return props.numInstances;
    }

    if (this.state && this.state.numInstances !== undefined) {
      return this.state.numInstances;
    }

    const data = this.props.data;
    return count(data);
  }

  getBufferLayout(props) {
    props = props || this.props;

    if (props.bufferLayout !== undefined) {
      return props.bufferLayout;
    }

    if (this.state && this.state.bufferLayout !== undefined) {
      return this.state.bufferLayout;
    }

    return null;
  }

  _initialize() {
    this._initState();

    this.initializeState(this.context);
    this.state.attributeManager = this.getAttributeManager();
    this.setChangeFlags({
      dataChanged: true,
      propsChanged: true,
      viewportChanged: true
    });

    this._updateState();

    const model = this.getSingleModel();

    if (model) {
      model.id = this.props.id;
      model.program.id = `${this.props.id}-program`;
    }
  }

  _update() {
    const stateNeedsUpdate = this.needsUpdate();

    if (stateNeedsUpdate) {
      this._updateState();
    }
  }

  _updateState() {
    const updateParams = this._getUpdateParams();

    if (this.context.gl) {
      this.updateState(updateParams);
    } else {
      try {
        this.updateState(updateParams);
      } catch (error) {}
    }

    if (this.isComposite) {
      this._renderLayers(updateParams);
    } else {
      this.setNeedsRedraw();
      this.updateAttributes(this.props);

      this._updateBaseUniforms();

      if (this.state.model) {
        this.state.model.setInstanceCount(this.getNumInstances());
      }
    }

    this.clearChangeFlags();
    this.internalState.resetOldProps();
  }

  _finalize() {
    assert(this.internalState && this.state);
    this.finalizeState(this.context);
    removeLayerInSeer(this.id);
  }

  drawLayer(_ref6) {
    let _ref6$moduleParameter = _ref6.moduleParameters,
        moduleParameters = _ref6$moduleParameter === void 0 ? null : _ref6$moduleParameter,
        _ref6$uniforms = _ref6.uniforms,
        uniforms = _ref6$uniforms === void 0 ? {} : _ref6$uniforms,
        _ref6$parameters = _ref6.parameters,
        parameters = _ref6$parameters === void 0 ? {} : _ref6$parameters;

    if (!uniforms.picking_uActive) {
      this.updateTransition();
    }

    if (moduleParameters) {
      this.setModuleParameters(moduleParameters);
    }

    const animationProps = this.context.animationProps;

    if (animationProps) {
      for (const model of this.getModels()) {
        model._setAnimationProps(animationProps);
      }
    }

    const getPolygonOffset = this.props.getPolygonOffset;
    const offsets = getPolygonOffset && getPolygonOffset(uniforms) || [0, 0];
    parameters.polygonOffset = offsets;
    withParameters(this.context.gl, parameters, () => {
      this.draw({
        moduleParameters,
        uniforms,
        parameters,
        context: this.context
      });
    });
  }

  pickLayer(opts) {
    return this.getPickingInfo(opts);
  }

  getChangeFlags() {
    return this.internalState.changeFlags;
  }

  setChangeFlags(flags) {
    this.internalState.changeFlags = this.internalState.changeFlags || {};
    const changeFlags = this.internalState.changeFlags;

    if (flags.dataChanged && !changeFlags.dataChanged) {
      changeFlags.dataChanged = flags.dataChanged;
      log.log(LOG_PRIORITY_UPDATE + 1, () => `dataChanged: ${flags.dataChanged} in ${this.id}`)();
    }

    if (flags.updateTriggersChanged && !changeFlags.updateTriggersChanged) {
      changeFlags.updateTriggersChanged = changeFlags.updateTriggersChanged && flags.updateTriggersChanged ? Object.assign({}, flags.updateTriggersChanged, changeFlags.updateTriggersChanged) : flags.updateTriggersChanged || changeFlags.updateTriggersChanged;
      log.log(LOG_PRIORITY_UPDATE + 1, () => 'updateTriggersChanged: ' + `${Object.keys(flags.updateTriggersChanged).join(', ')} in ${this.id}`)();
    }

    if (flags.propsChanged && !changeFlags.propsChanged) {
      changeFlags.propsChanged = flags.propsChanged;
      log.log(LOG_PRIORITY_UPDATE + 1, () => `propsChanged: ${flags.propsChanged} in ${this.id}`)();
    }

    if (flags.viewportChanged && !changeFlags.viewportChanged) {
      changeFlags.viewportChanged = flags.viewportChanged;
      log.log(LOG_PRIORITY_UPDATE + 2, () => `viewportChanged: ${flags.viewportChanged} in ${this.id}`)();
    }

    if (flags.stateChanged && !changeFlags.stateChanged) {
      changeFlags.stateChanged = flags.stateChanged;
      log.log(LOG_PRIORITY_UPDATE + 1, () => `stateChanged: ${flags.stateChanged} in ${this.id}`)();
    }

    const propsOrDataChanged = flags.dataChanged || flags.updateTriggersChanged || flags.propsChanged;
    changeFlags.propsOrDataChanged = changeFlags.propsOrDataChanged || propsOrDataChanged;
    changeFlags.somethingChanged = changeFlags.somethingChanged || propsOrDataChanged || flags.viewportChanged || flags.stateChanged;
  }

  clearChangeFlags() {
    this.internalState.changeFlags = {
      dataChanged: false,
      propsChanged: false,
      updateTriggersChanged: false,
      viewportChanged: false,
      stateChanged: false,
      propsOrDataChanged: false,
      somethingChanged: false
    };
  }

  printChangeFlags() {
    const flags = this.internalState.changeFlags;
    return `\
${flags.dataChanged ? 'data ' : ''}\
${flags.propsChanged ? 'props ' : ''}\
${flags.updateTriggersChanged ? 'triggers ' : ''}\
${flags.viewportChanged ? 'viewport' : ''}\
`;
  }

  diffProps(newProps, oldProps) {
    const changeFlags = diffProps(newProps, oldProps);

    if (changeFlags.updateTriggersChanged) {
      for (const key in changeFlags.updateTriggersChanged) {
        if (changeFlags.updateTriggersChanged[key]) {
          this._activeUpdateTrigger(key);
        }
      }
    }

    return this.setChangeFlags(changeFlags);
  }

  validateProps() {
    validateProps(this.props);
  }

  setModuleParameters(moduleParameters) {
    for (const model of this.getModels()) {
      model.updateModuleSettings(moduleParameters);
    }
  }

  _getUpdateParams() {
    return {
      props: this.props,
      oldProps: this.internalState.getOldProps(),
      context: this.context,
      changeFlags: this.internalState.changeFlags
    };
  }

  _getNeedsRedraw(opts) {
    if (!this.internalState) {
      return false;
    }

    let redraw = false;
    redraw = redraw || this.internalState.needsRedraw && this.id;
    this.internalState.needsRedraw = this.internalState.needsRedraw && !opts.clearRedrawFlags;
    const attributeManager = this.getAttributeManager();
    const attributeManagerNeedsRedraw = attributeManager && attributeManager.getNeedsRedraw(opts);
    redraw = redraw || attributeManagerNeedsRedraw;
    return redraw;
  }

  _getAttributeManager() {
    return new AttributeManager(this.context.gl, {
      id: this.props.id,
      stats: this.context.stats
    });
  }

  _initState() {
    assert(!this.internalState && !this.state);

    const attributeManager = this._getAttributeManager();

    if (attributeManager) {
      attributeManager.addInstanced({
        instancePickingColors: {
          type: 5121,
          size: 3,
          update: this.calculateInstancePickingColors
        }
      });
    }

    this.internalState = new LayerState({
      attributeManager,
      layer: this
    });
    this.state = {};
    this.state.attributeManager = attributeManager;
    this.internalState.onAsyncPropUpdated = this._onAsyncPropUpdated.bind(this);
    this.internalState.setAsyncProps(this.props);
  }

  _transferState(oldLayer) {
    const state = oldLayer.state,
          internalState = oldLayer.internalState;
    assert(state && internalState);

    if (this === oldLayer) {
      return;
    }

    this.internalState = internalState;
    this.internalState.component = this;
    this.state = state;
    state.layer = this;
    this.internalState.setAsyncProps(this.props);

    for (const model of this.getModels()) {
      model.userData.layer = this;
    }

    this.diffProps(this.props, this.internalState.getOldProps());
  }

  _onAsyncPropUpdated() {
    this.diffProps(this.props, this.internalState.getOldProps());
    this.setLayerNeedsUpdate();
  }

  _activeUpdateTrigger(propName) {
    this.invalidateAttribute(propName);
  }

  _updateBaseUniforms() {
    const uniforms = {
      opacity: typeof this.props.opacity === 'function' ? animationProps => Math.pow(this.props.opacity(animationProps), 1 / 2.2) : Math.pow(this.props.opacity, 1 / 2.2)
    };

    for (const model of this.getModels()) {
      model.setUniforms(uniforms);
    }
  }

  setUniforms(uniformMap) {
    for (const model of this.getModels()) {
      model.setUniforms(uniformMap);
    }

    this.setNeedsRedraw();
    log.deprecated('layer.setUniforms', 'model.setUniforms')();
  }

  is64bitEnabled() {
    log.deprecated('is64bitEnabled', 'use64bitProjection')();
    return this.use64bitProjection();
  }

}
Layer.layerName = 'Layer';
Layer.defaultProps = defaultProps;
//# sourceMappingURL=layer.js.map