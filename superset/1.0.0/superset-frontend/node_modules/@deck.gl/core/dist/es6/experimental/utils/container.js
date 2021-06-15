import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
const ERR_NOT_CONTAINER = 'Expected a container';
const ERR_NOT_KEYED_CONTAINER = 'Expected a "keyed" container';
export function isObject(value) {
  return value !== null && typeof value === 'object';
}
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && value.constructor === Object;
}
export function isContainer(value) {
  return Array.isArray(value) || ArrayBuffer.isView(value) || isObject(value);
}
export function count(container) {
  if (typeof container.count === 'function') {
    return container.count();
  }

  if (Number.isFinite(container.size)) {
    return container.size;
  }

  if (Number.isFinite(container.length)) {
    return container.length;
  }

  if (isPlainObject(container)) {
    return Object.keys(container).length;
  }

  throw new Error(ERR_NOT_CONTAINER);
}
export function values(container) {
  if (Array.isArray(container)) {
    return container;
  }

  const prototype = Object.getPrototypeOf(container);

  if (typeof prototype.values === 'function') {
    return container.values();
  }

  if (typeof container.constructor.values === 'function') {
    return container.constructor.values(container);
  }

  const iterator = container[Symbol.iterator];

  if (iterator) {
    return container;
  }

  throw new Error(ERR_NOT_CONTAINER);
}
export function isKeyedContainer(container) {
  if (Array.isArray(container)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(container);

  if (typeof prototype.shift === 'function') {
    return false;
  }

  const hasKeyedMethods = typeof prototype.get === 'function';
  return hasKeyedMethods || isPlainObject(container);
}
export function keys(keyedContainer) {
  const prototype = Object.getPrototypeOf(keyedContainer);

  if (typeof prototype.keys === 'function') {
    return keyedContainer.keys();
  }

  if (typeof keyedContainer.constructor.keys === 'function') {
    return keyedContainer.constructor.keys(keyedContainer);
  }

  throw new Error(ERR_NOT_KEYED_CONTAINER);
}
export function entries(keyedContainer) {
  const prototype = Object.getPrototypeOf(keyedContainer);

  if (typeof prototype.entries === 'function') {
    return keyedContainer.entries();
  }

  if (typeof keyedContainer.constructor.entries === 'function') {
    return keyedContainer.constructor.entries(keyedContainer);
  }

  return null;
}
export function forEach(container, visitor) {
  const prototype = Object.getPrototypeOf(container);

  if (prototype.forEach) {
    container.forEach(visitor);
    return;
  }

  const isKeyed = isKeyedContainer(container);

  if (isKeyed) {
    for (const _ref of entries(container)) {
      var _ref2 = _slicedToArray(_ref, 2);

      const key = _ref2[0];
      const value = _ref2[1];
      visitor(value, key, container);
    }

    return;
  }

  let index = 0;

  for (const element of values(container)) {
    visitor(element, index, container);
    index++;
  }
}
export function map(container, visitor) {
  const prototype = Object.getPrototypeOf(container);

  if (prototype.forEach) {
    const result = [];
    container.forEach((x, i, e) => result.push(visitor(x, i, e)));
    return result;
  }

  const isKeyed = isKeyedContainer(container);
  const result = [];

  if (isKeyed) {
    for (const _ref3 of entries(container)) {
      var _ref4 = _slicedToArray(_ref3, 2);

      const key = _ref4[0];
      const value = _ref4[1];
      result.push(visitor(value, key, container));
    }
  } else {
    let index = 0;

    for (const element of values(container)) {
      result.push(visitor(element, index, container));
      index++;
    }
  }

  return result;
}
export function reduce(container, visitor) {
  const prototype = Object.getPrototypeOf(container);

  if (prototype.forEach) {
    const result = [];
    container.forEach((x, i, e) => result.push(visitor(x, i, e)));
    return result;
  }

  const isKeyed = isKeyedContainer(container);
  const result = [];

  if (isKeyed) {
    for (const _ref5 of entries(container)) {
      var _ref6 = _slicedToArray(_ref5, 2);

      const key = _ref6[0];
      const value = _ref6[1];
      result.push(visitor(value, key, container));
    }
  } else {
    let index = 0;

    for (const element of values(container)) {
      result.push(visitor(element, index, container));
      index++;
    }
  }

  return result;
}
export function toJS(container) {
  if (!isObject(container)) {
    return container;
  }

  if (isKeyedContainer(container)) {
    const result = {};

    for (const _ref7 of entries(container)) {
      var _ref8 = _slicedToArray(_ref7, 2);

      const key = _ref8[0];
      const value = _ref8[1];
      result[key] = toJS(value);
    }

    return result;
  }

  const result = [];

  for (const value of values(container)) {
    result.push(toJS(value));
  }

  return result;
}
//# sourceMappingURL=container.js.map