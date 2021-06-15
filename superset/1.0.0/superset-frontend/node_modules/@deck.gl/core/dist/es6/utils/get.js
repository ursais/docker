export function get(container, compositeKey) {
  const keyList = getKeys(compositeKey);
  let value = container;

  for (const key of keyList) {
    if (!isObject(value)) {
      return undefined;
    }

    const getter = getGetter(value);
    value = getter(value, key);
  }

  return value;
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

const squareBracketGetter = (container, key) => container[key];

const getMethodGetter = (obj, key) => obj.get(key);

const keyMap = {};

function getGetter(container) {
  const prototype = Object.getPrototypeOf(container);
  return prototype.get ? getMethodGetter : squareBracketGetter;
}

function getKeys(compositeKey) {
  if (typeof compositeKey === 'string') {
    let keyList = keyMap[compositeKey];

    if (!keyList) {
      keyList = compositeKey.split('.');
      keyMap[compositeKey] = keyList;
    }

    return keyList;
  }

  return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
}
//# sourceMappingURL=get.js.map