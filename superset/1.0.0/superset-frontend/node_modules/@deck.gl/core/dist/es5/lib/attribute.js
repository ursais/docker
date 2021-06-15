"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.glArrayFromType = glArrayFromType;
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@luma.gl/core");

var _assert = _interopRequireDefault(require("../utils/assert"));

var _iterableUtils = require("../utils/iterable-utils");

var _flatten = require("../utils/flatten");

var range = _interopRequireWildcard(require("../utils/range"));

var _log = _interopRequireDefault(require("../utils/log"));

var _baseAttribute = _interopRequireDefault(require("./base-attribute"));

var DEFAULT_STATE = {
  isExternalBuffer: false,
  needsUpdate: true,
  needsRedraw: false,
  updateRanges: range.FULL,
  allocedInstances: -1
};

var Attribute = function (_BaseAttribute) {
  (0, _inherits2.default)(Attribute, _BaseAttribute);

  function Attribute(gl) {
    var _this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, Attribute);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Attribute).call(this, gl, opts));
    var _opts$transition = opts.transition,
        transition = _opts$transition === void 0 ? false : _opts$transition,
        _opts$noAlloc = opts.noAlloc,
        noAlloc = _opts$noAlloc === void 0 ? false : _opts$noAlloc,
        _opts$update = opts.update,
        update = _opts$update === void 0 ? null : _opts$update,
        _opts$accessor = opts.accessor,
        accessor = _opts$accessor === void 0 ? null : _opts$accessor,
        _opts$bufferLayout = opts.bufferLayout,
        bufferLayout = _opts$bufferLayout === void 0 ? null : _opts$bufferLayout;
    var _opts$defaultValue = opts.defaultValue,
        defaultValue = _opts$defaultValue === void 0 ? [0, 0, 0, 0] : _opts$defaultValue;
    defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    _this.shaderAttributes = {};
    _this.hasShaderAttributes = false;

    if (opts.shaderAttributes) {
      var shaderAttributes = opts.shaderAttributes;

      for (var shaderAttributeName in shaderAttributes) {
        var shaderAttribute = shaderAttributes[shaderAttributeName];
        _this.shaderAttributes[shaderAttributeName] = new Attribute(_this.gl, Object.assign({}, shaderAttribute, {
          id: shaderAttributeName,
          constant: shaderAttribute.constant || false,
          isIndexed: shaderAttribute.isIndexed || shaderAttribute.elements,
          size: shaderAttribute.elements && 1 || shaderAttribute.size || _this.size,
          value: shaderAttribute.value || null,
          divisor: shaderAttribute.instanced || shaderAttribute.divisor || _this.divisor,
          buffer: _this.getBuffer(),
          noAlloc: true
        }));
        _this.hasShaderAttributes = true;
      }
    }

    Object.assign(_this.userData, DEFAULT_STATE, opts, {
      transition: transition,
      noAlloc: noAlloc,
      update: update || accessor && _this._standardAccessor,
      accessor: accessor,
      defaultValue: defaultValue,
      bufferLayout: bufferLayout
    });
    Object.seal(_this.userData);

    _this._validateAttributeUpdaters();

    return _this;
  }

  (0, _createClass2.default)(Attribute, [{
    key: "needsUpdate",
    value: function needsUpdate() {
      return this.userData.needsUpdate;
    }
  }, {
    key: "needsRedraw",
    value: function needsRedraw() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$clearChangedFlag = _ref.clearChangedFlags,
          clearChangedFlags = _ref$clearChangedFlag === void 0 ? false : _ref$clearChangedFlag;

      var needsRedraw = this.userData.needsRedraw;
      this.userData.needsRedraw = this.userData.needsRedraw && !clearChangedFlags;
      return needsRedraw;
    }
  }, {
    key: "getInstanceCount",
    value: function getInstanceCount() {
      return this.value !== null ? this.value.length / this.size : 0;
    }
  }, {
    key: "getUpdateTriggers",
    value: function getUpdateTriggers() {
      var accessor = this.userData.accessor;
      return [this.id].concat(typeof accessor !== 'function' && accessor || []);
    }
  }, {
    key: "getAccessor",
    value: function getAccessor() {
      return this.userData.accessor;
    }
  }, {
    key: "getShaderAttributes",
    value: function getShaderAttributes() {
      var shaderAttributes = {};

      if (this.hasShaderAttributes) {
        Object.assign(shaderAttributes, this.shaderAttributes);
      } else {
        shaderAttributes[this.id] = this;
      }

      return shaderAttributes;
    }
  }, {
    key: "supportsTransition",
    value: function supportsTransition() {
      return this.userData.transition;
    }
  }, {
    key: "getTransitionSetting",
    value: function getTransitionSetting(opts) {
      var _this$userData = this.userData,
          transition = _this$userData.transition,
          accessor = _this$userData.accessor;

      if (!transition) {
        return null;
      }

      var settings = Array.isArray(accessor) ? opts[accessor.find(function (a) {
        return opts[a];
      })] : opts[accessor];

      if (Number.isFinite(settings)) {
        settings = {
          duration: settings
        };
      }

      if (settings && settings.duration > 0) {
        return Object.assign({}, transition, settings);
      }

      return null;
    }
  }, {
    key: "setNeedsUpdate",
    value: function setNeedsUpdate() {
      var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.id;
      var dataRange = arguments.length > 1 ? arguments[1] : undefined;
      this.userData.needsUpdate = this.userData.needsUpdate || reason;

      if (dataRange) {
        var _dataRange$startRow = dataRange.startRow,
            startRow = _dataRange$startRow === void 0 ? 0 : _dataRange$startRow,
            _dataRange$endRow = dataRange.endRow,
            endRow = _dataRange$endRow === void 0 ? Infinity : _dataRange$endRow;
        this.userData.updateRanges = range.add(this.userData.updateRanges, [startRow, endRow]);
      } else {
        this.userData.updateRanges = range.FULL;
      }
    }
  }, {
    key: "clearNeedsUpdate",
    value: function clearNeedsUpdate() {
      this.userData.needsUpdate = false;
      this.userData.updateRanges = range.EMPTY;
    }
  }, {
    key: "setNeedsRedraw",
    value: function setNeedsRedraw() {
      var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.id;
      this.userData.needsRedraw = this.userData.needsRedraw || reason;
    }
  }, {
    key: "allocate",
    value: function allocate(numInstances) {
      var state = this.userData;

      if (state.isExternalBuffer || state.noAlloc) {
        return false;
      }

      var instanceCount = this.getInstanceCount();
      var needsAlloc = instanceCount === 0 || instanceCount < numInstances;

      if (needsAlloc && (state.update || state.accessor)) {
        (0, _assert.default)(Number.isFinite(numInstances));
        var allocCount = Math.max(numInstances, 1);
        var ArrayType = glArrayFromType(this.type || 5126);
        var oldValue = this.value;
        this.constant = false;
        this.value = new ArrayType(this.size * allocCount);

        if (this.buffer && this.buffer.byteLength < this.value.byteLength) {
          this.buffer.reallocate(this.value.byteLength);
        }

        if (state.updateRanges !== range.FULL) {
          this.value.set(oldValue);
          this.buffer.subData(oldValue);
        }

        this.setNeedsUpdate(true, {
          startRow: instanceCount
        });
        state.allocedInstances = allocCount;
        return true;
      }

      return false;
    }
  }, {
    key: "updateBuffer",
    value: function updateBuffer(_ref2) {
      var numInstances = _ref2.numInstances,
          bufferLayout = _ref2.bufferLayout,
          data = _ref2.data,
          props = _ref2.props,
          context = _ref2.context;

      if (!this.needsUpdate()) {
        return false;
      }

      var state = this.userData;
      var update = state.update,
          updateRanges = state.updateRanges,
          noAlloc = state.noAlloc;
      var updated = true;

      if (update) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = updateRanges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
                startRow = _step$value[0],
                endRow = _step$value[1];

            update.call(context, this, {
              data: data,
              startRow: startRow,
              endRow: endRow,
              props: props,
              numInstances: numInstances,
              bufferLayout: bufferLayout
            });
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

        if (this.constant || !this.buffer || this.buffer.byteLength < this.value.byteLength) {
          this.update({
            value: this.value,
            constant: this.constant
          });
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = updateRanges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
                  startRow = _step2$value[0],
                  endRow = _step2$value[1];

              var startOffset = Number.isFinite(startRow) ? this._getVertexOffset(startRow, this.bufferLayout) : 0;
              var endOffset = Number.isFinite(endRow) ? this._getVertexOffset(endRow, this.bufferLayout) : noAlloc || !Number.isFinite(numInstances) ? this.value.length : numInstances * this.size;
              this.buffer.subData({
                data: this.value.subarray(startOffset, endOffset),
                offset: startOffset * this.value.BYTES_PER_ELEMENT
              });
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
        }

        this._checkAttributeArray();
      } else {
        updated = false;
      }

      this._updateShaderAttributes();

      this.clearNeedsUpdate();
      state.needsRedraw = true;
      return updated;
    }
  }, {
    key: "update",
    value: function update(props) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Attribute.prototype), "update", this).call(this, props);

      this._updateShaderAttributes();
    }
  }, {
    key: "setGenericValue",
    value: function setGenericValue(value) {
      var state = this.userData;

      if (value === undefined || typeof value === 'function') {
        state.isExternalBuffer = false;
        return false;
      }

      value = this._normalizeValue(value);
      var hasChanged = !this.constant || !this._areValuesEqual(value, this.value);

      if (hasChanged) {
        this.update({
          constant: true,
          value: value
        });
      }

      state.needsRedraw = state.needsUpdate || hasChanged;
      this.clearNeedsUpdate();
      state.isExternalBuffer = true;

      this._updateShaderAttributes();

      return true;
    }
  }, {
    key: "setExternalBuffer",
    value: function setExternalBuffer(buffer, numInstances) {
      var state = this.userData;

      if (buffer) {
        state.isExternalBuffer = true;
        this.clearNeedsUpdate();

        if (buffer instanceof _core.Buffer) {
          if (this.externalBuffer !== buffer) {
            this.update({
              constant: false,
              buffer: buffer
            });
            state.needsRedraw = true;
          }
        } else if (this.value !== buffer) {
          if (!ArrayBuffer.isView(buffer)) {
            throw new Error('Attribute prop must be typed array');
          }

          if (state.auto && buffer.length <= numInstances * this.size) {
            throw new Error('Attribute prop array must match length and size');
          }

          var ArrayType = glArrayFromType(this.type || 5126);

          if (buffer instanceof ArrayType) {
            this.update({
              constant: false,
              value: buffer
            });
          } else {
            _log.default.warn("Attribute prop ".concat(this.id, " is casted to ").concat(ArrayType.name))();

            this.update({
              constant: false,
              value: new ArrayType(buffer)
            });
          }

          this.value = buffer;
          state.needsRedraw = true;
        }

        this._updateShaderAttributes();

        return true;
      }

      state.isExternalBuffer = false;
      return false;
    }
  }, {
    key: "_getVertexOffset",
    value: function _getVertexOffset(row, bufferLayout) {
      if (bufferLayout) {
        var offset = 0;
        var index = 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = bufferLayout[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var geometrySize = _step3.value;

            if (index >= row) {
              break;
            }

            offset += geometrySize * this.size;
            index++;
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

        return offset;
      }

      return row * this.size;
    }
  }, {
    key: "_normalizeValue",
    value: function _normalizeValue(value) {
      var out = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var defaultValue = this.userData.defaultValue;

      if (!Array.isArray(value) && !ArrayBuffer.isView(value)) {
        out[start] = Number.isFinite(value) ? value : defaultValue[0];
        return out;
      }

      switch (this.size) {
        case 4:
          out[start + 3] = Number.isFinite(value[3]) ? value[3] : defaultValue[3];

        case 3:
          out[start + 2] = Number.isFinite(value[2]) ? value[2] : defaultValue[2];

        case 2:
          out[start + 1] = Number.isFinite(value[1]) ? value[1] : defaultValue[1];

        case 1:
          out[start + 0] = Number.isFinite(value[0]) ? value[0] : defaultValue[0];
      }

      return out;
    }
  }, {
    key: "_areValuesEqual",
    value: function _areValuesEqual(value1, value2) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.size;

      for (var i = 0; i < size; i++) {
        if (value1[i] !== value2[i]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "_standardAccessor",
    value: function _standardAccessor(attribute, _ref3) {
      var data = _ref3.data,
          startRow = _ref3.startRow,
          endRow = _ref3.endRow,
          props = _ref3.props,
          numInstances = _ref3.numInstances,
          bufferLayout = _ref3.bufferLayout;
      var state = attribute.userData;
      var accessor = state.accessor;
      var value = attribute.value,
          size = attribute.size;
      var accessorFunc = typeof accessor === 'function' ? accessor : props[accessor];
      (0, _assert.default)(typeof accessorFunc === 'function', "accessor \"".concat(accessor, "\" is not a function"));

      var i = attribute._getVertexOffset(startRow, bufferLayout);

      var _createIterable = (0, _iterableUtils.createIterable)(data, startRow, endRow),
          iterable = _createIterable.iterable,
          objectInfo = _createIterable.objectInfo;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = iterable[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var object = _step4.value;
          objectInfo.index++;
          var objectValue = accessorFunc(object, objectInfo);

          if (bufferLayout) {
            attribute._normalizeValue(objectValue, objectInfo.target);

            var numVertices = bufferLayout[objectInfo.index];
            (0, _flatten.fillArray)({
              target: attribute.value,
              source: objectInfo.target,
              start: i,
              count: numVertices
            });
            i += numVertices * size;
          } else {
            attribute._normalizeValue(objectValue, value, i);

            i += size;
          }
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

      attribute.constant = false;
      attribute.bufferLayout = bufferLayout;
    }
  }, {
    key: "_validateAttributeUpdaters",
    value: function _validateAttributeUpdaters() {
      var state = this.userData;
      var hasUpdater = state.noAlloc || typeof state.update === 'function' || typeof state.accessor === 'string';

      if (!hasUpdater) {
        throw new Error("Attribute ".concat(this.id, " missing update or accessor"));
      }
    }
  }, {
    key: "_checkAttributeArray",
    value: function _checkAttributeArray() {
      var value = this.value;

      if (value && value.length >= 4) {
        var valid = Number.isFinite(value[0]) && Number.isFinite(value[1]) && Number.isFinite(value[2]) && Number.isFinite(value[3]);

        if (!valid) {
          throw new Error("Illegal attribute generated for ".concat(this.id));
        }
      }
    }
  }, {
    key: "_updateShaderAttributes",
    value: function _updateShaderAttributes() {
      var shaderAttributes = this.shaderAttributes;

      for (var shaderAttributeName in shaderAttributes) {
        var shaderAttribute = shaderAttributes[shaderAttributeName];
        shaderAttribute.update({
          buffer: this.getBuffer(),
          value: this.value,
          constant: this.constant
        });
      }
    }
  }, {
    key: "bufferLayout",
    get: function get() {
      return this.userData.bufferLayout;
    },
    set: function set(layout) {
      this.userData.bufferLayout = layout;
    }
  }]);
  return Attribute;
}(_baseAttribute.default);

exports.default = Attribute;

function glArrayFromType(glType) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref4$clamped = _ref4.clamped,
      clamped = _ref4$clamped === void 0 ? true : _ref4$clamped;

  switch (glType) {
    case 5126:
      return Float32Array;

    case 5123:
    case 33635:
    case 32819:
    case 32820:
      return Uint16Array;

    case 5125:
      return Uint32Array;

    case 5121:
      return clamped ? Uint8ClampedArray : Uint8Array;

    case 5120:
      return Int8Array;

    case 5122:
      return Int16Array;

    case 5124:
      return Int32Array;

    default:
      throw new Error('Failed to deduce type from array');
  }
}
//# sourceMappingURL=attribute.js.map