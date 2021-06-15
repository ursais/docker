import getTextDimension from './getTextDimension';

function decreaseSizeUntil(startSize, computeDimension, condition) {
  let size = startSize;
  let dimension = computeDimension(size);

  while (!condition(dimension)) {
    size -= 1;
    dimension = computeDimension(size);
  }

  return size;
}

export default function computeMaxFontSize(input) {
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
    return getTextDimension({ ...rest,
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