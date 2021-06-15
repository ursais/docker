function padArrayChunk(_ref) {
  let source = _ref.source,
      target = _ref.target,
      _ref$start = _ref.start,
      start = _ref$start === void 0 ? 0 : _ref$start,
      end = _ref.end,
      getData = _ref.getData;
  end = end || target.length;
  const sourceLength = source.length;
  const targetLength = end - start;

  if (sourceLength > targetLength) {
    target.set(source.subarray(0, targetLength), start);
    return;
  }

  target.set(source, start);

  if (!getData) {
    return;
  }

  let i = sourceLength;

  while (i < targetLength) {
    const datum = getData(i, source);

    for (let j = 0; j < datum.length; j++) {
      target[start + i] = datum[j];
      i++;
    }
  }
}

export function padArray(_ref2) {
  let source = _ref2.source,
      target = _ref2.target,
      size = _ref2.size,
      getData = _ref2.getData,
      sourceLayout = _ref2.sourceLayout,
      targetLayout = _ref2.targetLayout;

  if (!Array.isArray(targetLayout)) {
    padArrayChunk({
      source,
      target,
      getData
    });
    return target;
  }

  let sourceIndex = 0;
  let targetIndex = 0;

  const getChunkData = getData && ((i, chunk) => getData(i + targetIndex, chunk));

  const n = Math.min(sourceLayout.length, targetLayout.length);

  for (let i = 0; i < n; i++) {
    const sourceChunkLength = sourceLayout[i] * size;
    const targetChunkLength = targetLayout[i] * size;
    padArrayChunk({
      source: source.subarray(sourceIndex, sourceIndex + sourceChunkLength),
      target,
      start: targetIndex,
      end: targetIndex + targetChunkLength,
      getData: getChunkData
    });
    sourceIndex += sourceChunkLength;
    targetIndex += targetChunkLength;
  }

  if (targetIndex < target.length) {
    padArrayChunk({
      source: [],
      target,
      start: targetIndex,
      getData: getChunkData
    });
  }

  return target;
}
//# sourceMappingURL=array-utils.js.map