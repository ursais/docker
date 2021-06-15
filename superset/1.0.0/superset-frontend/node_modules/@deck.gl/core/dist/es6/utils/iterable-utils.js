const EMPTY_ARRAY = [];
const placeholderArray = [];
export function createIterable(data) {
  let startRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let endRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  let iterable = EMPTY_ARRAY;
  const objectInfo = {
    index: -1,
    data,
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
    iterable,
    objectInfo
  };
}
//# sourceMappingURL=iterable-utils.js.map