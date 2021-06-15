"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function get(container, compositeKey) {
  var keyList = getKeys(compositeKey);
  var value = container;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keyList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!isObject(value)) {
        return undefined;
      }

      var getter = getGetter(value);
      value = getter(value, key);
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

  return value;
}

function isObject(value) {
  return value !== null && (0, _typeof2.default)(value) === 'object';
}

var squareBracketGetter = function squareBracketGetter(container, key) {
  return container[key];
};

var getMethodGetter = function getMethodGetter(obj, key) {
  return obj.get(key);
};

var keyMap = {};

function getGetter(container) {
  var prototype = Object.getPrototypeOf(container);
  return prototype.get ? getMethodGetter : squareBracketGetter;
}

function getKeys(compositeKey) {
  if (typeof compositeKey === 'string') {
    var keyList = keyMap[compositeKey];

    if (!keyList) {
      keyList = compositeKey.split('.');
      keyMap[compositeKey] = keyList;
    }

    return keyList;
  }

  return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
}
//# sourceMappingURL=get.js.map