"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _core = require("@luma.gl/core");

var _attributeTransitionUtils = require("./attribute-transition-utils");

var _attribute = _interopRequireDefault(require("./attribute"));

var _baseAttribute = _interopRequireDefault(require("./base-attribute"));

var _transition = _interopRequireDefault(require("../transitions/transition"));

var _log = _interopRequireDefault(require("../utils/log"));

var _assert = _interopRequireDefault(require("../utils/assert"));

var noop = function noop() {};

var DEFAULT_TRANSITION_SETTINGS = {
  duration: 0,
  easing: function easing(t) {
    return t;
  },
  onStart: noop,
  onEnd: noop,
  onInterrupt: noop
};

var AttributeTransitionManager = function () {
  function AttributeTransitionManager(gl, _ref) {
    var id = _ref.id;
    (0, _classCallCheck2.default)(this, AttributeTransitionManager);
    this.id = id;
    this.gl = gl;
    this.attributeTransitions = {};
    this.needsRedraw = false;
    this.transform = null;
    this.numInstances = 0;

    if (_core.Transform.isSupported(gl)) {
      this.isSupported = true;
    } else if (gl) {
      _log.default.warn('WebGL2 not supported by this browser. Transition animation is disabled.')();
    }
  }

  (0, _createClass2.default)(AttributeTransitionManager, [{
    key: "finalize",
    value: function finalize() {
      if (this.transform) {
        this.transform.delete();
      }

      for (var attributeName in this.attributeTransitions) {
        this._removeTransition(attributeName);
      }
    }
  }, {
    key: "update",
    value: function update(_ref2) {
      var attributes = _ref2.attributes,
          _ref2$transitions = _ref2.transitions,
          transitions = _ref2$transitions === void 0 ? {} : _ref2$transitions,
          numInstances = _ref2.numInstances;
      this.opts = transitions;
      this.numInstances = numInstances || 1;

      if (!this.isSupported) {
        return;
      }

      var attributeTransitions = this.attributeTransitions;
      var changedTransitions = {};

      for (var attributeName in attributes) {
        var hasChanged = this._updateAttribute(attributeName, attributes[attributeName]);

        if (hasChanged) {
          changedTransitions[attributeName] = attributeTransitions[attributeName];
        }
      }

      for (var _attributeName in attributeTransitions) {
        var attribute = attributes[_attributeName];

        if (!attribute || !attribute.supportsTransition()) {
          this._removeTransition(_attributeName);
        }
      }

      if (!this.transform) {
        this._createModel();
      } else if (this.transform) {
        var _getBuffers = (0, _attributeTransitionUtils.getBuffers)(changedTransitions),
            sourceBuffers = _getBuffers.sourceBuffers,
            feedbackBuffers = _getBuffers.feedbackBuffers;

        this.transform.update({
          elementCount: this.numInstances,
          sourceBuffers: sourceBuffers,
          feedbackBuffers: feedbackBuffers
        });
      }
    }
  }, {
    key: "hasAttribute",
    value: function hasAttribute(attributeName) {
      return attributeName in this.attributeTransitions;
    }
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      var animatedAttributes = {};

      for (var attributeName in this.attributeTransitions) {
        var transition = this.attributeTransitions[attributeName];

        if (transition.buffer) {
          animatedAttributes[attributeName] = transition.attributeInTransition;
        }
      }

      return animatedAttributes;
    }
  }, {
    key: "setCurrentTime",
    value: function setCurrentTime(currentTime) {
      if (!this.transform || this.numInstances === 0) {
        return false;
      }

      var uniforms = {};
      var needsRedraw = this.needsRedraw;
      this.needsRedraw = false;

      for (var attributeName in this.attributeTransitions) {
        var transition = this.attributeTransitions[attributeName];
        var updated = transition.update(currentTime);

        if (updated) {
          uniforms["".concat(attributeName, "Time")] = transition.time;
          needsRedraw = true;
        }
      }

      if (needsRedraw) {
        this.transform.run({
          uniforms: uniforms
        });
      }

      return needsRedraw;
    }
  }, {
    key: "_createTransition",
    value: function _createTransition(attributeName, attribute) {
      var transition = this.attributeTransitions[attributeName];

      if (!transition) {
        transition = new _transition.default({
          name: attributeName,
          attribute: attribute,
          attributeInTransition: new _attribute.default(this.gl, attribute),
          bufferLayout: attribute.bufferLayout
        });
        this.attributeTransitions[attributeName] = transition;

        this._invalidateModel();

        return transition;
      }

      return null;
    }
  }, {
    key: "_removeTransition",
    value: function _removeTransition(attributeName) {
      var transition = this.attributeTransitions[attributeName];

      if (transition) {
        if (transition.buffer) {
          transition.buffer.delete();
        }

        if (transition._swapBuffer) {
          transition._swapBuffer.delete();
        }

        delete this.attributeTransitions[attributeName];

        this._invalidateModel();
      }
    }
  }, {
    key: "_updateAttribute",
    value: function _updateAttribute(attributeName, attribute) {
      var settings = attribute.getTransitionSetting(this.opts);

      if (settings) {
        var hasChanged;
        var transition = this.attributeTransitions[attributeName];

        if (transition) {
          hasChanged = attribute.needsRedraw();
        } else {
          transition = this._createTransition(attributeName, attribute);
          hasChanged = true;
        }

        if (hasChanged) {
          this._triggerTransition(transition, settings);

          return true;
        }
      }

      return false;
    }
  }, {
    key: "_invalidateModel",
    value: function _invalidateModel() {
      if (this.transform) {
        this.transform.delete();
        this.transform = null;
      }
    }
  }, {
    key: "_createModel",
    value: function _createModel() {
      if (Object.keys(this.attributeTransitions).length === 0) {
        return;
      }

      this.transform = new _core.Transform(this.gl, Object.assign({
        elementCount: this.numInstances
      }, (0, _attributeTransitionUtils.getBuffers)(this.attributeTransitions), (0, _attributeTransitionUtils.getShaders)(this.attributeTransitions)));
    }
  }, {
    key: "_getNextTransitionStates",
    value: function _getNextTransitionStates(transition, settings) {
      var attribute = transition.attribute;
      var size = attribute.size;
      var toState;

      if (attribute.constant) {
        toState = new _baseAttribute.default(this.gl, {
          constant: true,
          value: attribute.value,
          size: size
        });
      } else {
        toState = new _baseAttribute.default(this.gl, {
          constant: false,
          buffer: attribute.getBuffer(),
          divisor: 0,
          size: size,
          value: attribute.externalBuffer ? null : attribute.value
        });
      }

      var fromState = transition.buffer || toState;
      var toLength = this.numInstances * size;
      var fromLength = fromState instanceof _core.Buffer && fromState.getElementCount() || toLength;
      var buffer = transition._swapBuffer;
      transition._swapBuffer = transition.buffer;

      if (!buffer) {
        buffer = new _core.Buffer(this.gl, {
          data: new Float32Array(toLength),
          usage: 35050
        });
      } else if (buffer.getElementCount() < toLength) {
        buffer.setData({
          data: new Float32Array(toLength)
        });
      }

      transition.attributeInTransition.update({
        buffer: buffer
      });
      (0, _attributeTransitionUtils.padBuffer)({
        fromState: fromState,
        toState: toState,
        fromLength: fromLength,
        toLength: toLength,
        fromBufferLayout: transition.bufferLayout,
        toBufferLayout: attribute.bufferLayout,
        getData: settings.enter
      });
      transition.bufferLayout = attribute.bufferLayout;
      return {
        fromState: fromState,
        toState: toState,
        buffer: buffer
      };
    }
  }, {
    key: "_triggerTransition",
    value: function _triggerTransition(transition, settings) {
      (0, _assert.default)(settings && settings.duration > 0);
      this.needsRedraw = true;
      var transitionSettings = Object.assign({}, DEFAULT_TRANSITION_SETTINGS, settings);
      transition.start(Object.assign({}, this._getNextTransitionStates(transition, settings), transitionSettings));
    }
  }]);
  return AttributeTransitionManager;
}();

exports.default = AttributeTransitionManager;
//# sourceMappingURL=attribute-transition-manager.js.map