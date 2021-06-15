"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padArray = padArray;

function padArrayChunk(_ref) {
  var source = _ref.source,
      target = _ref.target,
      _ref$start = _ref.start,
      start = _ref$start === void 0 ? 0 : _ref$start,
      end = _ref.end,
      getData = _ref.getData;
  end = end || target.length;
  var sourceLength = source.length;
  var targetLength = end - start;

  if (sourceLength > targetLength) {
    target.set(source.subarray(0, targetLength), start);
    return;
  }

  target.set(source, start);

  if (!getData) {
    return;
  }

  var i = sourceLength;

  while (i < targetLength) {
    var datum = getData(i, source);

    for (var j = 0; j < datum.length; j++) {
      target[start + i] = datum[j];
      i++;
    }
  }
}

function padArray(_ref2) {
  var source = _ref2.source,
      target = _ref2.target,
      size = _ref2.size,
      getData = _ref2.getData,
      sourceLayout = _ref2.sourceLayout,
      targetLayout = _ref2.targetLayout;

  if (!Array.isArray(targetLayout)) {
    padArrayChunk({
      source: source,
      target: target,
      getData: getData
    });
    return target;
  }

  var sourceIndex = 0;
  var targetIndex = 0;

  var getChunkData = getData && function (i, chunk) {
    return getData(i + targetIndex, chunk);
  };

  var n = Math.min(sourceLayout.length, targetLayout.length);

  for (var i = 0; i < n; i++) {
    var sourceChunkLength = sourceLayout[i] * size;
    var targetChunkLength = targetLayout[i] * size;
    padArrayChunk({
      source: source.subarray(sourceIndex, sourceIndex + sourceChunkLength),
      target: target,
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
      target: target,
      start: targetIndex,
      getData: getChunkData
    });
  }

  return target;
}
//# sourceMappingURL=array-utils.js.map