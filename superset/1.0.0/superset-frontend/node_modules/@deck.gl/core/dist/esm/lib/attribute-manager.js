import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import Attribute from './attribute';
import log from '../utils/log';
import AttributeTransitionManager from './attribute-transition-manager';
var LOG_START_END_PRIORITY = 2;
var LOG_DETAIL_PRIORITY = 3;

function noop() {}

var logFunctions = {
  savedMessages: null,
  timeStart: null,
  onLog: function onLog(_ref) {
    var level = _ref.level,
        message = _ref.message;
    log.log(level, message)();
  },
  onUpdateStart: function onUpdateStart(_ref2) {
    var level = _ref2.level,
        numInstances = _ref2.numInstances;
    logFunctions.savedMessages = [];
    logFunctions.timeStart = new Date();
  },
  onUpdate: function onUpdate(_ref3) {
    var level = _ref3.level,
        message = _ref3.message;

    if (logFunctions.savedMessages) {
      logFunctions.savedMessages.push(message);
    }
  },
  onUpdateEnd: function onUpdateEnd(_ref4) {
    var level = _ref4.level,
        id = _ref4.id,
        numInstances = _ref4.numInstances;
    var timeMs = Math.round(new Date() - logFunctions.timeStart);
    var time = "".concat(timeMs, "ms");
    log.group(level, "Updated attributes for ".concat(numInstances, " instances in ").concat(id, " in ").concat(time), {
      collapsed: true
    })();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = logFunctions.savedMessages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var message = _step.value;
        log.log(level, message)();
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

    log.groupEnd(level, "Updated attributes for ".concat(numInstances, " instances in ").concat(id, " in ").concat(time))();
    logFunctions.savedMessages = null;
  }
};

