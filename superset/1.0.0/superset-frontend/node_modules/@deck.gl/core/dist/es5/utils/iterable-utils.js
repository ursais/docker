"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIterable = createIterable;
var EMPTY_ARRAY = [];
var placeholderArray = [];

function createIterable(data) {
  var startRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var endRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var iterable = EMPTY_ARRAY;
  var objectInfo = {
    index: -1,
    data: data,
    target: []
  };

  if (!data) {
    iterable = EMPTY_ARRAY;
  } else if (typeof data[Symbol.iterator] === 'function') {
    iterable = data;
  } else if (data.length > 0) {
    placeholderArray.length = data.length;
    iterable = placeholderArray;
  }

  if (startRow > 0 || Number.isFinite(endRow)) {
    iterable = (Array.isArray(iterable) ? iterable : Array.from(iterable)).slice(startRow, endRow);
    objectInfo.index = startRow - 1;
  }

  return {
    iterable: iterable,
    objectInfo: objectInfo
  };
}
//# sourceMappingURL=iterable-utils.js.map