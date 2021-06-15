import { Buffer, Transform } from '@luma.gl/core';
import { getShaders, getBuffers, padBuffer } from './attribute-transition-utils';
import Attribute from './attribute';
import BaseAttribute from './base-attribute';
import Transition from '../transitions/transition';
import log from '../utils/log';
import assert from '../utils/assert';

const noop = () => {};

const DEFAULT_TRANSITION_SETTINGS = {
  duration: 0,
  easing: t => t,
  onStart: noop,
  onEnd: noop,
  onInterrupt: noop
};
export default class AttributeTransitionManager {
  constructor(gl, _ref) {
    let id = _ref.id;
    this.id = id;
    this.gl = gl;
    this.attributeTransitions = {};
    this.needsRedraw = false;
    this.transform = null;
    this.numInstances = 0;

    if (Transform.isSupported(gl)) {
      this.isSupported = true;
    } else if (gl) {
      log.warn('WebGL2 not supported by this browser. Transition animation is disabled.')();
    }
  }

  finalize() {
    if (this.transform) {
      this.transform.delete();
    }

    for (const attributeName in this.attributeTransitions) {
      this._removeTransition(attributeName);
    }
  }

  update(_ref2) {
    let attributes = _ref2.attributes,
        _ref2$transitions = _ref2.transitions,
        transitions = _ref2$transitions === void 0 ? {} : _ref2$transitions,
        numInstances = _ref2.numInstances;
    this.opts = transitions;
    this.numInstances = numInstances || 1;

    if (!this.isSupported) {
      return;
    }

    const attributeTransitions = this.attributeTransitions;
    const changedTransitions = {};

    for (const attributeName in attributes) {
      const hasChanged = this._updateAttribute(attributeName, attributes[attributeName]);

      if (hasChanged) {
        changedTransitions[attributeName] = attributeTransitions[attributeName];
      }
    }

    for (const attributeName in attributeTransitions) {
      const attribute = attributes[attributeName];

      if (!attribute || !attribute.supportsTransition()) {
        this._removeTransition(attributeName);
      }
    }

    if (!this.transform) {
      this._createModel();
    } else if (this.transform) {
      const _getBuffers = getBuffers(changedTransitions),
            sourceBuffers = _getBuffers.sourceBuffers,
            feedbackBuffers = _getBuffers.feedbackBuffers;

      this.transform.update({
        elementCount: this.numInstances,
        sourceBuffers,
        feedbackBuffers
      });
    }
  }

  hasAttribute(attributeName) {
    return attributeName in this.attributeTransitions;
  }

  getAttributes() {
    const animatedAttributes = {};

    for (const attributeName in this.attributeTransitions) {
      const transition = this.attributeTransitions[attributeName];

      if (transition.buffer) {
        animatedAttributes[attributeName] = transition.attributeInTransition;
      }
    }

    return animatedAttributes;
  }

  setCurrentTime(currentTime) {
    if (!this.transform || this.numInstances === 0) {
      return false;
    }

    const uniforms = {};
    let needsRedraw = this.needsRedraw;
    this.needsRedraw = false;

    for (const attributeName in this.attributeTransitions) {
      const transition = this.attributeTransitions[attributeName];
      const updated = transition.update(currentTime);

      if (updated) {
        uniforms[`${attributeName}Time`] = transition.time;
        needsRedraw = true;
      }
    }

    if (needsRedraw) {
      this.transform.run({
        uniforms
      });
    }

    return needsRedraw;
  }

  _createTransition(attributeName, attribute) {
    let transition = this.attributeTransitions[attributeName];

    if (!transition) {
      transition = new Transition({
        name: attributeName,
        attribute,
        attributeInTransition: new Attribute(this.gl, attribute),
        bufferLayout: attribute.bufferLayout
      });
      this.attributeTransitions[attributeName] = transition;

      this._invalidateModel();

      return transition;
    }

    return null;
  }

  _removeTransition(attributeName) {
    const transition = this.attributeTransitions[attributeName];

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

  _updateAttribute(attributeName, attribute) {
    const settings = attribute.getTransitionSetting(this.opts);

    if (settings) {
      let hasChanged;
      let transition = this.attributeTransitions[attributeName];

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

  _invalidateModel() {
    if (this.transform) {
      this.transform.delete();
      this.transform = null;
    }
  }

  _createModel() {
    if (Object.keys(this.attributeTransitions).length === 0) {
      return;
    }

    this.transform = new Transform(this.gl, Object.assign({
      elementCount: this.numInstances
    }, getBuffers(this.attributeTransitions), getShaders(this.attributeTransitions)));
  }

  _getNextTransitionStates(transition, settings) {
    const attribute = transition.attribute;
    const size = attribute.size;
    let toState;

    if (attribute.constant) {
      toState = new BaseAttribute(this.gl, {
        constant: true,
        value: attribute.value,
        size
      });
    } else {
      toState = new BaseAttribute(this.gl, {
        constant: false,
        buffer: attribute.getBuffer(),
        divisor: 0,
        size,
        value: attribute.externalBuffer ? null : attribute.value
      });
    }

    const fromState = transition.buffer || toState;
    const toLength = this.numInstances * size;
    const fromLength = fromState instanceof Buffer && fromState.getElementCount() || toLength;
    let buffer = transition._swapBuffer;
    transition._swapBuffer = transition.buffer;

    if (!buffer) {
      buffer = new Buffer(this.gl, {
        data: new Float32Array(toLength),
        usage: 35050
      });
    } else if (buffer.getElementCount() < toLength) {
      buffer.setData({
        data: new Float32Array(toLength)
      });
    }

    transition.attributeInTransition.update({
      buffer
    });
    padBuffer({
      fromState,
      toState,
      fromLength,
      toLength,
      fromBufferLayout: transition.bufferLayout,
      toBufferLayout: attribute.bufferLayout,
      getData: settings.enter
    });
    transition.bufferLayout = attribute.bufferLayout;
    return {
      fromState,
      toState,
      buffer
    };
  }

  _triggerTransition(transition, settings) {
    assert(settings && settings.duration > 0);
    this.needsRedraw = true;
    const transitionSettings = Object.assign({}, DEFAULT_TRANSITION_SETTINGS, settings);
    transition.start(Object.assign({}, this._getNextTransitionStates(transition, settings), transitionSettings));
  }

}
//# sourceMappingURL=attribute-transition-manager.js.map