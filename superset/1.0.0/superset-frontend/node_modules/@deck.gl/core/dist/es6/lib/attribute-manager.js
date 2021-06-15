import Attribute from './attribute';
import log from '../utils/log';
import AttributeTransitionManager from './attribute-transition-manager';
const LOG_START_END_PRIORITY = 2;
const LOG_DETAIL_PRIORITY = 3;

function noop() {}

const logFunctions = {
  savedMessages: null,
  timeStart: null,
  onLog: (_ref) => {
    let level = _ref.level,
        message = _ref.message;
    log.log(level, message)();
  },
  onUpdateStart: (_ref2) => {
    let level = _ref2.level,
        numInstances = _ref2.numInstances;
    logFunctions.savedMessages = [];
    logFunctions.timeStart = new Date();
  },
  onUpdate: (_ref3) => {
    let level = _ref3.level,
        message = _ref3.message;

    if (logFunctions.savedMessages) {
      logFunctions.savedMessages.push(message);
    }
  },
  onUpdateEnd: (_ref4) => {
    let level = _ref4.level,
        id = _ref4.id,
        numInstances = _ref4.numInstances;
    const timeMs = Math.round(new Date() - logFunctions.timeStart);
    const time = `${timeMs}ms`;
    log.group(level, `Updated attributes for ${numInstances} instances in ${id} in ${time}`, {
      collapsed: true
    })();

    for (const message of logFunctions.savedMessages) {
      log.log(level, message)();
    }

    log.groupEnd(level, `Updated attributes for ${numInstances} instances in ${id} in ${time}`)();
    logFunctions.savedMessages = null;
  }
};
export default class AttributeManager {
  static setDefaultLogFunctions() {
    let _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
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

  constructor(gl) {
    let _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref6$id = _ref6.id,
        id = _ref6$id === void 0 ? 'attribute-manager' : _ref6$id,
        stats = _ref6.stats;

    this.id = id;
    this.gl = gl;
    this.attributes = {};
    this.updateTriggers = {};
    this.accessors = {};
    this.needsRedraw = true;
    this.userData = {};
    this.stats = stats;
    this.attributeTransitionManager = new AttributeTransitionManager(gl, {
      id: `${id}-transitions`
    });
    Object.seal(this);
  }

  finalize() {
    for (const attributeName in this.attributes) {
      this.attributes[attributeName].delete();
    }

    this.attributeTransitionManager.finalize();
  }

  getNeedsRedraw() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clearRedrawFlags: false
    };
    const redraw = this.needsRedraw;
    this.needsRedraw = this.needsRedraw && !opts.clearRedrawFlags;
    return redraw && this.id;
  }

  setNeedsRedraw() {
    let redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.needsRedraw = true;
    return this;
  }

  add(attributes, updaters) {
    this._add(attributes, updaters);
  }

  addInstanced(attributes, updaters) {
    this._add(attributes, updaters, {
      instanced: 1
    });
  }

  remove(attributeNameArray) {
    for (let i = 0; i < attributeNameArray.length; i++) {
      const name = attributeNameArray[i];

      if (this.attributes[name] !== undefined) {
        this.attributes[name].delete();
        delete this.attributes[name];
      }
    }
  }

  invalidate(triggerName, dataRange) {
    const invalidatedAttributes = this._invalidateTrigger(triggerName, dataRange);

    logFunctions.onLog({
      level: LOG_DETAIL_PRIORITY,
      message: `invalidated attributes ${invalidatedAttributes} (${triggerName}) for ${this.id}`
    });
  }

  invalidateAll(dataRange) {
    for (const attributeName in this.attributes) {
      this.attributes[attributeName].setNeedsUpdate(attributeName, dataRange);
    }

    logFunctions.onLog({
      level: LOG_DETAIL_PRIORITY,
      message: `invalidated all attributes for ${this.id}`
    });
  }

  update() {
    let _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
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

    let updated = false;
    logFunctions.onUpdateStart({
      level: LOG_START_END_PRIORITY,
      id: this.id,
      numInstances
    });

    if (this.stats) {
      this.stats.get('Update Attributes').timeStart();
    }

    for (const attributeName in this.attributes) {
      const attribute = this.attributes[attributeName];

      if (attribute.setExternalBuffer(buffers[attributeName], this.numInstances)) {} else if (attribute.setGenericValue(props[attribute.getAccessor()])) {} else if (attribute.needsUpdate()) {
        updated = true;

        this._updateAttribute({
          attribute,
          numInstances,
          bufferLayout,
          data,
          props,
          context
        });
      }

      this.needsRedraw |= attribute.needsRedraw();
    }

    if (updated) {
      logFunctions.onUpdateEnd({
        level: LOG_START_END_PRIORITY,
        id: this.id,
        numInstances
      });
    }

    if (this.stats) {
      this.stats.get('Update Attributes').timeEnd();
    }

    this.attributeTransitionManager.update({
      attributes: this.attributes,
      numInstances,
      transitions
    });
  }

  updateTransition(timestamp) {
    const attributeTransitionManager = this.attributeTransitionManager;
    const transitionUpdated = attributeTransitionManager.setCurrentTime(timestamp);
    this.needsRedraw = this.needsRedraw || transitionUpdated;
    return transitionUpdated;
  }

  getAttributes() {
    return this.attributes;
  }

  getChangedAttributes() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      clearChangedFlags: false
    };
    const attributes = this.attributes,
          attributeTransitionManager = this.attributeTransitionManager;
    const changedAttributes = Object.assign({}, attributeTransitionManager.getAttributes());

    for (const attributeName in attributes) {
      const attribute = attributes[attributeName];

      if (attribute.needsRedraw(opts) && !attributeTransitionManager.hasAttribute(attributeName)) {
        changedAttributes[attributeName] = attribute;
      }
    }

    return changedAttributes;
  }

  getAccessors() {
    return this.updateTriggers;
  }

  _add(attributes, updaters) {
    let extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (updaters) {
      log.warn('AttributeManager.add({updaters}) - updater map no longer supported')();
    }

    const newAttributes = {};

    for (const attributeName in attributes) {
      const attribute = attributes[attributeName];

      const newAttribute = this._createAttribute(attributeName, attribute, extraProps);

      newAttributes[attributeName] = newAttribute;
    }

    Object.assign(this.attributes, newAttributes);

    this._mapUpdateTriggersToAttributes();
  }

  _createAttribute(name, attribute, extraProps) {
    const props = {
      id: name,
      constant: attribute.constant || false,
      isIndexed: attribute.isIndexed || attribute.elements,
      size: attribute.elements && 1 || attribute.size,
      value: attribute.value || null,
      divisor: attribute.instanced || extraProps.instanced ? 1 : attribute.divisor
    };
    return new Attribute(this.gl, Object.assign({}, attribute, props));
  }

  _mapUpdateTriggersToAttributes() {
    const triggers = {};

    for (const attributeName in this.attributes) {
      const attribute = this.attributes[attributeName];
      attribute.getUpdateTriggers().forEach(triggerName => {
        if (!triggers[triggerName]) {
          triggers[triggerName] = [];
        }

        triggers[triggerName].push(attributeName);
      });
    }

    this.updateTriggers = triggers;
  }

  _invalidateTrigger(triggerName, dataRange) {
    const attributes = this.attributes,
          updateTriggers = this.updateTriggers;
    const invalidatedAttributes = updateTriggers[triggerName];

    if (invalidatedAttributes) {
      invalidatedAttributes.forEach(name => {
        const attribute = attributes[name];

        if (attribute) {
          attribute.setNeedsUpdate(attribute.id, dataRange);
        }
      });
    } else {
      let message = `invalidating non-existent trigger ${triggerName} for ${this.id}\n`;
      message += `Valid triggers: ${Object.keys(attributes).join(', ')}`;
      log.warn(message, invalidatedAttributes)();
    }

    return invalidatedAttributes;
  }

  _updateAttribute(opts) {
    const attribute = opts.attribute,
          numInstances = opts.numInstances;

    if (attribute.allocate(numInstances)) {
      logFunctions.onUpdate({
        level: LOG_DETAIL_PRIORITY,
        message: `${attribute.id} allocated ${numInstances}`,
        id: this.id
      });
    }

    const timeStart = Date.now();
    const updated = attribute.updateBuffer(opts);

    if (updated) {
      this.needsRedraw = true;
      const timeMs = Math.round(Date.now() - timeStart);
      logFunctions.onUpdate({
        level: LOG_DETAIL_PRIORITY,
        message: `${attribute.id} updated ${numInstances} in ${timeMs}ms`
      });
    }
  }

}
//# sourceMappingURL=attribute-manager.js.map