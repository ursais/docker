"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProps = createProps;

var _seerIntegration = require("../lib/seer-integration");

var _log = _interopRequireDefault(require("../utils/log"));

var _propTypes = require("./prop-types");

function createProps() {
  var component = this;
  var propTypeDefs = getPropsPrototypeAndTypes(component.constructor);
  var propsPrototype = propTypeDefs.defaultProps;
  var propsInstance = Object.create(propsPrototype, {
    _component: {
      enumerable: false,
      value: component
    },
    _asyncPropOriginalValues: {
      enumerable: false,
      value: {}
    },
    _asyncPropResolvedValues: {
      enumerable: false,
      value: {}
    }
  });

  for (var i = 0; i < arguments.length; ++i) {
    Object.assign(propsInstance, arguments[i]);
  }

  var layerName = component.constructor.layerName;
  var deprecatedProps = propTypeDefs.deprecatedProps;
  checkDeprecatedProps(layerName, propsInstance, deprecatedProps);
  checkDeprecatedProps(layerName, propsInstance.updateTriggers, deprecatedProps);
  checkDeprecatedProps(layerName, propsInstance.transitions, deprecatedProps);
  (0, _seerIntegration.applyPropOverrides)(propsInstance);
  Object.freeze(propsInstance);
  return propsInstance;
}

function checkDeprecatedProps(layerName, propsInstance, deprecatedProps) {
  if (!propsInstance) {
    return;
  }

  for (var name in deprecatedProps) {
    if (hasOwnProperty(propsInstance, name)) {
      var nameStr = "".concat(layerName || 'Layer', ": ").concat(name);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = deprecatedProps[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var newPropName = _step.value;

          if (!hasOwnProperty(propsInstance, newPropName)) {
            propsInstance[newPropName] = propsInstance[name];
          }
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

      _log.default.deprecated(nameStr, deprecatedProps[name].join('/'))();
    }
  }
}

function getPropsPrototypeAndTypes(componentClass) {
  var props = getOwnProperty(componentClass, '_mergedDefaultProps');

  if (props) {
    return {
      defaultProps: props,
      propTypes: getOwnProperty(componentClass, '_propTypes'),
      deprecatedProps: getOwnProperty(componentClass, '_deprecatedProps')
    };
  }

  return createPropsPrototypeAndTypes(componentClass);
}

function createPropsPrototypeAndTypes(componentClass) {
  var parent = componentClass.prototype;

  if (!parent) {
    return {
      defaultProps: {}
    };
  }

  var parentClass = Object.getPrototypeOf(componentClass);
  var parentPropDefs = parent && getPropsPrototypeAndTypes(parentClass) || null;
  var componentDefaultProps = getOwnProperty(componentClass, 'defaultProps') || {};
  var componentPropDefs = (0, _propTypes.parsePropTypes)(componentDefaultProps);
  var propTypes = Object.assign({}, parentPropDefs && parentPropDefs.propTypes, componentPropDefs.propTypes);
  var defaultProps = createPropsPrototype(componentPropDefs.defaultProps, parentPropDefs && parentPropDefs.defaultProps, propTypes, componentClass);
  var deprecatedProps = Object.assign({}, parentPropDefs && parentPropDefs.deprecatedProps, componentPropDefs.deprecatedProps);
  componentClass._mergedDefaultProps = defaultProps;
  componentClass._propTypes = propTypes;
  componentClass._deprecatedProps = deprecatedProps;
  return {
    propTypes: propTypes,
    defaultProps: defaultProps,
    deprecatedProps: deprecatedProps
  };
}

function createPropsPrototype(props, parentProps, propTypes, componentClass) {
  var defaultProps = Object.create(null);
  Object.assign(defaultProps, parentProps, props);
  var id = getComponentName(componentClass);
  delete props.id;
  Object.defineProperties(defaultProps, {
    id: {
      configurable: false,
      writable: true,
      value: id
    }
  });
  addAsyncPropsToPropPrototype(defaultProps, propTypes);
  return defaultProps;
}

function addAsyncPropsToPropPrototype(defaultProps, propTypes) {
  var defaultValues = {};
  var descriptors = {
    _asyncPropDefaultValues: {
      enumerable: false,
      value: defaultValues
    },
    _asyncPropOriginalValues: {
      enumerable: false,
      value: {}
    }
  };

  for (var propName in propTypes) {
    var propType = propTypes[propName];
    var name = propType.name,
        value = propType.value;

    if (propType.async) {
      defaultValues[name] = value;
      descriptors[name] = getDescriptorForAsyncProp(name, value);
    }
  }

  Object.defineProperties(defaultProps, descriptors);
}

function getDescriptorForAsyncProp(name) {
  return {
    configurable: false,
    enumerable: true,
    set: function set(newValue) {
      if (typeof newValue === 'string' || newValue instanceof Promise) {
        this._asyncPropOriginalValues[name] = newValue;
      } else {
        this._asyncPropResolvedValues[name] = newValue;
      }
    },
    get: function get() {
      if (this._asyncPropResolvedValues) {
        if (name in this._asyncPropResolvedValues) {
          var value = this._asyncPropResolvedValues[name];

          if (name === 'data') {
            return value || this._asyncPropDefaultValues[name];
          }

          return value;
        }

        if (name in this._asyncPropOriginalValues) {
          var state = this._component && this._component.internalState;

          if (state && state.hasAsyncProp(name)) {
            return state.getAsyncProp(name);
          }
        }
      }

      return this._asyncPropDefaultValues[name];
    }
  };
}

function hasOwnProperty(object, prop) {
  return Object.prototype.hasOwnProperty.call(object, prop);
}

function getOwnProperty(object, prop) {
  return hasOwnProperty(object, prop) && object[prop];
}

function getComponentName(componentClass) {
  var componentName = getOwnProperty(componentClass, 'layerName') || getOwnProperty(componentClass, 'componentName');

  if (!componentName) {
    _log.default.once(0, "".concat(componentClass.name, ".componentName not specified"))();
  }

  return componentName || componentClass.name;
}
//# sourceMappingURL=create-props.js.map