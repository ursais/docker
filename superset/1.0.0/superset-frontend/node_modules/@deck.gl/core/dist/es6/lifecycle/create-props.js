import { applyPropOverrides } from '../lib/seer-integration';
import log from '../utils/log';
import { parsePropTypes } from './prop-types';
export function createProps() {
  const component = this;
  const propTypeDefs = getPropsPrototypeAndTypes(component.constructor);
  const propsPrototype = propTypeDefs.defaultProps;
  const propsInstance = Object.create(propsPrototype, {
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

  for (let i = 0; i < arguments.length; ++i) {
    Object.assign(propsInstance, arguments[i]);
  }

  const layerName = component.constructor.layerName;
  const deprecatedProps = propTypeDefs.deprecatedProps;
  checkDeprecatedProps(layerName, propsInstance, deprecatedProps);
  checkDeprecatedProps(layerName, propsInstance.updateTriggers, deprecatedProps);
  checkDeprecatedProps(layerName, propsInstance.transitions, deprecatedProps);
  applyPropOverrides(propsInstance);
  Object.freeze(propsInstance);
  return propsInstance;
}

function checkDeprecatedProps(layerName, propsInstance, deprecatedProps) {
  if (!propsInstance) {
    return;
  }

  for (const name in deprecatedProps) {
    if (hasOwnProperty(propsInstance, name)) {
      const nameStr = `${layerName || 'Layer'}: ${name}`;

      for (const newPropName of deprecatedProps[name]) {
        if (!hasOwnProperty(propsInstance, newPropName)) {
          propsInstance[newPropName] = propsInstance[name];
        }
      }

      log.deprecated(nameStr, deprecatedProps[name].join('/'))();
    }
  }
}

function getPropsPrototypeAndTypes(componentClass) {
  const props = getOwnProperty(componentClass, '_mergedDefaultProps');

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
  const parent = componentClass.prototype;

  if (!parent) {
    return {
      defaultProps: {}
    };
  }

  const parentClass = Object.getPrototypeOf(componentClass);
  const parentPropDefs = parent && getPropsPrototypeAndTypes(parentClass) || null;
  const componentDefaultProps = getOwnProperty(componentClass, 'defaultProps') || {};
  const componentPropDefs = parsePropTypes(componentDefaultProps);
  const propTypes = Object.assign({}, parentPropDefs && parentPropDefs.propTypes, componentPropDefs.propTypes);
  const defaultProps = createPropsPrototype(componentPropDefs.defaultProps, parentPropDefs && parentPropDefs.defaultProps, propTypes, componentClass);
  const deprecatedProps = Object.assign({}, parentPropDefs && parentPropDefs.deprecatedProps, componentPropDefs.deprecatedProps);
  componentClass._mergedDefaultProps = defaultProps;
  componentClass._propTypes = propTypes;
  componentClass._deprecatedProps = deprecatedProps;
  return {
    propTypes,
    defaultProps,
    deprecatedProps
  };
}

function createPropsPrototype(props, parentProps, propTypes, componentClass) {
  const defaultProps = Object.create(null);
  Object.assign(defaultProps, parentProps, props);
  const id = getComponentName(componentClass);
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
  const defaultValues = {};
  const descriptors = {
    _asyncPropDefaultValues: {
      enumerable: false,
      value: defaultValues
    },
    _asyncPropOriginalValues: {
      enumerable: false,
      value: {}
    }
  };

  for (const propName in propTypes) {
    const propType = propTypes[propName];
    const name = propType.name,
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

    set(newValue) {
      if (typeof newValue === 'string' || newValue instanceof Promise) {
        this._asyncPropOriginalValues[name] = newValue;
      } else {
        this._asyncPropResolvedValues[name] = newValue;
      }
    },

    get() {
      if (this._asyncPropResolvedValues) {
        if (name in this._asyncPropResolvedValues) {
          const value = this._asyncPropResolvedValues[name];

          if (name === 'data') {
            return value || this._asyncPropDefaultValues[name];
          }

          return value;
        }

        if (name in this._asyncPropOriginalValues) {
          const state = this._component && this._component.internalState;

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
  const componentName = getOwnProperty(componentClass, 'layerName') || getOwnProperty(componentClass, 'componentName');

  if (!componentName) {
    log.once(0, `${componentClass.name}.componentName not specified`)();
  }

  return componentName || componentClass.name;
}
//# sourceMappingURL=create-props.js.map