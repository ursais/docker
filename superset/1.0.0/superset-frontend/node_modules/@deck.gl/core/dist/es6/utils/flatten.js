export function flatten(array) {
  let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$filter = _ref.filter,
      filter = _ref$filter === void 0 ? () => true : _ref$filter,
      _ref$map = _ref.map,
      map = _ref$map === void 0 ? x => x : _ref$map,
      _ref$result = _ref.result,
      result = _ref$result === void 0 ? [] : _ref$result;

  if (!Array.isArray(array)) {
    return filter(array) ? [map(array)] : [];
  }

  return flattenArray(array, filter, map, result);
}

function flattenArray(array, filter, map, result) {
  let index = -1;

  while (++index < array.length) {
    const value = array[index];

    if (Array.isArray(value)) {
      flattenArray(value, filter, map, result);
    } else if (filter(value)) {
      result.push(map(value));
    }
  }

  return result;
}

export function countVertices(nestedArray) {
  let count = 0;
  let index = -1;

  while (++index < nestedArray.length) {
    const value = nestedArray[index];

    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      count += countVertices(value);
    } else {
      count++;
    }
  }

  return count;
}
export function flattenVertices(nestedArray) {
  let _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$result = _ref2.result,
      result = _ref2$result === void 0 ? [] : _ref2$result,
      _ref2$dimensions = _ref2.dimensions,
      dimensions = _ref2$dimensions === void 0 ? 3 : _ref2$dimensions;

  let index = -1;
  let vertexLength = 0;

  while (++index < nestedArray.length) {
    const value = nestedArray[index];

    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      flattenVertices(value, {
        result,
        dimensions
      });
    } else {
      if (vertexLength < dimensions) {
        result.push(value);
        vertexLength++;
      }
    }
  }

  if (vertexLength > 0 && vertexLength < dimensions) {
    result.push(0);
  }

  return result;
}
export function fillArray(_ref3) {
  let target = _ref3.target,
      source = _ref3.source,
      _ref3$start = _ref3.start,
      start = _ref3$start === void 0 ? 0 : _ref3$start,
      _ref3$count = _ref3.count,
      count = _ref3$count === void 0 ? 1 : _ref3$count;
  const length = source.length;
  const total = count * length;
  let copied = 0;

  for (let i = start; copied < length; copied++) {
    target[i++] = source[copied];
  }

  while (copied < total) {
    if (copied < total - copied) {
      target.copyWithin(start + copied, start, start + copied);
      copied *= 2;
    } else {
      target.copyWithin(start + copied, start, start + total - copied);
      copied = total;
    }
  }

  return target;
}
//# sourceMappingURL=flatten.js.map