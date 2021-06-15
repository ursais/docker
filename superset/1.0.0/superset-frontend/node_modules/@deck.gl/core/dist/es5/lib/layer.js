"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _constants = require("./constants");

var _attributeManager = _interopRequireDefault(require("./attribute-manager"));

var _seerIntegration = require("./seer-integration");

var _props = require("../lifecycle/props");

var _count = require("../utils/count");

var _log = _interopRequireDefault(require("../utils/log"));

var _core = require("@luma.gl/core");

var _assert = _interopRequireDefault(require("../utils/assert"));

var _projectFunctions = require("../shaderlib/project/project-functions");

var _component = _interopRequireDefault(require("../lifecycle/component"));

var _layerState = _interopRequireDefault(require("./layer-state"));

var _viewportMercatorProject = require("viewport-mercator-project");

var LOG_PRIORITY_UPDATE = 1;
var EMPTY_ARRAY = Object.freeze([]);
var pickingColorCache = new Uint8ClampedArray(0);
var defaultProps = {
  data: {
    type: 'data',
    value: EMPTY_ARRAY,
    async: true
  },
  dataComparator: null,
  dataTransform: {
    type: 'function',
    value: function value(data) {
      return data;
    },
    compare: false
  },
  fetch: {
    type: 'function',
    value: function value(url) {
      return fetch(url).then(function (response) {
        return response.json();
      });
    },
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
  coordinateSystem: _constants.COORDINATE_SYSTEM.LNGLAT,
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
    value: function value(_ref) {
      var layerIndex = _ref.layerIndex;
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

var Layer = function (_Component) {
  (0, _inherits2.default)(Layer, _Component);

  function Layer() {
    (0, _classCallCheck2.default)(this, Layer);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Layer).apply(this, arguments));
  }

  (0, _createClass2.default)(Layer, [{
    key: "toString",
    value: function toString() {
      var className = this.constructor.layerName || this.constructor.name;
      return "".concat(className, "({id: '").concat(this.props.id, "'})");
    }
  }, {
    key: "setState",
    value: function setState(updateObject) {
      this.setChangeFlags({
        stateChanged: true
      });
      Object.assign(this.state, updateObject);
      this.setNeedsRedraw();
    }
  }, {
    key: "setNeedsRedraw",
    value: function setNeedsRedraw() {
      var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.internalState) {
        this.internalState.needsRedraw = redraw;
      }
    }
  }, {
    key: "setLayerNeedsUpdate",
    value: function setLayerNeedsUpdate() {
      this.context.layerManager.setNeedsUpdate(String(this));
    }
  }, {
    key: "getNeedsRedraw",
    value: function getNeedsRedraw() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clearRedrawFlags: false
      };
      return this._getNeedsRedraw(opts);
    }
  }, {
    key: "needsUpdate",
    value: function needsUpdate() {
      return this.shouldUpdateState(this._getUpdateParams());
    }
  }, {
    key: "isPickable",
    value: function isPickable() {
      return this.props.pickable && this.props.visible;
    }
  }, {
    key: "getModels",
    value: function getModels() {
      return this.state && (this.state.models || (this.state.model ? [this.state.model] : []));
    }
  }, {
    key: "getSingleModel",
    value: function getSingleModel() {
      return this.state && this.state.model;
    }
  }, {
    key: "getAttributeManager",
    value: function getAttributeManager() {
      return this.internalState && this.internalState.attributeManager;
    }
  }, {
    key: "getCurrentLayer",
    value: function getCurrentLayer() {
      return this.internalState && this.internalState.layer;
    }
  }, {
    key: "getFirstObject",
    value: function getFirstObject() {
      var data = this.props.data;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var object = _step.value;
          return object;
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

      return null;
    }
  }, {
    key: "project",
    value: function project(xyz) {
      var viewport = this.context.viewport;
      var worldPosition = (0, _projectFunctions.getWorldPosition)(xyz, {
        viewport: viewport,
        modelMatrix: this.props.modelMatrix,
        coordinateOrigin: this.props.coordinateOrigin,
        coordinateSystem: this.props.coordinateSystem
      });

      var _worldToPixels = (0, _viewportMercatorProject.worldToPixels)(worldPosition, viewport.pixelProjectionMatrix),
          _worldToPixels2 = (0, _slicedToArray2.default)(_worldToPixels, 3),
          x = _worldToPixels2[0],
          y = _worldToPixels2[1],
          z = _worldToPixels2[2];

      return xyz.length === 2 ? [x, y] : [x, y, z];
    }
  }, {
    key: "unproject",
    value: function unproject(xy) {
      var viewport = this.context.viewport;
      (0, _assert.default)(Array.isArray(xy));
      return viewport.unproject(xy);
    }
  }, {
    key: "projectPosition",
    value: function projectPosition(xyz) {
      (0, _assert.default)(Array.isArray(xyz));
      return (0, _projectFunctions.projectPosition)(xyz, {
        viewport: this.context.viewport,
        modelMatrix: this.props.modelMatrix,
        coordinateOrigin: this.props.coordinateOrigin,
        coordinateSystem: this.props.coordinateSystem
      });
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(lngLat) {
      _log.default.deprecated('layer.projectFlat', 'layer.projectPosition')();

      var viewport = this.context.viewport;
      (0, _assert.default)(Array.isArray(lngLat));
      return viewport.projectFlat(lngLat);
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xy) {
      _log.default.deprecated('layer.unprojectFlat')();

      var viewport = this.context.viewport;
      (0, _assert.default)(Array.isArray(xy));
      return viewport.unprojectFlat(xy);
    }
  }, {
    key: "use64bitProjection",
    value: function use64bitProjection() {
      if (this.props.fp64) {
        if (this.props.coordinateSystem === _constants.COORDINATE_SYSTEM.LNGLAT_DEPRECATED) {
          return true;
        }

        _log.default.once(0, "Legacy 64-bit mode only works with coordinateSystem set to\n        COORDINATE_SYSTEM.LNGLAT_DEPRECATED. Rendering in 32-bit mode instead")();
      }

      return false;
    }
  }, {
    key: "use64bitPositions",
    value: function use64bitPositions() {
      return this.props.fp64 || this.props.coordinateSystem === _constants.COORDINATE_SYSTEM.LNGLAT || this.props.coordinateSystem === _constants.COORDINATE_SYSTEM.IDENTITY;
    }
  }, {
    key: "screenToDevicePixels",
    value: function screenToDevicePixels(screenPixels) {
      _log.default.deprecated('screenToDevicePixels', 'DeckGL prop useDevicePixels for conversion')();

      var devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
      return screenPixels * devicePixelRatio;
    }
  }, {
    key: "onHover",
    value: function onHover(info, pickingEvent) {
      if (this.props.onHover) {
        return this.props.onHover(info, pickingEvent);
      }

      return false;
    }
  }, {
    key: "onClick",
    value: function onClick(info, pickingEvent) {
      if (this.props.onClick) {
        return this.props.onClick(info, pickingEvent);
      }

      return false;
    }
  }, {
    key: "nullPickingColor",
    value: function nullPickingColor() {
      return [0, 0, 0];
    }
  }, {
    key: "encodePickingColor",
    value: function encodePickingColor(i) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      (0, _assert.default)(i < 16777215, 'index out of picking color range');
      target[0] = i + 1 & 255;
      target[1] = i + 1 >> 8 & 255;
      target[2] = i + 1 >> 8 >> 8 & 255;
      return target;
    }
  }, {
    key: "decodePickingColor",
    value: function decodePickingColor(color) {
      (0, _assert.default)(color instanceof Uint8Array);

      var _color = (0, _slicedToArray2.default)(color, 3),
          i1 = _color[0],
          i2 = _color[1],
          i3 = _color[2];

      var index = i1 + i2 * 256 + i3 * 65536 - 1;
      return index;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      throw new Error("Layer ".concat(this, " has not defined initializeState"));
    }
  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(_ref2) {
      var oldProps = _ref2.oldProps,
          props = _ref2.props,
          context = _ref2.context,
          changeFlags = _ref2.changeFlags;
      return changeFlags.propsOrDataChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref3) {
      var oldProps = _ref3.oldProps,
          props = _ref3.props,
          context = _ref3.context,
          changeFlags = _ref3.changeFlags;
      var attributeManager = this.getAttributeManager();

      if (changeFlags.dataChanged && attributeManager) {
        attributeManager.invalidateAll();
      }
    }
  }, {
    key: "finalizeState",
    value: function finalizeState() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.getModels()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var model = _step2.value;
          model.delete();
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

      var attributeManager = this.getAttributeManager();

      if (attributeManager) {
        attributeManager.finalize();
      }
    }
  }, {
    key: "draw",
    value: function draw(opts) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.getModels()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var model = _step3.value;
          model.draw(opts);
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
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref4) {
      var info = _ref4.info,
          mode = _ref4.mode;
      var index = info.index;

      if (index >= 0) {
        if (Array.isArray(this.props.data)) {
          info.object = this.props.data[index];
        }
      }

      return info;
    }
  }, {
    key: "invalidateAttribute",
    value: function invalidateAttribute() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
      var diffReason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var attributeManager = this.getAttributeManager();

      if (!attributeManager) {
        return;
      }

      if (name === 'all') {
        _log.default.log(LOG_PRIORITY_UPDATE, "updateTriggers invalidating all attributes: ".concat(diffReason))();

        attributeManager.invalidateAll();
      } else {
        _log.default.log(LOG_PRIORITY_UPDATE, "updateTriggers invalidating attribute ".concat(name, ": ").concat(diffReason))();

        attributeManager.invalidate(name);
      }
    }
  }, {
    key: "updateAttributes",
    value: function updateAttributes(props) {
      var attributeManager = this.getAttributeManager();

      if (!attributeManager) {
        return;
      }

      var numInstances = this.getNumInstances(props);
      var bufferLayout = this.getBufferLayout(props);
      attributeManager.update({
        data: props.data,
        numInstances: numInstances,
        bufferLayout: bufferLayout,
        props: props,
        transitions: props.transitions,
        buffers: props,
        context: this,
        ignoreUnknownAttributes: true
      });
      var models = this.getModels();

      if (models.length > 0) {
        var changedAttributes = attributeManager.getChangedAttributes({
          clearChangedFlags: true
        });

        for (var i = 0, len = models.length; i < len; ++i) {
          this._setModelAttributes(models[i], changedAttributes);
        }
      }
    }
  }, {
    key: "updateTransition",
    value: function updateTransition() {
      var attributeManager = this.getAttributeManager();

      if (attributeManager) {
        attributeManager.updateTransition(this.context.time);
      }
    }
  }, {
    key: "calculateInstancePickingColors",
    value: function calculateInstancePickingColors(attribute, _ref5) {
      var numInstances = _ref5.numInstances;
      var value = attribute.value,
          size = attribute.size;

      if (value[0] === 1) {
        return;
      }

      var cacheSize = pickingColorCache.length / size;

      if (cacheSize < numInstances) {
        var newPickingColorCache = new Uint8ClampedArray(numInstances * size);
        newPickingColorCache.set(pickingColorCache);
        var pickingColor = [];

        for (var i = cacheSize; i < numInstances; i++) {
          this.encodePickingColor(i, pickingColor);
          newPickingColorCache[i * size + 0] = pickingColor[0];
          newPickingColorCache[i * size + 1] = pickingColor[1];
          newPickingColorCache[i * size + 2] = pickingColor[2];
        }

        pickingColorCache = newPickingColorCache;
      }

      value.set(numInstances < cacheSize ? pickingColorCache.subarray(0, numInstances * size) : pickingColorCache);
    }
  }, {
    key: "_setModelAttributes",
    value: function _setModelAttributes(model, changedAttributes) {
      var shaderAttributes = {};
      var excludeAttributes = model.userData.excludeAttributes || {};

      for (var attributeName in changedAttributes) {
        if (!excludeAttributes[attributeName]) {
          Object.assign(shaderAttributes, changedAttributes[attributeName].getShaderAttributes());
        }
      }

      model.setAttributes(shaderAttributes);
    }
  }, {
    key: "_clearInstancePickingColor",
    value: function _clearInstancePickingColor(color) {
      var instancePickingColors = this.getAttributeManager().attributes.instancePickingColors;
      var value = instancePickingColors.value,
          size = instancePickingColors.size;
      var i = this.decodePickingColor(color);
      value[i * size + 0] = 0;
      value[i * size + 1] = 0;
      value[i * size + 2] = 0;
      instancePickingColors.update({
        value: value
      });
    }
  }, {
    key: "_clearPickingColor",
    value: function _clearPickingColor(color) {
      var pickingColors = this.getAttributeManager().attributes.pickingColors;
      var value = pickingColors.value;

      for (var i = 0; i < value.length; i += 3) {
        if (value[i + 0] === color[0] && value[i + 1] === color[1] && value[i + 2] === color[2]) {
          value[i + 0] = 0;
          value[i + 1] = 0;
          value[i + 2] = 0;
        }
      }

      pickingColors.update({
        value: value
      });
    }
  }, {
    key: "clearPickingColor",
    value: function clearPickingColor(color) {
      if (this.getAttributeManager().attributes.pickingColors) {
        this._clearPickingColor(color);
      } else {
        this._clearInstancePickingColor(color);
      }
    }
  }, {
    key: "copyPickingColors",
    value: function copyPickingColors() {
      var _this$getAttributeMan = this.getAttributeManager().attributes,
          pickingColors = _this$getAttributeMan.pickingColors,
          instancePickingColors = _this$getAttributeMan.instancePickingColors;
      var colors = pickingColors || instancePickingColors;
      return new Uint8ClampedArray(colors.value);
    }
  }, {
    key: "restorePickingColors",
    value: function restorePickingColors(value) {
      var _this$getAttributeMan2 = this.getAttributeManager().attributes,
          pickingColors = _this$getAttributeMan2.pickingColors,
          instancePickingColors = _this$getAttributeMan2.instancePickingColors;
      var colors = pickingColors || instancePickingColors;
      colors.update({
        value: value
      });
    }
  }, {
    key: "getNumInstances",
    value: function getNumInstances(props) {
      props = props || this.props;

      if (props.numInstances !== undefined) {
        return props.numInstances;
      }

      if (this.state && this.state.numInstances !== undefined) {
        return this.state.numInstances;
      }

      var data = this.props.data;
      return (0, _count.count)(data);
    }
  }, {
    key: "getBufferLayout",
    value: function getBufferLayout(props) {
      props = props || this.props;

      if (props.bufferLayout !== undefined) {
        return props.bufferLayout;
      }

      if (this.state && this.state.bufferLayout !== undefined) {
        return this.state.bufferLayout;
      }

      return null;
    }
  }, {
    key: "_initialize",
    value: function _initialize() {
      this._initState();

      this.initializeState(this.context);
      this.state.attributeManager = this.getAttributeManager();
      this.setChangeFlags({
        dataChanged: true,
        propsChanged: true,
        viewportChanged: true
      });

      this._updateState();

      var model = this.getSingleModel();

      if (model) {
        model.id = this.props.id;
        model.program.id = "".concat(this.props.id, "-program");
      }
    }
  }, {
    key: "_update",
    value: function _update() {
      var stateNeedsUpdate = this.needsUpdate();

      if (stateNeedsUpdate) {
        this._updateState();
      }
    }
  }, {
    key: "_updateState",
    value: function _updateState() {
      var updateParams = this._getUpdateParams();

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
  }, {
    key: "_finalize",
    value: function _finalize() {
      (0, _assert.default)(this.internalState && this.state);
      this.finalizeState(this.context);
      (0, _seerIntegration.removeLayerInSeer)(this.id);
    }
  }, {
    key: "drawLayer",
    value: function drawLayer(_ref6) {
      var _this = this;

      var _ref6$moduleParameter = _ref6.moduleParameters,
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

      var animationProps = this.context.animationProps;

      if (animationProps) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.getModels()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var model = _step4.value;

            model._setAnimationProps(animationProps);
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

      var getPolygonOffset = this.props.getPolygonOffset;
      var offsets = getPolygonOffset && getPolygonOffset(uniforms) || [0, 0];
      parameters.polygonOffset = offsets;
      (0, _core.withParameters)(this.context.gl, parameters, function () {
        _this.draw({
          moduleParameters: moduleParameters,
          uniforms: uniforms,
          parameters: parameters,
          context: _this.context
        });
      });
    }
  }, {
    key: "pickLayer",
    value: function pickLayer(opts) {
      return this.getPickingInfo(opts);
    }
  }, {
    key: "getChangeFlags",
    value: function getChangeFlags() {
      return this.internalState.changeFlags;
    }
  }, {
    key: "setChangeFlags",
    value: function setChangeFlags(flags) {
      var _this2 = this;

      this.internalState.changeFlags = this.internalState.changeFlags || {};
      var changeFlags = this.internalState.changeFlags;

      if (flags.dataChanged && !changeFlags.dataChanged) {
        changeFlags.dataChanged = flags.dataChanged;

        _log.default.log(LOG_PRIORITY_UPDATE + 1, function () {
          return "dataChanged: ".concat(flags.dataChanged, " in ").concat(_this2.id);
        })();
      }

      if (flags.updateTriggersChanged && !changeFlags.updateTriggersChanged) {
        changeFlags.updateTriggersChanged = changeFlags.updateTriggersChanged && flags.updateTriggersChanged ? Object.assign({}, flags.updateTriggersChanged, changeFlags.updateTriggersChanged) : flags.updateTriggersChanged || changeFlags.updateTriggersChanged;

        _log.default.log(LOG_PRIORITY_UPDATE + 1, function () {
          return 'updateTriggersChanged: ' + "".concat(Object.keys(flags.updateTriggersChanged).join(', '), " in ").concat(_this2.id);
        })();
      }

      if (flags.propsChanged && !changeFlags.propsChanged) {
        changeFlags.propsChanged = flags.propsChanged;

        _log.default.log(LOG_PRIORITY_UPDATE + 1, function () {
          return "propsChanged: ".concat(flags.propsChanged, " in ").concat(_this2.id);
        })();
      }

      if (flags.viewportChanged && !changeFlags.viewportChanged) {
        changeFlags.viewportChanged = flags.viewportChanged;

        _log.default.log(LOG_PRIORITY_UPDATE + 2, function () {
          return "viewportChanged: ".concat(flags.viewportChanged, " in ").concat(_this2.id);
        })();
      }

      if (flags.stateChanged && !changeFlags.stateChanged) {
        changeFlags.stateChanged = flags.stateChanged;

        _log.default.log(LOG_PRIORITY_UPDATE + 1, function () {
          return "stateChanged: ".concat(flags.stateChanged, " in ").concat(_this2.id);
        })();
      }

      var propsOrDataChanged = flags.dataChanged || flags.updateTriggersChanged || flags.propsChanged;
      changeFlags.propsOrDataChanged = changeFlags.propsOrDataChanged || propsOrDataChanged;
      changeFlags.somethingChanged = changeFlags.somethingChanged || propsOrDataChanged || flags.viewportChanged || flags.stateChanged;
    }
  }, {
    key: "clearChangeFlags",
    value: function clearChangeFlags() {
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
  }, {
    key: "printChangeFlags",
    value: function printChangeFlags() {
      var flags = this.internalState.changeFlags;
      return "".concat(flags.dataChanged ? 'data ' : '').concat(flags.propsChanged ? 'props ' : '').concat(flags.updateTriggersChanged ? 'triggers ' : '').concat(flags.viewportChanged ? 'viewport' : '');
    }
  }, {
    key: "diffProps",
    value: function diffProps(newProps, oldProps) {
      var changeFlags = (0, _props.diffProps)(newProps, oldProps);

      if (changeFlags.updateTriggersChanged) {
        for (var key in changeFlags.updateTriggersChanged) {
          if (changeFlags.updateTriggersChanged[key]) {
            this._activeUpdateTrigger(key);
          }
        }
      }

      return this.setChangeFlags(changeFlags);
    }
  }, {
    key: "validateProps",
    value: function validateProps() {
      (0, _props.validateProps)(this.props);
    }
  }, {
    key: "setModuleParameters",
    value: function setModuleParameters(moduleParameters) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.getModels()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var model = _step5.value;
          model.updateModuleSettings(moduleParameters);
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
    }
  }, {
    key: "_getUpdateParams",
    value: function _getUpdateParams() {
      return {
        props: this.props,
        oldProps: this.internalState.getOldProps(),
        context: this.context,
        changeFlags: this.internalState.changeFlags
      };
    }
  }, {
    key: "_getNeedsRedraw",
    value: function _getNeedsRedraw(opts) {
      if (!this.internalState) {
        return false;
      }

      var redraw = false;
      redraw = redraw || this.internalState.needsRedraw && this.id;
      this.internalState.needsRedraw = this.internalState.needsRedraw && !opts.clearRedrawFlags;
      var attributeManager = this.getAttributeManager();
      var attributeManagerNeedsRedraw = attributeManager && attributeManager.getNeedsRedraw(opts);
      redraw = redraw || attributeManagerNeedsRedraw;
      return redraw;
    }
  }, {
    key: "_getAttributeManager",
    value: function _getAttributeManager() {
      return new _attributeManager.default(this.context.gl, {
        id: this.props.id,
        stats: this.context.stats
      });
    }
  }, {
    key: "_initState",
    value: function _initState() {
      (0, _assert.default)(!this.internalState && !this.state);

      var attributeManager = this._getAttributeManager();

      if (attributeManager) {
        attributeManager.addInstanced({
          instancePickingColors: {
            type: 5121,
            size: 3,
            update: this.calculateInstancePickingColors
          }
        });
      }

      this.internalState = new _layerState.default({
        attributeManager: attributeManager,
        layer: this
      });
      this.state = {};
      this.state.attributeManager = attributeManager;
      this.internalState.onAsyncPropUpdated = this._onAsyncPropUpdated.bind(this);
      this.internalState.setAsyncProps(this.props);
    }
  }, {
    key: "_transferState",
    value: function _transferState(oldLayer) {
      var state = oldLayer.state,
          internalState = oldLayer.internalState;
      (0, _assert.default)(state && internalState);

      if (this === oldLayer) {
        return;
      }

      this.internalState = internalState;
      this.internalState.component = this;
      this.state = state;
      state.layer = this;
      this.internalState.setAsyncProps(this.props);
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.getModels()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var model = _step6.value;
          model.userData.layer = this;
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

      this.diffProps(this.props, this.internalState.getOldProps());
    }
  }, {
    key: "_onAsyncPropUpdated",
    value: function _onAsyncPropUpdated() {
      this.diffProps(this.props, this.internalState.getOldProps());
      this.setLayerNeedsUpdate();
    }
  }, {
    key: "_activeUpdateTrigger",
    value: function _activeUpdateTrigger(propName) {
      this.invalidateAttribute(propName);
    }
  }, {
    key: "_updateBaseUniforms",
    value: function _updateBaseUniforms() {
      var _this3 = this;

      var uniforms = {
        opacity: typeof this.props.opacity === 'function' ? function (animationProps) {
          return Math.pow(_this3.props.opacity(animationProps), 1 / 2.2);
        } : Math.pow(this.props.opacity, 1 / 2.2)
      };
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.getModels()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var model = _step7.value;
          model.setUniforms(uniforms);
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
    }
  }, {
    key: "setUniforms",
    value: function setUniforms(uniformMap) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.getModels()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var model = _step8.value;
          model.setUniforms(uniformMap);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this.setNeedsRedraw();

      _log.default.deprecated('layer.setUniforms', 'model.setUniforms')();
    }
  }, {
    key: "is64bitEnabled",
    value: function is64bitEnabled() {
      _log.default.deprecated('is64bitEnabled', 'use64bitProjection')();

      return this.use64bitProjection();
    }
  }]);
  return Layer;
}(_component.default);

exports.default = Layer;
Layer.layerName = 'Layer';
Layer.defaultProps = defaultProps;
//# sourceMappingURL=layer.js.map