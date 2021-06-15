"use strict";

exports.__esModule = true;
exports.default = computeMaxFontSize;

var _getTextDimension = _interopRequireDefault(require("./getTextDimension"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function decreaseSizeUntil(startSize, computeDimension, condition) {
  let size = startSize;
  let dimension = computeDimension(size);

  while (!condition(dimension)) {
    size -= 1;
    dimension = computeDimension(size);
  }

  return size;
}

function computeMaxFontSize(input) {
  const {
    idealFontSize,
    maxWidth,
    maxHeight,
    style,
    ...rest
  } = input;
  let size;

  if (idealFontSize !== undefined && idealFontSize !== null) {
    size = idealFontSize;
  } else if (maxHeight === undefined || maxHeight === null) {
    throw new Error('You must specify at least one of maxHeight or idealFontSize');
  } else {
    size = Math.floor(maxHeight);
  }

  function computeDimension(fontSize) {
    return (0, _getTextDimension.default)({ ...rest,
      style: { ...style,
        fontSize: `${fontSize}px`
      }
    });
  }

  if (maxWidth !== undefined && maxWidth !== null) {
    size = decreaseSizeUntil(size, computeDimension, dim => dim.width <= maxWidth);
  }

  if (maxHeight !== undefined && maxHeight !== null) {
    size = decreaseSizeUntil(size, computeDimension, dim => dim.height <= maxHeight);
  }

  return size;
}