var AttributeManager = function () {
  _createClass(AttributeManager, null, [{
    key: "setDefaultLogFunctions",
    value: function setDefaultLogFunctions() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          onLog = _ref5.onLog,
          onUpdateStart = _ref5.onUpdateStart,
          onUpdate = _ref5.onUpdate,
          onUpdateEnd = _ref5.onUpdateEnd;

      if (onLog !== undefined) {
        logFunctions.onLog = onLog || noop;
      }

      if (onUpdateStart !== undefined) {
        logFunctions.onUpdateStart = onUpdateStart || noop;
      }

      if (onUpdate !== undefined) {
        logFunctions.onUpdate = onUpdate || noop;
      }

      if (onUpdateEnd !== undefined) {
        logFunctions.onUpdateEnd = onUpdateEnd || noop;
      }
    }
  }]);

  function AttributeManager(gl) {
    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref6$id = _ref6.id,
        id = _ref6$id === void 0 ? 'attribute-manager' : _ref6$id,
        stats = _ref6.stats;

    _classCallCheck(this, AttributeManager);

    this.id = id;
    this.gl = gl;
    this.attributes = {};
    this.updateTriggers = {};
    this.accessors = {};
    this.needsRedraw = true;
    this.userData = {};
    this.stats = stats;
    this.attributeTransitionManager = new AttributeTransitionManager(gl, {
      id: "".concat(id, "-transitions")
    });
    Object.seal(this);
  }

  _createClass(AttributeManager, [{
    key: "finalize",
    value: function finalize() {
      for (var attributeName in this.attributes) {
        this.attributes[attributeName].delete();
      }

      this.attributeTransitionManager.finalize();
    }
  }, {
    key: "getNeedsRedraw",
    value: function getNeedsRedraw() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clearRedrawFlags: false
      };
      var redraw = this.needsRedraw;
      this.needsRedraw = this.needsRedraw && !opts.clearRedrawFlags;
      return redraw && this.id;
    }
  }, {
    key: "setNeedsRedraw",
    value: function setNeedsRedraw() {
      var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.needsRedraw = true;
      return this;
    }
  }, {
    key: "add",
    value: function add(attributes, updaters) {
      this._add(attributes, updaters);
    }
  }, {
    key: "addInstanced",
    value: function addInstanced(attributes, updaters) {
      this._add(attributes, updaters, {
        instanced: 1
      });
    }
  }, {
    key: "remove",
    value: function remove(attributeNameArray) {
      for (var i = 0; i < attributeNameArray.length; i++) {
        var name = attributeNameArray[i];

        if (this.attributes[name] !== undefined) {
          this.attributes[name].delete();
          delete this.attributes[name];
        }
      }
    }
  }, {
    key: "invalidate",
    value: function invalidate(triggerName, dataRange) {
      var invalidatedAttributes = this._invalidateTrigger(triggerName, dataRange);

      logFunctions.onLog({
        level: LOG_DETAIL_PRIORITY,
        message: "invalidated attributes ".concat(invalidatedAttributes, " (").concat(triggerName, ") for ").concat(this.id)
      });
    }
  }, {
    key: "invalidateAll",
    value: function invalidateAll(dataRange) {
      for (var attributeName in this.attributes) {
        this.attributes[attributeName].setNeedsUpdate(attributeName, dataRange);
      }

      logFunctions.onLog({
        level: LOG_DETAIL_PRIORITY,
        message: "invalidated all attributes for ".concat(this.id)
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          data = _ref7.data,
          numInstances = _ref7.numInstances,
          bufferLayout = _ref7.bufferLayout,
          transitions = _ref7.transitions,
          _ref7$props = _ref7.props,
          props = _ref7$props === void 0 ? {} : _ref7$props,
          _ref7$buffers = _ref7.buffers,
          buffers = _ref7$buffers === void 0 ? {} : _ref7$buffers,
          _ref7$context = _ref7.context,
          context = _ref7$context === void 0 ? {} : _ref7$context;

      var updated = false;
      logFunctions.onUpdateStart({
        level: LOG_START_END_PRIORITY,
        id: this.id,
        numInstances: numInstances
      });

      if (this.stats) {
        this.stats.get('Update Attributes').timeStart();
      }

      for (var attributeName in this.attributes) {
        var attribute = this.attributes[attributeName];

        if (attribute.setExternalBuffer(buffers[attributeName], this.numInstances)) {} else if (attribute.setGenericValue(props[attribute.getAccessor()])) {} else if (attribute.needsUpdate()) {
          updated = true;

          this._updateAttribute({
            attribute: attribute,
            numInstances: numInstances,
            bufferLayout: bufferLayout,
            data: data,
            props: props,
            context: context
          });
        }

        this.needsRedraw |= attribute.needsRedraw();
      }

      if (updated) {
        logFunctions.onUpdateEnd({
          level: LOG_START_END_PRIORITY,
          id: this.id,
          numInstances: numInstances
        });
      }

      if (this.stats) {
        this.stats.get('Update Attributes').timeEnd();
      }

      this.attributeTransitionManager.update({
        attributes: this.attributes,
        numInstances: numInstances,
        transitions: transitions
      });
    }
  }, {
    key: "updateTransition",
    value: function updateTransition(timestamp) {
      var attributeTransitionManager = this.attributeTransitionManager;
      var transitionUpdated = attributeTransitionManager.setCurrentTime(timestamp);
      this.needsRedraw = this.needsRedraw || transitionUpdated;
      return transitionUpdated;
    }
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      return this.attributes;
    }
  }, {
    key: "getChangedAttributes",
    value: function getChangedAttributes() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        clearChangedFlags: false
      };
      var attributes = this.attributes,
          attributeTransitionManager = this.attributeTransitionManager;
      var changedAttributes = Object.assign({}, attributeTransitionManager.getAttributes());

      for (var attributeName in attributes) {
        var attribute = attributes[attributeName];

        if (attribute.needsRedraw(opts) && !attributeTransitionManager.hasAttribute(attributeName)) {
          changedAttributes[attributeName] = attribute;
        }
      }

      return changedAttributes;
    }
  }, {
    key: "getAccessors",
    value: function getAccessors() {
      return this.updateTriggers;
    }
  }, {
    key: "_add",
    value: function _add(attributes, updaters) {
      var extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (updaters) {
        log.warn('AttributeManager.add({updaters}) - updater map no longer supported')();
      }

      var newAttributes = {};

      for (var attributeName in attributes) {
        var attribute = attributes[attributeName];

        var newAttribute = this._createAttribute(attributeName, attribute, extraProps);

        newAttributes[attributeName] = newAttribute;
      }

      Object.assign(this.attributes, newAttributes);

      this._mapUpdateTriggersToAttributes();
    }
  }, {
    key: "_createAttribute",
    value: function _createAttribute(name, attribute, extraProps) {
      var props = {
        id: name,
        constant: attribute.constant || false,
        isIndexed: attribute.isIndexed || attribute.elements,
        size: attribute.elements && 1 || attribute.size,
        value: attribute.value || null,
        divisor: attribute.instanced || extraProps.instanced ? 1 : attribute.divisor
      };
      return new Attribute(this.gl, Object.assign({}, attribute, props));
    }
  }, {
    key: "_mapUpdateTriggersToAttributes",
    value: function _mapUpdateTriggersToAttributes() {
      var _this = this;

      var triggers = {};

      var _loop = function _loop(attributeName) {
        var attribute = _this.attributes[attributeName];
        attribute.getUpdateTriggers().forEach(function (triggerName) {
          if (!triggers[triggerName]) {
            triggers[triggerName] = [];
          }

          triggers[triggerName].push(attributeName);
        });
      };

      for (var attributeName in this.attributes) {
        _loop(attributeName);
      }

      this.updateTriggers = triggers;
    }
  }, {
    key: "_invalidateTrigger",
    value: function _invalidateTrigger(triggerName, dataRange) {
      var attributes = this.attributes,
          updateTriggers = this.updateTriggers;
      var invalidatedAttributes = updateTriggers[triggerName];

      if (invalidatedAttributes) {
        invalidatedAttributes.forEach(function (name) {
          var attribute = attributes[name];

          if (attribute) {
            attribute.setNeedsUpdate(attribute.id, dataRange);
          }
        });
      } else {
        var message = "invalidating non-existent trigger ".concat(triggerName, " for ").concat(this.id, "\n");
        message += "Valid triggers: ".concat(Object.keys(attributes).join(', '));
        log.warn(message, invalidatedAttributes)();
      }

      return invalidatedAttributes;
    }
  }, {
    key: "_updateAttribute",
    value: function _updateAttribute(opts) {
      var attribute = opts.attribute,
          numInstances = opts.numInstances;

      if (attribute.allocate(numInstances)) {
        logFunctions.onUpdate({
          level: LOG_DETAIL_PRIORITY,
          message: "".concat(attribute.id, " allocated ").concat(numInstances),
          id: this.id
        });
      }

      var timeStart = Date.now();
      var updated = attribute.updateBuffer(opts);

      if (updated) {
        this.needsRedraw = true;
        var timeMs = Math.round(Date.now() - timeStart);
        logFunctions.onUpdate({
          level: LOG_DETAIL_PRIORITY,
          message: "".concat(attribute.id, " updated ").concat(numInstances, " in ").concat(timeMs, "ms")
        });
      }
    }
  }]);

  return AttributeManager;
}();

export { AttributeManager as default };
//# sourceMappingURL=attribute-manager.js.map